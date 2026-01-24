'use client'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Image from 'next/image'

export default function EmailVerification() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('') 
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState<number>(60)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    setEmail(searchParams.get('email') || '')
    inputRefs.current[0]?.focus()
  }, [searchParams])

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

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every(d => d !== '')) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
      const newOtp = [...otp]
      newOtp[index - 1] = ''
      setOtp(newOtp)
    }
  }

  const handleVerify = async (code: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code })
      })
      const data = await res.json()

      if (res.ok) {
        if (data.token) localStorage.setItem('token', data.token)
        if (data.is_profile_complete) router.push('/chat')
        else router.push('/create-profile')
      } else {
        toast.error(data.message || 'Verification failed')
        setOtp(Array(6).fill(''))
        inputRefs.current[0]?.focus()
      }
    } catch (err) {
      console.error(err)
      toast.error('Server error')
    }
  }

  const handleResend = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setTimeLeft(60)
      setOtp(Array(6).fill(''))
      inputRefs.current[0]?.focus()
      toast.success('OTP has been sent again')
    } catch (err: unknown) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : 'Server error')
    }
  }

return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 py-10">
      <div className="p-8 sm:p-12 rounded-lg w-full max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-baseline gap-16 lg:gap-24">
          <div className="md:w-5/12 flex flex-col items-start text-left">
            <div className="flex items-center gap-4 mb-6 cursor-pointer">
              <Image
                src="/assets/sticker.webp"
                alt="Logo"
                width={55} 
                height={55}
                className="object-contain"
              />
              <span className="text-3xl text-[#733F3F] font-bold italic tracking-wide font-serif whitespace-nowrap">
                Yasser&apos;s laundry
              </span>
            </div>
            <div className="space-y-4">
              <p className="text-lg text-[#733F3F]/70 leading-relaxed">
               Please enter the verification code sent to your email
              </p>
            </div>
          </div>

     
          <div className="w-full md:w-7/12 max-w-md p-14  flex flex-col items-center gap-8">
            
            <div className="flex justify-center gap-3 w-full">
              {otp.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => {inputRefs.current[index] = el}}
                  type="text"
                  maxLength={1}
                  value={value}
                  onChange={e => handleChange(e.target.value, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  className="w-14 h-16 text-2xl font-bold text-center border-2 border-[#D6B2B2] rounded-2xl focus:border-[#733F3F] focus:ring-2 focus:ring-[#733F3F]/20 outline-none transition-all bg-gray-50 focus:bg-white"
                />
              ))}
            </div>

            <div className="w-full space-y-4 text-center">
              <p className="text-[#733F3F]/60 text-base">
                Resend code in <span className="font-bold text-[#733F3F]">{Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</span>
              </p>

              <button
                disabled={timeLeft > 0}
                onClick={handleResend}
                 className={`w-full py-3 rounded-full font-bold text-white transition-all mt-2 ${
                  timeLeft > 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#592E2E] hover:bg-[#733F3F] shadow-lg shadow-[#592E2E]/20'
                }`}
              >
                Resend Code
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}


