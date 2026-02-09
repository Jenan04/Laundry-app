'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X} from 'lucide-react';

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-300 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <header className="fixed top-0 left-0 w-full z-50 bg-[#F2E9E9] shadow-sm border-b border-[#D6B2B2]/20">
        <div className="flex justify-between items-center px-6 md:px-[80px] py-4 max-w-7xl mx-auto">
          
          <div className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/assets/sticker.webp"
              alt="Logo"
              width={50}
              height={50}
              className="object-contain"
            />
            <span className="text-xl text-[#733F3F] font-bold italic tracking-wide font-serif">
              Yasser&apos;s laundry
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-[#733F3F] font-medium hover:text-[#D6B2B2] transition">
              Log In
            </Link>
            <Link href="/signup">
              <div className="relative inline-block rounded-[24px] overflow-hidden group">
                <span className="block px-6 py-2 bg-[linear-gradient(123deg,_rgba(115,63,63,1)_0%,_rgba(214,178,178,1)_100%)] text-white font-medium">
                  Get Started
                </span>
                <span className="absolute inset-0 bg-[#733F3F] opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-medium">
                  Get Started
                </span>
              </div>
            </Link>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-[#733F3F] p-2 relative z-50"
            >
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>


            {open && (
              <div 
                ref={dropdownRef}
                className="absolute top-full left-0 w-full bg-[#FCF7F7] shadow-2xl border-t border-gray-100 flex flex-col p-4 space-y-1 z-50 animate-in slide-in-from-top-2 duration-300"
              >

                <div className="pt-4 mt-2  border-gray-100 flex flex-col gap-3">
                   <Link 
                     href="/login" 
                     onClick={() => setOpen(false)}
                     className="w-full text-center py-3 text-[#733F3F] font-medium"
                   >
                     Log In
                   </Link>
                   <Link 
                     href="/signup" 
                     onClick={() => setOpen(false)}
                     className="w-full text-center py-3 bg-[#733F3F] text-white rounded-xl font-medium shadow-md active:scale-95 transition"
                   >
                     Get Started
                   </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="h-[82px]" />
    </>
  );
};

export default Header;