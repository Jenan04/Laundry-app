'use client';
import Link from 'next/link';
import WasherScene from './happyWasher';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    // className='bg-[#F5F0F0]'
    <div>
    <section className="flex flex-col-reverse md:flex-row items-center justify-between px-4 md:px-12 py-10 md:py-16 max-w-7xl mx-auto">
      <div className="max-w-7xl mx-auto px-6  grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        <div className="space-y-6">
          <h1 className="text-4xl text-[#592E2E] md:text-5xl lg:text-5xl font-bold  leading-tight font-bold italic tracking-wide font-serif">
            Smarter Laundry.<br /> Faster. Stress-Free.
          </h1>

          <p className="text-[#D6B2B2] text-l max-w-xl italic tracking-wide font-serif">
            We turn laundry from a boring chore into a smooth experience.
            Schedule pickups, track orders, and get fresh clothes — all in one place.
          </p>

          <div className="flex  pt-6">
           <Link
             href="/signup"
             className="
               group relative overflow-hidden
               flex items-center gap-3
               px-10 py-4
               rounded-full
               text-white text-lg font-semibold
               shadow-md hover:shadow-lg
               transition-all duration-300
               bg-[linear-gradient(123deg,_rgba(115,63,63,1)_0%,_rgba(214,178,178,1)_100%)]
             "
           >

             <span
               className="
                 absolute inset-0
                 bg-[#733F3F]
                 opacity-0
                 group-hover:opacity-100
                 transition-opacity duration-300
                 rounded-full
               "
             />

             <span className="relative z-10 flex items-center gap-3">
               Get Started
               <ArrowRight
                 size={22}
                 className="transition-transform duration-300 group-hover:translate-x-1"
               />
             </span>
           </Link>
         </div>

        </div>

        <div className="relative h-[420px] md:h-[520px]">
          <WasherScene />
        </div>
      </div>
    </section>
    </div>
  );
}
