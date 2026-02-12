import GoogleProvider from "next-auth/providers/google";
import { DefaultSession, NextAuthOptions } from "next-auth";
import { authService } from "@/services/authService";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
    interface User {
        role?: string;
        isVerified?: boolean;
        completed?: boolean;
    }
    interface Session {
        user: {
            id: string;
            role?: string; 
            isVerified?: boolean;
            completed?: boolean;
        } & DefaultSession["user"]
    }
    interface JWT {
        id?: string;
        role?: string;
        isVerified?: boolean;
        completed?: boolean;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            // async authorize(credentials) {
            //     if (!credentials?.email || !credentials?.password) return null;
                
            //     const result = await authService.login(credentials.email, credentials.password);
                
            //     if (result && result.user) {
            //         return {
            //             id: result.user.id,
            //             email: result.user.email,
            //             name: result.user.full_name,
            //             role: result.user.role,
            //             completed: result.user.is_completed, 
            //         };
            //     }
            //     return null;
            // }
            // داخل CredentialsProvider في authOptions
async authorize(credentials) {
    // 1. التحقق من وجود الإيميل على الأقل
    if (!credentials?.email) return null;

    // 2. إذا كانت كلمة المرور مفقودة (حالة تسجيل الدخول بعد الـ OTP)
    if (!credentials?.password) {
        // ابحث عن المستخدم وتأكد أنه موثق فعلاً
        const user = await authService.getUserByEmail(credentials.email); 
        if (user && user.is_verifid) {
            return {
                id: user.id,
                email: user.email,
                name: user.full_name,
                role: user.role,
                completed: user.is_completed,
            };
        }
        return null; // ارفض إذا لم يكن موثقاً
    }

    // 3. الحالة العادية (تسجيل الدخول التقليدي بالباسورد)
    const result = await authService.login(credentials.email, credentials.password);
    if (result && result.user) {
        return {
            id: result.user.id,
            email: result.user.email,
            name: result.user.full_name,
            role: result.user.role,
            completed: result.user.is_completed,
        };
    }
    return null;
}
        })
    ],
    
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },

    callbacks: {
        async signIn({ account, user }) {
            if (account?.provider === "google") {
                return !!user.email;
            }
            return true;
        },

        async jwt({ token, user, profile, trigger }) {
            
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.completed = user.completed; 
            }

            if (profile) {
                try {
                    const dbUser = await authService.findOrCreateGoogleUser(
                        { sub: profile.sub!, email: profile.email! },
                        { name: profile.name!, email: profile.email! }
                    );
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.completed = dbUser.is_completed; // نأخذ الحالة الحقيقية من الداتابيز
                } catch (error) {
                    console.error("Google Sync Error:", error);
                }
            }

            if (trigger === "update" && token.id) {
                const updatedUser = await authService.getUserById(token.id as string);
                if (updatedUser) {
                    token.completed = updatedUser.is_completed;
                    token.role = updatedUser.role;
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.completed = token.completed as boolean;
            }
            return session;
        },

        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            else if (new URL(url).origin === baseUrl) return url;
            return `${baseUrl}/dashboard`;
        }
    }
};