import { createSchema, createYoga } from 'graphql-yoga';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextAuth';
import { MyContext } from '@/types';


// interface MyContext  {
//   userId?: string | null;
// };

// إعداد السكيمـا
const schema = createSchema({
  typeDefs,
  resolvers,
});


// const { handleRequest } = createYoga<MyContext>({
const yoga = createYoga<MyContext>({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },

   context: async ({ request }) => {
    const session = await getServerSession(authOptions); 
    return {
      session,
      userId: session?.user?.id, // نحطها في الـ context عشان سهلة الوصول
      request,
    };
  },
});


export async function GET(request: Request) {
  return yoga(request);
}

export async function POST(request: Request) {
  return yoga(request);
}

export async function OPTIONS(request: Request) {
  return yoga(request);
}