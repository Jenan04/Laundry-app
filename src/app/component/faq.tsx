'use client';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "How long does the laundry take?",
    answer: "Our standard turnaround time is 24 hours. We pick up today and deliver back fresh tomorrow."
  },
  {
    question: "Do you handle delicate fabrics?",
    answer: "Yes, we treat every item according to its care label. Special items like silk or wool are handled with extra care."
  },
  {
    question: "What if I'm not home during pickup?",
    answer: "You can leave your laundry in a safe spot and let us know, or reschedule via our app/website."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 md:px-[80px]">
        <hr className="border-t border-[#D6B2B2]/30 mb-20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-[80px] ">
        <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-[#592E2E] font-serif italic mb-12   ">
          Common Questions
        </h2>
        <div className="w-24 h-1 bg-[#D6B2B2] mx-auto rounded-full opacity-50" />
        </div>
        
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-[#D6B2B2]/30 pb-4">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center text-left py-4 group"
              >
                <span className="text-xl font-bold text-[#592E2E] group-hover:text-[#733F3F] transition-colors">
                  {faq.question}
                </span>
                {openIndex === index ? <Minus size={20}/> : <Plus size={20}/>}
              </button>
              
              {openIndex === index && (
                <div className="text-[#733F3F]/80 text-lg pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}