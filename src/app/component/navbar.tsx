"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(()=>{
    const hasToken = document.cookie.includes("token");
    if(hasToken) setIsLogged(true)
  },[])

  const navLinks = [
    {
      name: "Home",
      href: "/home",
      d: "M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z",
      mr: "mr-8",
    },
    {
      name: "Plan",
      href: "/plan",
      d: "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm80-80h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm200-190q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z",
      mr: "mr-8",
    },
    {
      name: "Jobs",
      href: "/jobs",
      d: "M160-120q-33 0-56.5-23.5T80-200v-440q0-33 23.5-56.5T160-720h160v-80q0-33 23.5-56.5T400-880h160q33 0 56.5 23.5T640-800v80h160q33 0 56.5 23.5T880-640v440q0 33-23.5 56.5T800-120H160Zm240-600h160v-80H400v80Zm400 360H600v80H360v-80H160v160h640v-160Zm-360 0h80v-80h-80v80Zm-280-80h200v-80h240v80h200v-200H160v200Zm320 40Z",
      mr: "mr-8",
    },
    {
      name: "AIBot",
      href: "/chat_ai",
      d: "M8 2a.75.75 0 0 0-.75.75V5H5.5a2.99 2.99 0 0 0-2.957 2.5H2.5C1.68 7.5 1 8.18 1 9v1c0 .82.68 1.5 1.5 1.5h.043A2.99 2.99 0 0 0 5.5 14h5a2.99 2.99 0 0 0 2.957-2.5h.043c.82 0 1.5-.68 1.5-1.5V9c0-.82-.68-1.5-1.5-1.5h-.043A2.99 2.99 0 0 0 10.5 5H8.75V2.75A.75.75 0 0 0 8 2M6 6.75c.686 0 1.25.564 1.25 1.25S6.686 9.25 6 9.25S4.75 8.686 4.75 8S5.314 6.75 6 6.75m4 0c.686 0 1.25.564 1.25 1.25S10.686 9.25 10 9.25S8.75 8.686 8.75 8S9.314 6.75 10 6.75m-4.5 4h5a.75.75 0 0 1 .75.75a.75.75 0 0 1-.75.75h-5a.75.75 0 0 1-.75-.75a.75.75 0 0 1 .75-.75",
      viewBox: "0 0 16 16",
      mr: "mr-5",
    },
    {
      name: "Community",
      href: "/community",
      d: "M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z",
      mr: "mr-5",
    },
    {
      name: "Me",
      href: "/profile",
      d: "M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z",
      mr: "mr-0",
    },
  ];
  return (
    <nav className="w-full bg-white shadow-md px-6 py-2 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      {' '}
      {/* Logo */}
      <Link href="/">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-[#9333EA] to-[#2563EB]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              fill="white"
            >
              <path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-black">LevelUp</span>
        </div>
      </Link>
      {/* Links */}
      {isLogged ? (
        <div>
          <button className="px-5 py-2 text-white text-sm font-medium cursor-pointer rounded-full bg-gradient-to-r from-[#9333EA] to-[#2563EB]">
            Get Started
          </button>
        </div>
      ) : (
        <div>
          <div
            className={`flex-col pb-1 md:pb-0 md:flex-row md:flex md:shadow-none md:items-center absolute md:static bg-white md:bg-transparent left-0 w-full md:w-auto transition-all duration-300 ease-in-out ${
              open
                ? 'top-16 opacity-100 shadow-lg z-10'
                : 'top-[-500px] opacity-0 md:opacity-100'
            }`}
          >
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex flex-row justify-start py-3 gap-2 mx-3 md:gap-0 md:py-0 md:flex-col items-center px-3 relative group rounded-lg transition-all duration-300
              ${
                active &&
                'md:bg-transparent bg-gradient-to-r from-[#9333EA]/10 to-[#2563EB]/10'
              }
            `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox={link.viewBox || '0 -960 960 960'}
                  >
                    <defs>
                      <linearGradient
                        id={`grad-${link.name}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#9333EA" />
                        <stop offset="100%" stopColor="#2563EB" />
                      </linearGradient>
                    </defs>
                    <path fill={`url(#grad-${link.name})`} d={link.d}></path>
                  </svg>
                  <span className="text-xs font-medium tracking-wider bg-gradient-to-r from-[#9333EA] to-[#2563EB] bg-clip-text text-transparent mt-[1.5px]">
                    {link.name}
                  </span>
                  {/* underline */}
                  <div
                    className={`absolute -bottom-2 left-0 right-0 h-[2px] rounded-full origin-center transition-transform duration-300 transform
                ${
                  active
                    ? 'scale-x-100 bg-transparent md:bg-gradient-to-r from-[#9333EA] to-[#2563EB]'
                    : 'scale-x-0 bg-transparent'
                }`}
                  />
                </Link>
              );
            })}
          </div>

          <button
            className="md:hidden cursor-pointer z-20"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30px"
              fill="#1f1f1f"
              height="30px"
              viewBox="0 0 640 640"
            >
              <defs>
                <linearGradient id={`grad`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9333EA" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#grad)`}
                d="M96 160C96 142.3 110.3 128 128 128L512 128C529.7 128 544 142.3 544 160C544 177.7 529.7 192 512 192L128 192C110.3 192 96 177.7 96 160zM96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320zM544 480C544 497.7 529.7 512 512 512L128 512C110.3 512 96 497.7 96 480C96 462.3 110.3 448 128 448L512 448C529.7 448 544 462.3 544 480z"
              />
            </svg>
          </button>
        </div>
      )}
    </nav>
  );
}
