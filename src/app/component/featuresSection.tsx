'use client';
import Image from 'next/image';

const features = [
  {
    title: "Schedule in Seconds",
    description: "Your time is valuable. Just pick a date and a time slot, and our team will handle the rest. No phone calls, no hassle.",
    image: "/assets/1.webp",
    tag: "CONVENIENCE"
  },
  {
    title: "Track Every Step",
    description: "Stay informed with real-time updates. From the moment we pick up your laundry until it's back at your door.",
    image: "/assets/2.webp",
    tag: "TRANSPARENCY"
  },
  {
    title: "Expert Cleaning",
    description: "We use premium, eco-friendly detergents and professional equipment to give your clothes the care they deserve.",
    image: "/assets/3.webp",
    tag: "QUALITY"
  }
];

export default function FeaturesSlices() {
  return (
    <section className="w-full">
      {features.map((feature, index) => (
        <div 
          key={index}
          // تقليل الـ py من 20 إلى 12 لتقليل المساحة العمودية الكبيرة
          className={`w-full py-12 md:py-16 ${index % 2 === 0 ? 'bg-[#F2E9E9]' : 'bg-white'}`}
        >
          <div className={`max-w-7xl mx-auto px-6 md:px-[80px] flex flex-col md:flex-row items-center justify-between gap-10 ${
            index % 2 === 1 ? 'md:flex-row-reverse' : ''
          }`}>
            
            {/* قسم الصورة - محاذاة مرنة وليس بالضرورة في الوسط */}
            <div className="flex-1 flex justify-center lg:justify-start w-full">
              <div className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px] transition-transform duration-500 hover:scale-105">
                <Image 
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* قسم النص - محاذاة النصوص لتكون موزعة بعيداً عن الصورة */}
            <div className={`flex-1 space-y-4 text-center ${index % 2 === 1 ? 'md:text-left' : 'md:text-left'}`}>
              <span className="text-[#733F3F] font-bold text-xs tracking-[0.2em] uppercase opacity-80">
                {feature.tag}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#592E2E] font-serif italic leading-tight">
                {feature.title}
              </h2>
              <p className="text-[#733F3F]/80 text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                {feature.description}
              </p>
            </div>

          </div>
        </div>
      ))}
    </section>
  );
}