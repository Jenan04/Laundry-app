// // // src/lib/prisma.ts
// // import { PrismaClient } from '@/generated/prisma';

// // const globalForPrisma = global as unknown as { prisma: PrismaClient };

// // // export const prisma = globalForPrisma.prisma || new PrismaClient();

// // export const prisma =
// //   globalForPrisma.prisma ||
// //   new PrismaClient({
// //     // datasourceUrl: {
// //     //   db: {
// //     //     url: process.env.DATABASE_URL,
// //     //   },
// //     // },
// //     datasourceUrl: process.env.DATABASE_URL,
// //   } as unkown);

// // if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


// // import "dotenv/config";
// // import { PrismaClient } from '../generated/prisma';

// // // import { PrismaClient } from '@prisma/client/edge';

// // const globalForPrisma = global as unknown as { prisma: PrismaClient };

// // export const prisma = globalForPrisma.prisma || new PrismaClient();

// // if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// import { PrismaClient } from "@prisma/client"; // prisma-client-js

// const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// // export const prisma = globalForPrisma.prisma || new PrismaClient({
// //   log: ['query', 'warn', 'error'], // اختياري للتصحيح
// // });
// // export const prisma = globalForPrisma.prisma || new PrismaClient({
// //     datasource: { url:  process.env.DATABASE_URL}

// // })

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: ['error', 'warn'],
//   })

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
