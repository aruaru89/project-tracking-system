"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// ✅ ย้าย slides มาไว้ด้านนอกฟังก์ชันเพื่อแก้ปัญหา useEffect ขีดแดง
const slides = ["/slide1.png", "/slide2.png", "/slide3.png"];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // ตรวจสอบสถานะการ Login
    const status = localStorage.getItem('isLoggedIn');
    if (status === 'true') setIsLoggedIn(true);

    // ระบบเลื่อนสไลด์อัตโนมัติทุก 4 วินาที
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    
    return () => clearInterval(timer);
  }, []); // ✅ ปรับวงเล็บตรงนี้ให้เป็น Array ว่าง

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    window.location.reload();
  };

  const goToSlide = (index: number) => setCurrentIndex(index);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] flex flex-col" style={{ fontFamily: "'Prompt', 'IBM Plex Sans Thai', 'Noto Sans Thai', sans-serif" }}>
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 pt-5 pb-2 px-6 bg-[#FAFAFA]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto bg-white border border-[#E5E7EB] rounded-3xl py-3 px-6 shadow-sm flex justify-between items-center gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* โลโก้แบบวงกลมสมบูรณ์ */}
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
              <img src="/logo.jpeg" alt="โลโก้ อมธ" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block leading-tight pr-2">
              <h1 className="text-[#111827] font-bold text-[15px]">Project Tracking System</h1>
              <p className="text-[#6B7280] text-[11px] mt-0.5">องค์การนักศึกษา อมธ.ส่วนกลาง</p>
            </div>
          </div>

          {/* เมนูตรงกลาง */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href="/" className="bg-[#650014] text-white px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium shadow-sm">
              หน้าหลัก
            </Link>
            <Link href="/projects" className="text-[#6B7280] hover:text-[#650014] hover:bg-gray-50 px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer">
              โครงการ
            </Link>
            <Link href="/reports" className="text-[#6B7280] hover:text-[#650014] hover:bg-gray-50 px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer">
              รายงาน
            </Link>
            <Link href="/users" className="text-[#6B7280] hover:text-[#650014] hover:bg-gray-50 px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer">
              ผู้ใช้งาน
            </Link>
            <Link href="/account" className="text-[#6B7280] hover:text-[#650014] hover:bg-gray-50 px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer">
              บัญชี
            </Link>
          </div>

          {/* ปุ่ม Login/Logout */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 h-[44px] rounded-full text-sm font-medium transition-colors">ออกจากระบบ</button>
            ) : (
              <>
                <Link href="/register" className="text-[#650014] border border-[#650014] hover:bg-[#650014] hover:text-white px-6 h-[44px] flex items-center rounded-full text-sm font-medium transition-all">
                  สมัครสมาชิก
                </Link>
                <Link href="/login" className="bg-[#650014] hover:bg-[#7A001A] text-white px-6 h-[44px] flex items-center rounded-full text-sm font-medium transition-all">
                  เข้าสู่ระบบ
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl w-full mx-auto px-6 py-10 flex-grow">
        <div className="w-full mb-6 text-left"><h2 className="text-2xl font-bold text-[#111827]">ประกาศต่าง ๆ ของมหาวิทยาลัยธรรมศาสตร์</h2></div>
        
        {/* สไลด์ภาพ */}
        <div className="relative w-full max-w-7xl mx-auto h-[250px] sm:h-[400px] md:h-[500px] bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-md group">
          <div className="flex h-full transition-transform duration-700" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {slides.map((slide, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 bg-white">
                <img src={slide} alt={`สไลด์ ${index + 1}`} className="w-full h-full object-cover sm:object-contain" />
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button key={index} onClick={() => goToSlide(index)} className={`w-3 h-3 rounded-full transition-all ${currentIndex === index ? "bg-[#650014] w-8" : "bg-gray-300 hover:bg-gray-400"}`} />
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#FAFAFA] pb-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="leading-relaxed"><h3 className="font-bold text-[#111827] text-lg">Project Tracking System</h3><p className="text-[#6B7280] text-sm">ระบบการติดตามโครงการ องค์การนักศึกษา อมธ.ส่วนกลาง</p></div>
          <a href="#" className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 text-[#650014] hover:bg-gray-100 px-6 py-2.5 rounded-full text-sm font-medium transition-all">ศูนย์ช่วยเหลือ</a>
        </div>
      </footer>
    </div>
  );
}