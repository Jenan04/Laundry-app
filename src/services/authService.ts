// src/services/authService.ts
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { GoogleProfile, GoogleUser } from"@/types/index";

export const authService = {
  // 1. إنشاء الحساب الأولي
  async preSignup(email: string, passwordHash: string) {
    const hashedPassword = await bcrypt.hash(passwordHash, 10);
    // هنا يمكن توليد OTP عشوائي وتخزينه في جدول (أو إرساله عبر إيميل)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        full_name: "", // ستملأ لاحقاً
        phone: "",    // ستملأ لاحقاً
        location: "", // ستملأ لاحقاً
        role: 'USER',
        is_verifid: false,
      },
    });
    return user;
  },

  // 2. التحقق من الـ OTP
  async verifyOtp(userId: string, otp: string) {
    // منطق التحقق من الـ OTP هنا...
    return await prisma.user.update({
      where: { id: userId },
      data: { is_verifid: true },
    });
  },

  // 3. إكمال البروفايل
  async completeProfile(userId: string, data: { full_name: string, phone: string, location: string }) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        is_completed: true,
      },
    });
  },

  async createGoogleUser (data: {
    fullname: string,
    email: string;
    googleId: string;
    phone?: string;
    location?: string;
    role?: "USER";
  }) {
    try{
      return prisma.user.create({
      data: {
      full_name: data.fullname,
      email: data.email,
      google_id: data.googleId,
      role: data.role || "USER",
      phone: data.phone || "",
      location: data.location || "",
      is_verifid: true,
      is_completed: false,
      passwordHash: null,
      }, })
    }catch (err){
      throw new Error("Failed to create Google user")
    }
  },




  async findOrCreateGoogleUser(profile: GoogleProfile, user: GoogleUser) {
  try {
    // أولاً جلب المستخدم
    let dbUser = await prisma.user.findUnique({
      where: { google_id: profile.sub }
    });

    if (!dbUser) {
      // إنشاء مستخدم جديد
      dbUser = await prisma.user.create({
        data: {
          full_name: user.name || "no name",
          email: user.email,
          google_id: profile.sub,
          role: "USER",
          phone: "",
          location: "",
          is_verifid: true,
          is_completed: false,
        }
      });
    } else if (!dbUser.is_completed) {
      // فقط حدث الاسم إذا البروفايل لم يكتمل بعد
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          full_name: user.name || dbUser.full_name,
          email: user.email,
        }
      });
    }

    return dbUser;
  } catch (err) {
    console.error("Error in findOrCreateGoogleUser:", err);
    throw new Error("Failed to find or create Google user");
  }
},


  // ✅ دالة مساعدة للحصول على المستخدم بالـ ID (للاستخدام في الـ session)
  async getUserById(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        full_name: true,
        role: true,
        is_verifid: true,
        is_completed: true,
      }
    });
  },

  async isEmailTaken(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    return !!user; // the aim of !! convert the value to boolean type
  }
};