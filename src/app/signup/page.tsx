'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FaGoogle } from "react-icons/fa";
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/index';
import { signupStep1 } from '../../slices/authSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { signIn } from "next-auth/react";

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Validation functions
  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) return 'Please enter a valid email address.';
    return '';
  };

  const validatePassword = (value: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(value))
      return 'Password must be at least 8 characters, include 1 uppercase letter and 1 number.';
    return '';
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) return; // Stop if any error

    try {
      const result = await dispatch(signupStep1({ email, password })).unwrap();
      toast.success('Registration successful! Redirecting to verify...');
      router.push('/verify');
    } catch (error) {
      console.error(error as string);
    }
    
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setEmail(e.target.value);
  if (emailError) setEmailError(''); // إزالة الخطأ فور التعديل
};

const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setPassword(e.target.value);
  if (passwordError) setPasswordError(''); // إزالة الخطأ فور التعديل
};

const handleGoogleSignIn = async () => {
   await signIn("google");
};


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white relative ">
      <div className="w-full max-w-md px-8 py-12 backdrop-blur-sm rounded-3xl border border-[#D6B2B2]/20 relative bg-white/80 shadow-xl z-10 ">
        <div className="flex items-center justify-center gap-3 mb-3 cursor-pointer">
          <Image
            src="/assets/sticker.webp"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-l text-[#733F3F] font-bold italic tracking-wide font-serif whitespace-nowrap">
            Yasser&apos;s laundry
          </span>
        </div>

        <div className="text-center mb-5">
          <p className="text-[#733F3F]/60 ">Join us for a fresh laundry experience</p>
        </div>

        <form className="space-y-4" onSubmit={handleSignUp}>
          {/* Email */}
          <div className="flex flex-col gap-1">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D6B2B2] group-focus-within:text-[#733F3F] transition-colors" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => setEmailError(validateEmail(email))}
              className="w-full pl-12 pr-4 py-4 bg-[#F2E9E9]/50 border border-[#D6B2B2]/30 rounded-full outline-none focus:border-[#733F3F] focus:ring-[.7] focus:ring-[#733F3F] transition-all"
            />
           
          </div> 
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D6B2B2] group-focus-within:text-[#733F3F] transition-colors" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => setPasswordError(validatePassword(password))}
              className="w-full pl-12 pr-12 py-4 bg-[#F2E9E9]/50 border border-[#D6B2B2]/30 rounded-full outline-none focus:border-[#733F3F] focus:ring-[.7] focus:ring-[#733F3F] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D6B2B2] hover:text-[#733F3F]"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            
          </div>
          {passwordError && <p className="text-red-500 text-sm mt-1 min-h-[1.25rem]">{passwordError}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 bg-[#592E2E] text-white rounded-full font-bold text-lg hover:bg-[#733F3F] transition-all shadow-lg shadow-[#592E2E]/20 active:scale-[0.98]"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <p className="text-[#733F3F]/80">
            Do you have an account?{' '}
            <Link href="/login" className="text-[#592E2E] font-bold hover:underline">Login</Link>
          </p>
        </div>

        <div className="flex items-center my-8 gap-4">
          <div className="h-[1px] flex-1 bg-[#D6B2B2]/30"></div>
          <span className="text-[#D6B2B2] text-sm font-medium">OR</span>
          <div className="h-[1px] flex-1 bg-[#D6B2B2]/30"></div>
        </div>

        <button 
        className="w-full py-4 border-2 border-[#D6B2B2]/30 rounded-full flex items-center justify-center gap-3 font-bold text-[#592E2E] hover:bg-[#F2E9E9]/30 transition-all active:scale-[0.98]"
        onClick={handleGoogleSignIn}
        >
          <FaGoogle /> Continue with Google
        </button>

        <div className="mt-4 text-center space-y-4">
          <button className="text-[#D6B2B2] font-medium hover:text-[#733F3F] transition-colors flex items-center gap-2 mx-auto italic">
            Continue as a Guest
          </button>
        </div>

      </div>
    </div>
  );
}
