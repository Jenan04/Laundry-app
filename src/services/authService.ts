import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { GoogleProfile, GoogleUser } from"@/types/index";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from '@/lib/mailer';
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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const verificationToken = jwt.sign(
      { userId: user.id, otp },
      process.env.JWT_SECRET || 'otp_secret_key',
      { expiresIn: '5m' }
    );

    console.log(`OTP for ${email}: ${otp}`); 
    await sendOTPEmail(email, otp);

    return { user, verificationToken };
  },

  async verifyOtpLogic(otp: string, verificationToken: string) {
    try {
      const decoded = jwt.verify(
        verificationToken,
        process.env.JWT_SECRET || 'otp_secret_key'
      ) as { userId: string, otp: string };

      if (decoded.otp !== otp) {
        throw new Error("INVALID_OTP");
      }

      return await prisma.user.update({
        where: { id: decoded.userId },
        data: { is_verifid: true },
      });
    } catch (err) {
      throw new Error("OTP_EXPIRED_OR_INVALID");
    }
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
      is_verifid: user.is_verifid,
      role: user.role,
      is_completed: user.is_completed,
    },
  } 
  },
  async sendVerificationOtp(email: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (user.is_verifid) {
      throw new Error("ALREADY_VERIFIED");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const verificationToken = jwt.sign(
      { userId: user.id, otp },
      process.env.JWT_SECRET!,
      { expiresIn: '5m' }
    );

    await sendOTPEmail(email, otp);

    return {
      verificationToken,
      user
    };
  } 
};