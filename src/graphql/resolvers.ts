// src/graphql/resolvers.ts
/* الريسولفر= اللوجيك الفعلي الي بتنفذ مع استدعاء اي كويري او ميوتيشن 
=بينفذ الاوبيريشنز الي وعدنا فيها السكيما وبيرجع الداتا الحقيقية
= هي العقدة العملية 
*/
import { authController } from '@/controllers/authController';
import { MyContext } from '@/types/index';
export const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: MyContext) => { 
      if (!context.userId) {
        throw new Error('Not authenticated');
      }
      // يمكنك جلب بيانات المستخدم من DB هنا
      return context.session?.user;
     },
  },
  Mutation: {
    signupStep1: authController.signupStep1,
    verifyStep2: authController.verifyStep2,
    completeStep3: authController.completeStep3,
  },
};