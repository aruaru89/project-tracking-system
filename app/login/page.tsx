"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase'; // นำเข้าตัวเชื่อมต่อ Supabase ที่เราสร้างไว้

export default function LoginPage() {
  const router = useRouter();
  
  // สร้าง State เพื่อเก็บค่าที่ผู้ใช้พิมพ์ในช่องอีเมลและรหัสผ่าน
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // สร้าง State ไว้แสดงข้อความ Error เวลากรอกรหัสผิด
  const [errorMsg, setErrorMsg] = useState('');
  // สร้าง State เพื่อเช็คว่ากำลังโหลดอยู่ไหม (กันคนกดปุ่มรัวๆ)
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(''); // เคลียร์ข้อความแจ้งเตือนเก่าทิ้งก่อน

    // ส่งอีเมลและรหัสผ่านไปตรวจสอบกับ Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // ถ้ารหัสผิด หรือไม่มีอีเมลนี้ในระบบ
      setErrorMsg("เข้าสู่ระบบไม่สำเร็จ: อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      setLoading(false);
    } else {
      // ถ้าสำเร็จ ให้แจ้งเตือนและเด้งไปหน้าหลัก (/)
      alert("เข้าสู่ระบบสำเร็จ!");
      
      // บันทึกสถานะการล็อกอินลง localStorage (เผื่อเอาไปใช้ซ่อน/โชว์ปุ่มในหน้า Home)
      localStorage.setItem('isLoggedIn', 'true');
      
      router.push('/'); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" style={{ fontFamily: "'Prompt', sans-serif" }}>
      <div className="bg-white w-full max-w-lg rounded-[40px] shadow-xl p-10 border border-gray-100">
        <h1 className="text-center text-2xl font-bold text-[#650014] mb-8">เข้าสู่ระบบ</h1>
        
        {/* กล่องแสดงข้อความ Error จะโชว์ก็ต่อเมื่อมี Error */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">อีเมล</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)} // จับค่าที่พิมพ์ไปใส่ใน State
              className="w-full h-[50px] px-6 rounded-full bg-gray-50 border border-gray-200 outline-none focus:border-[#650014] transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">รหัสผ่าน</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)} // จับค่าที่พิมพ์ไปใส่ใน State
              className="w-full h-[50px] px-6 rounded-full bg-gray-50 border border-gray-200 outline-none focus:border-[#650014] transition-all" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-[50px] mt-6 bg-[#650014] text-white rounded-full font-bold hover:bg-[#7A001A] disabled:opacity-50 transition-all"
          >
            {loading ? 'กำลังตรวจสอบ...' : 'ตกลง'}
          </button>
        </form>
        
        <div className="text-center mt-6 text-sm text-gray-600">
          ยังไม่มีบัญชีใช่ไหม? <Link href="/register" className="text-[#650014] font-bold hover:underline">สมัครสมาชิก</Link>
        </div>
      </div>
    </div>
  );
}