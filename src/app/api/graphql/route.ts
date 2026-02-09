import { createSchema, createYoga } from 'graphql-yoga';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextAuth';
import { MyContext } from '@/types';


const schema = createSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga<MyContext>({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },

   context: async ({ request }) => {
    const session = await getServerSession(authOptions); 
    return {
      session,
      userId: session?.user?.id, 
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