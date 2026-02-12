// src/graphql/schema.ts
/*بيقول للgrapjql شو الداتا تايب والالوز api operations 
= العقدة النظرية
 */
export const typeDefs = `
  type User {
    id: ID!
    email: String!
    full_name: String
    phone: String
    location: String
    is_verifid: Boolean!
    is_completed: Boolean!
    role: String!
  }

  type AuthResponse {
   message: String
    # هذا التوكن يحمل الـ OTP المشفر بداخله (يستخدم فقط للتحقق)
    verificationToken: String
     token: String
    user: User
  }

  type CheckEmailResponse {
  isTaken: Boolean!
 }

  input ProfileInput {
    full_name: String!
    phone: String!
    location: String!
  }

  type Query {
    me: User
    checkEmail(email: String!): CheckEmailResponse!
  }

  type Mutation {
    # الخطوة 1: ايميل وباسورد
    signupStep1(email: String!, passwordHash: String!): AuthResponse!
    
    # الخطوة 2: كود التحقق
    #verifyStep2(userId: String!, otp: String!): User!
    verifyStep2(otp: String!, verificationToken: String!): AuthResponse!
    # الخطوة 3: إكمال البيانات
    completeStep3(profileData: ProfileInput!): User!
    login(email: String!, password: String!): AuthResponse!
     sendVerificationOtp(email: String!): AuthResponse!
  }
`;