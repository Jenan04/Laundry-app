import { authService } from '@/services/authService';
import jwt from 'jsonwebtoken';
import { MyContext, GoogleArgs } from "@/types/index";

interface SignupArgs {
  email: string;
  passwordHash: string; 
}

interface VerifyArgs {
  otp: string; 
  verificationToken: string;
}

interface ProfileInput {
  full_name: string;
  phone: string;
  location: string;
}

interface LoginResult {
  user: {
    id: string;
    email: string;
    full_name?: string;
    role?: string;
    is_verifid?: boolean;
    is_completed?: boolean;
  };
}
export const authController = {

  async checkEmailTaken(_parent: unknown, args: { email: string}) {
    try {
      const taken = await authService.isEmailTaken(args.email)
      return { isTaken: taken };
    } catch(err) {
      throw new Error("Failed to check email");
    }
  },

  signupStep1: async (_: unknown, { email, passwordHash }: SignupArgs) => {
    try {
      const { user} = await authService.preSignup(email, passwordHash);

      const userWithDefaults = {
        ...user,
        is_verifid: user.is_verifid ?? false,
        is_completed: user.is_completed ?? false,
        full_name: user.full_name ?? "",
        role: user.role ?? "USER",
      };

      return { user: userWithDefaults };
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  },

  verifyStep2: async (_: unknown, { otp, verificationToken }: VerifyArgs) => {
    try {
      const user = await authService.verifyOtpLogic(otp, verificationToken);

      const userWithDefaults = {
        ...user,
        is_verifid: user.is_verifid ?? false,
        is_completed: user.is_completed ?? false,
        full_name: user.full_name ?? "",
        role: user.role ?? "USER",
      };

      const token = jwt.sign(
        { userId: userWithDefaults.id, role: userWithDefaults.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      return { user: userWithDefaults, token };
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  },

  completeStep3: async (
    _: unknown, 
    { profileData }: { profileData: ProfileInput }, 
    context: MyContext
  ) => {
    const userId = context.userId;
    if (!userId) throw new Error('Unauthorized: Please sign in first');

    try {
      const updatedUser = await authService.completeProfile(userId, profileData);

      const userWithDefaults = {
        ...updatedUser,
        is_verifid: updatedUser.is_verifid ?? false,
        is_completed: updatedUser.is_completed ?? false,
        full_name: updatedUser.full_name ?? "",
        role: updatedUser.role ?? "USER",
      };

      return userWithDefaults;
    } catch (error) {
      throw new Error('Failed to complete profile');
    }
  },

  googleSignIn: async (_: unknown, { profile, user }: GoogleArgs) => {
    try {
      const userId = await authService.findOrCreateGoogleUser(profile, user);
      const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      return { userId, token };
    } catch (error) {
      throw new Error('Google Sign-In failed');
    }
  },


login: async (_: unknown, args: { email: string, password: string }) => {
  const result: LoginResult = await authService.login(args.email, args.password);

  const userWithDefaults = {
    ...result.user,
    is_verifid: result.user.is_verifid ?? false,
    is_completed: result.user.is_completed ?? false,
    full_name: result.user.full_name ?? "",
    role: result.user.role ?? "USER",
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret is missing");
  }

  const token = jwt.sign(
    { userId: userWithDefaults.id, role: userWithDefaults.role },
    secret,
    { expiresIn: '7d' }
  );

  return { user: userWithDefaults, token };
},

  sendVerificationOtp: async (_: unknown, { email }: { email: string }) => {
  try {
    const result = await authService.sendVerificationOtp(email);

    const userWithDefaults = result.user ? {
          ...result.user,
          is_verifid: result.user.is_verifid ?? false,
          is_completed: result.user.is_completed ?? false,
          full_name: result.user.full_name ?? "",
          role: result.user.role ?? "USER",
        } : null;

    return { 
      verificationToken: result.verificationToken, 
      user: userWithDefaults 
    };
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "FAILED_TO_SEND_OTP");
  }
},
};
