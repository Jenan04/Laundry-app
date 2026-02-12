'use client';
import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { signIn } from "next-auth/react";

export default function EmailVerification() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [verificationToken, setVerificationToken] = useState('')
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(60)
  const [isVerifying, setIsVerifying] = useState(false)
  const [checkingParams, setCheckingParams] = useState(true);
  const inputRefs = useRef<HTMLInputElement[]>([])
  const hasSentOtp = useRef(false);

  useEffect(() => {   
  const emailParam = searchParams.get('email');
  
  if (emailParam) {
    setEmail(emailParam);
    setCheckingParams(false);
  } else {
   
    setCheckingParams(false); 
  }
  }, [searchParams]);

  useEffect(() => {
    if (!checkingParams && !email) {
      toast.error('Invalid session - No email provided');
      router.push('/login');
    }
  }, [checkingParams, email, router]);
    useEffect(() => {
      if (!email || hasSentOtp.current) return

      const sendOtp = async () => {
      hasSentOtp.current = true;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `
                mutation SendVerificationOtp($email: String!) {
                  sendVerificationOtp(email: $email) {
                    verificationToken
                  }
                }
              `,
              variables: { email }
            })
          }
        )

        const result = await res.json()

        if (result.errors) {
          toast.error('Failed to send verification code')
          return
        }

        setVerificationToken(
          result.data.sendVerificationOtp.verificationToken
        )

        setOtp(Array(6).fill(''))
        setTimeLeft(60)
        inputRefs.current[0]?.focus()

      } catch {
        hasSentOtp.current = false;
        toast.error('Network error')
      }
      }

      sendOtp()
    }, [email])

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every(d => d !== '')) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }


const handleVerify = async (code: string) => {
    if (!verificationToken) {
      toast.error('Session expired');
      return;
    }

    setIsVerifying(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              mutation VerifyStep2($otp: String!, $verificationToken: String!) {
                verifyStep2(otp: $otp, verificationToken: $verificationToken) {
                  token
                  user {
                    is_completed
                  }
                }
              }
            `,
            variables: { otp: code, verificationToken }
          })
        }
      );

      const result = await res.json();

    if (result.errors) {
      const errorMsg = result.errors[0]?.message;

    if (errorMsg === 'ALREADY_VERIFIED') {
        await completeSignIn(false); 
        return;
      }

      toast.error('Invalid or expired code');
      setOtp(Array(6).fill(''));
      inputRefs.current[0]?.focus();
      return;
    }

    const { token, user } = result.data.verifyStep2;
    localStorage.setItem('token', token);

    await completeSignIn(user.is_completed);
      
    } catch (error) {
      toast.error('Network error');
    } finally {
      setIsVerifying(false);
    }
  };
  const completeSignIn = async (isCompleted: boolean) => {
  const nextAuthSignIn = await signIn("credentials", {
    email: email, 
    redirect: false,
  });

  if (nextAuthSignIn?.error) {
    toast.error('Session synchronization failed. Redirecting to login...');
    setTimeout(() => router.push('/login'), 2000);
    return;
  }
  
  toast.success('Access granted successfully');
  router.push(isCompleted ? '/chat' : '/create-profile');
};

  const handleResend = async () => {
    if (timeLeft > 0) return

    toast.loading('Sending new code...')

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              mutation SendVerificationOtp($email: String!) {
                sendVerificationOtp(email: $email) {
                  verificationToken
                }
              }
            `,
            variables: { email }
          })
        }
      )

      const result = await res.json()

      if (result.errors) {
        toast.error('Failed to resend code')
        return
      }

      setVerificationToken(
        result.data.sendVerificationOtp.verificationToken
      )

      setOtp(Array(6).fill(''))
      setTimeLeft(60)
      inputRefs.current[0]?.focus()
      toast.success('New code sent')

    } catch {
      toast.error('Network error')
    }
  }
if (checkingParams) {
  return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 py-10">
      <div className="p-8 sm:p-12 rounded-lg w-full max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between gap-16">

          <div className="md:w-5/12">
            <div className="flex items-center gap-4 mb-6">
              <Image src="/assets/sticker.webp" alt="Logo" width={55} height={55} />
              <span className="text-3xl text-[#733F3F] font-bold italic">
                Yasser&apos;s Laundry
              </span>
            </div>

            <p className="text-lg text-[#733F3F]/70">
              Please enter the verification code sent to
              <br />
              <span className="font-bold">{email}</span>
            </p>
          </div>

          <div className="md:w-7/12 max-w-md flex flex-col items-center gap-8">

            <div className="flex gap-3">
              {otp.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    // inputRefs.current[index] = el;
                    if (el) {
                        inputRefs.current[index] = el;
                      }
                  }}
                  value={value}
                  maxLength={1}
                  disabled={isVerifying}
                  onChange={e => handleChange(e.target.value, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  className="w-14 h-16 text-2xl font-bold text-center border-2 rounded-2xl"
                />
              ))}
            </div>

            <div className="text-center w-full">
              <p className="text-sm text-gray-500">
                Resend in {timeLeft}s
              </p>

              <button
                onClick={handleResend}
                disabled={timeLeft > 0 || isVerifying}
                className="mt-4 w-full py-3 rounded-full font-bold text-white bg-[#733F3F] disabled:bg-gray-300"
              >
                {isVerifying ? 'Verifying...' : 'Resend Code'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
