'use client';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const bubbles = Array.from({ length: 12 });

  return (

    
    <footer className="relative bg-[#592E2E] pt-24 pb-12 overflow-hidden">
      
      {/* تأثير الموجة (SVG) */}
      {/* <div className="absolute top-0 left-0 w-full overflow-hidden line-height-0 transform rotate-180">
        <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
        </svg>
      </div> */}

      {bubbles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 bg-white/20 rounded-full pointer-events-none"
          initial={{ y: 100, x: Math.random() * 1500, opacity: 0.2, scale: Math.random() * 0.5 + 0.5 }}
          animate={{ 
            y: -800, 
            opacity: [0, 0.4, 0],
          }}
          transition={{ 
            duration: Math.random() * 5 + 5, 
            repeat: Infinity, 
            delay: Math.random() * 5 
          }}
          style={{ width: `${Math.random() * 40 + 10}px`, height: `${Math.random() * 40 + 10}px` }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-6 md:px-[80px] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-white/90">
          
          <div className="space-y-6 text-center md:text-left">
            <h3 className="text-2xl font-bold font-serif italic">Contact Us</h3>
            <div className="space-y-3">
              <a href="tel:+123456789" className="flex items-center justify-center md:justify-start gap-3 hover:text-white transition-colors">
                <Phone size={20} /> <span>+970 599 000 000</span>
              </a>
              <a href="mailto:info@yasserlaundry.com" className="flex items-center justify-center md:justify-start gap-3 hover:text-white transition-colors">
                <Mail size={20} /> <span>yasser.laundry@gmail.com</span>
              </a>
            </div>
          </div>

          <div className="space-y-6 text-center">
            <h3 className="text-2xl font-bold font-serif italic">Services</h3>
            <ul className="space-y-2 opacity-80">
              <li>Dry Cleaning</li>
              <li>Wash & Fold</li>
              <li>Ironing Service</li>
              <li>Express Delivery</li>
            </ul>
          </div>

          <div className="space-y-6 text-center md:text-right">
            <h3 className="text-2xl font-bold font-serif italic text-white">Follow Us</h3>
            <div className="flex justify-center md:justify-end gap-6">
              <a href="#" className="hover:scale-125 transition-transform"><Facebook size={24} /></a>
              <a href="#" className="hover:scale-125 transition-transform"><Twitter size={24} /></a>
              <a href="#" className="hover:scale-125 transition-transform"><Linkedin size={24} /></a>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} Yasser&apos;s Laundry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

