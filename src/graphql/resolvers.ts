// src/graphql/resolvers.ts
/* الريسولفر= اللوجيك الفعلي الي بتنفذ مع استدعاء اي كويري او ميوتيشن 
=بينفذ الاوبيريشنز الي وعدنا فيها السكيما وبيرجع الداتا الحقيقية
= هي العقدة العملية 
*/
import { authController } from '@/controllers/authController';
import { MyContext } from '@/types/index';
/*
resolver has a 4 params (parent, args, context, info)
- parent: it has a result of the uuper resolver
- args: it has an arguments who customer that send it 
ex: if we have mutation checkEmail(email: a@gmail..) , the args are { email: ""}

- context: it has a common data between reslovers as db the current user has a session ..
- info: it contains on the info about query (selection set..)
 */
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