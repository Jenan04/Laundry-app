// src/controllers/authController.ts
import { authService } from '@/services/authService';
import jwt from 'jsonwebtoken';
import { GoogleArgs } from "@/types/index";
// import { GraphQLError } from 'graphql';
// import { CustomSession } from '@/types/index';
import { MyContext } from '@/types/index';

interface SignupArgs {
  email: string;
  passwordHash: string; // تأكدي من تسميته password في الـ schema
}

interface VerifyArgs {
  userId: string;
  otp: string;
}

// interface ProfileArgs {
//   userId: string;
//   profileData: {
//     full_name: string;
//     phone: string;
//     location: string;
//   };
// }

interface ProfileInput {
  full_name: string;
  phone: string;
  location: string;
}

export const authController = {

  async checkEmailTaken(_parent: unknown, args: { email: string}) {
    try{
      const taken = await authService.isEmailTaken(args.email)
      return{ isTaken: taken};
    } catch(err){
      throw new Error("faild to check email")
    }
  },

  signupStep1: async (_: unknown, { email, passwordHash }: SignupArgs) => {
    const user = await authService.preSignup(email, passwordHash);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret');
    return { user, token };
  },
  
  verifyStep2: async (_: unknown, { userId, otp }: VerifyArgs) => {
    const user = await authService.verifyOtp(userId, otp);
    return user;
  },

completeStep3: async (
    _: unknown, 
    { profileData }: { profileData: ProfileInput }, 
    // context: { userId?: string; session?: CustomSession }
    context: MyContext
  ) => {
    // ✅ 1. تحقق من وجود userId في الـ context (من NextAuth session)
    const userId = context.userId;
    
    if (!userId) {
      throw new Error('Unauthorized: Please sign in first');
    }

    console.log('Completing profile for user:', userId);

    try {
      // ✅ 2. حفظ البيانات في الـ database
      const updatedUser = await authService.completeProfile(userId, profileData);
      
      console.log('Profile completed successfully:', updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Error completing profile:', error);
      throw new Error('Failed to complete profile');
    }
  },

   googleSignIn: async (_: unknown, { profile, user }: GoogleArgs) => {
    try {
      // 1. البحث عن user موجود أو إنشاء جديد
      const userId = await authService.findOrCreateGoogleUser(profile, user);

      // 2. إنشاء JWT
      const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

      // 3. ارجاع userId + token → تستخدمهم frontend لل redirect / session
      return { userId, token };
    } catch (err) {
      throw new Error('Google Sign-In failed');
    }
  }
};