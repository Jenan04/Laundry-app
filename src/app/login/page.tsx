'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FaGoogle } from "react-icons/fa";
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LogIn() {
  const [showPassword, setShowPassword] = useState(false);


  const handleGoogleSignIn = async () => {
     await signIn("google");
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white relative p-4">
      
      <div className="w-full max-w-md px-8 py-12 backdrop-blur-sm rounded-3xl border border-[#D6B2B2]/20 relative bg-white/80 shadow-xl z-10">
        
        {/* اللوجو */}
        <div className="flex items-center justify-center gap-3 mb-3 cursor-pointer">
          <Image
            src="/assets/sticker.webp"
            alt="Logo"
            width={40} 
            height={40}
            className="object-contain"
          />
          <span className="text-xl text-[#733F3F] font-bold italic tracking-wide font-serif whitespace-nowrap">
            Yasser&apos;s laundry
          </span>
        </div>

        {/* النص الفرعي */}
        <div className="text-center mb-8">
          <p className="text-[#733F3F]/60">Join us for a fresh laundry experience</p>
        </div>

        <form className="space-y-4">
          {/* حقل الإيميل */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D6B2B2] group-focus-within:text-[#733F3F] transition-colors" size={20} />
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-4 bg-[#F2E9E9]/50 border border-[#D6B2B2]/30 rounded-full outline-none focus:border-[#733F3F] focus:ring-1 focus:ring-[#733F3F] transition-all"
            />
          </div>

          {/* حاوية الباسورد والرابط */}
          <div className="flex flex-col">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D6B2B2] group-focus-within:text-[#733F3F] transition-colors" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
                className="w-full pl-12 pr-12 py-4 bg-[#F2E9E9]/50 border border-[#D6B2B2]/30 rounded-full outline-none focus:border-[#733F3F] focus:ring-1 focus:ring-[#733F3F] transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D6B2B2] hover:text-[#733F3F]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* رابط نسيت كلمة السر - تم تعديله ليكون طبيعي (بدون absolute) لكي يعمل المارجن */}
            <div className="flex justify-end mt-2 px-2">
              <Link href="/forgot-password" 
                className="text-xs text-[#733F3F]/60 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          {/* زر تسجيل الدخول - الآن المارجن توب سيعمل بشكل صحيح */}
          <button className="w-full py-4 bg-[#592E2E] text-white rounded-full font-bold text-lg hover:bg-[#733F3F] transition-all shadow-lg shadow-[#592E2E]/20 active:scale-[0.98] mt-2">
            Log In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#733F3F]/80">
            Don&apos;t have an account? {' '}
            <Link href="/signup" className="text-[#592E2E] font-bold hover:underline">Sign Up</Link>
          </p>
        </div>

        {/* فاصل */}
        <div className="flex items-center my-8 gap-4">
          <div className="h-[1px] flex-1 bg-[#D6B2B2]/30"></div>
          <span className="text-[#D6B2B2] text-sm font-medium">OR</span>
          <div className="h-[1px] flex-1 bg-[#D6B2B2]/30"></div>
        </div>

        {/* زر جوجل */}
        <button 
        onClick={handleGoogleSignIn}
        className="w-full py-4 border-2 border-[#D6B2B2]/30 rounded-full flex items-center justify-center gap-3 font-bold text-[#592E2E] hover:bg-[#F2E9E9]/30 transition-all active:scale-[0.98]">
          <FaGoogle /> Continue with Google
        </button>

      </div>
    </div>
  );
}