'use client';
import { Smartphone, Truck, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    title: "Order Online",
    desc: "Book a pickup via our app or website in seconds.",
    icon: <Smartphone size={32} className="text-[#733F3F]" />
  },
  {
    title: "We Pick Up",
    desc: "Our driver collects your laundry from your doorstep.",
    icon: <Truck size={32} className="text-[#733F3F]" />
  },
  {
    title: "Clean & Fresh",
    desc: "We deliver your clothes back clean, folded, and ready to wear.",
    icon: <CheckCircle2 size={32} className="text-[#733F3F]" />
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-[80px]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#592E2E] font-serif italic mb-4">
            How it works
          </h2>
          <div className="w-20 h-1 bg-[#D6B2B2] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4 group">
              <div className="w-20 h-20 bg-[#F2E9E9] rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-[#592E2E] font-serif">{step.title}</h3>
              <p className="text-[#733F3F]/70 leading-relaxed max-w-[250px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}