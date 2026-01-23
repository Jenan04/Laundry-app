import { prisma } from '@/lib/prisma';

export const createProfileService = {
  async createUserProfile(userId: string, fullName: string, phone: string, location: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found');

   const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        full_name: fullName,
        phone: phone,
        location: location,
        updatedAt: new Date(),
        is_completed: true,
      },
    });
   return updatedUser;

  }
}