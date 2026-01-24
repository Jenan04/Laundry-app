// src/services/authService.ts
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { GoogleProfile, GoogleUser } from"@/types/index";
import jwt from "jsonwebtoken";

export const authService = {

  async preSignup(email: string, passwordHash: string) {
    const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }
    const hashedPassword = await bcrypt.hash(passwordHash, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        full_name: "", 
        phone: "",    
        location: "", 
        role: 'USER',
        is_verifid: false,
      },
    });
    return user;
  },

  async verifyOtp(userId: string, otp: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { is_verifid: true },
    });
  },

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
    let dbUser = await prisma.user.findUnique({
      where: { google_id: profile.sub }
    });

    if (!dbUser) {
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
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    })
    if (!user || !user.passwordHash) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      is_completed: user.is_completed,
    },
  } 
  }
};