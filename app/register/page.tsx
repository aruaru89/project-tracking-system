"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // นำเข้า useRouter

export default function RegisterPage() {
  const router = useRouter(); // เรียกใช้ router

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert("สมัครสมาชิกสำเร็จ!");
    router.push('/'); // เด้งไปหน้าหลัก
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[40px] shadow-xl p-10 border border-gray-100">
        <h1 className="text-center text-2xl font-bold text-[#650014] mb-8">สมัครสมาชิก</h1>
        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">อีเมล</label>
            <input type="email" required className="w-full h-[50px] px-6 rounded-full bg-gray-50 border border-gray-200 outline-none focus:border-[#650014]" placeholder="อีเมล" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">ชื่อ-นามสกุล</label>
            <input type="text" required className="w-full h-[50px] px-6 rounded-full bg-gray-50 border border-gray-200 outline-none focus:border-[#650014]" placeholder="ชื่อ-นามสกุล" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">รหัสผ่าน</label>
            <input type="password" required className="w-full h-[50px] px-6 rounded-full bg-gray-50 border border-gray-200 outline-none focus:border-[#650014]" placeholder="รหัสผ่าน" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">ยืนยันรหัสผ่าน</label>
            <input type="password" required className="w-full h-[50px] px-6 rounded-full bg-gray-50 border border-gray-200 outline-none focus:border-[#650014]" placeholder="ยืนยันรหัสผ่าน" />
          </div>
          <button type="submit" className="w-full h-[50px] mt-6 bg-[#650014] text-white rounded-full font-bold hover:bg-[#7A001A]">สมัครสมาชิก</button>
        </form>
        <div className="text-center mt-6 text-sm">
          มีบัญชีอยู่แล้ว? <Link href="/login" className="text-[#650014] font-bold underline">เข้าสู่ระบบ</Link>
        </div>
      </div>
    </div>
  );
}