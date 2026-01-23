// src/graphql/schema.ts
/*بيقول للgrapjql شو الداتا تايب والالوز api operations 
= العقدة النظرية
 */
export const typeDefs = `
  type User {
    id: ID!
    email: String!
    full_name: String!
    phone: String
    location: String
    is_verifid: Boolean!
    is_completed: Boolean!
    role: String!
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  input ProfileInput {
    full_name: String!
    phone: String!
    location: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    # الخطوة 1: ايميل وباسورد
    signupStep1(email: String!, passwordHash: String!): AuthResponse!
    
    # الخطوة 2: كود التحقق
    verifyStep2(userId: String!, otp: String!): User!
    
    # الخطوة 3: إكمال البيانات
    completeStep3(profileData: ProfileInput!): User!
  }
`;