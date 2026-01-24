import { authService } from '@/services/authService';
import jwt from 'jsonwebtoken';
import { GoogleArgs } from "@/types/index";

import { MyContext } from '@/types/index';


interface SignupArgs {
  email: string;
  passwordHash: string; 
}

interface VerifyArgs {
  userId: string;
  otp: string;
}

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
    context: MyContext
  ) => {

    const userId = context.userId;
    
    if (!userId) {
      throw new Error('Unauthorized: Please sign in first');
    }

    console.log('Completing profile for user:', userId);

    try {
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
      const userId = await authService.findOrCreateGoogleUser(profile, user);

      const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

      return { userId, token };
    } catch (err) {
      throw new Error('Google Sign-In failed');
    }
  },

  login: async (_: unknown, args: {email: string, password: string }) => {
    return await authService.login(args.email, args.password);
  }
};