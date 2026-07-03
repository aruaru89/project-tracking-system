"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  // ---------------------------------------------------------
  // ข้อมูลผู้ใช้งาน (Admin Profile)
  // ---------------------------------------------------------
  const [profile, setProfile] = useState({
    fullName: 'Aruchira cts',
    phone: '',
    email: '',
    birthDate: '',
    position: 'ผู้ดูแลระบบ',
    dept: 'หน่วยงาน',
    address: '',
  });

  const departments = ["ไอที", "การตลาด", "วิจัยและพัฒนา", "บุคคล", "บัญชี", "ฝ่ายขาย", "จัดซื้อ", "ผู้บริหาร", "ประชาสัมพันธ์", "ธุรการ"];

  // --- Dropdown หน่วยงาน (แบบค้นหาได้) ---
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [deptSearch, setDeptSearch] = useState("");
  const deptRef = useRef<HTMLDivElement>(null);
  const filteredDepts = departments.filter(d => d.toLowerCase().includes(deptSearch.toLowerCase()));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (deptRef.current && !deptRef.current.contains(event.target as Node)) {
        setIsDeptOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- อัปโหลดรูปโปรไฟล์ (อัปโหลดได้จริง + เข้าไปดูไฟล์ได้ เหมือนหน้า Projects) ---
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profileFileUrl, setProfileFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileFile(file);
      setProfileFileUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveProfileFile = () => {
    setProfileFile(null);
    setProfileFileUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- เมนูจัดการบัญชี (สไตล์เดียวกับ Dropdown "ส่งออกข้อมูล" ในหน้ารายงาน) ---
  const handleAccountAction = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'บันทึก') {
      alert('บันทึกข้อมูลบัญชีผู้ใช้งานเรียบร้อยแล้ว!');
    } else if (selectedValue === 'ออก') {
      const confirmLogout = confirm('ต้องการออกจากระบบใช่หรือไม่?');
      if (confirmLogout) {
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/';
      }
    } else if (selectedValue === 'บัญชีผู้ใช้งาน') {
      alert('กำลังแสดงข้อมูลบัญชีผู้ใช้งานปัจจุบัน');
    }
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] flex flex-col" style={{ fontFamily: "'Prompt', 'IBM Plex Sans Thai', 'Noto Sans Thai', sans-serif" }}>

      {/* -------------------------------------------------------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 pt-5 pb-2 px-6 bg-[#FAFAFA]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto bg-white border border-[#E5E7EB] rounded-3xl py-3 px-6 shadow-sm flex justify-between items-center gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <img src="/logo.jpeg" alt="โลโก้ อมธ" className="w-10 h-10 object-contain rounded-full border border-gray-100" />
            <div className="hidden sm:block leading-tight pr-2">
              <h1 className="text-[#111827] font-bold text-[15px]">Project Tracking System</h1>
              <p className="text-[#6B7280] text-[11px] mt-0.5">องค์การนักศึกษา อมธ.ส่วนกลาง</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            <Link href="/" className="text-[#6B7280] hover:text-[#650014] hover:bg-gray-50 px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer">หน้าหลัก</Link>
            <Link href="/projects" className="text-[#6B7280] hover:text-[#650014] hover:bg-gray-50 px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer">โครงการ</Link>
            <Link href="/reports" className="text-[#6B7280] hover:text-[#650014] hover:bg-gray-50 px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer">รายงาน</Link>
            <Link href="/users" className="text-[#6B7280] hover:text-[#650014] hover:bg-gray-50 px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer">ผู้ใช้งาน</Link>
            <div className="bg-[#650014] text-white px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium shadow-sm">บัญชี</div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer hover:bg-gray-50 p-1.5 rounded-full transition-colors pr-4">
            <img src="/profile.jpg" alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-200" onError={(e) => (e.currentTarget.src = "https://ui-avatars.com/api/?name=Admin&background=F3F4F6")} />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[14px] font-bold text-[#111827] leading-none">Aruchira cts</span>
              <span className="text-[12px] text-gray-500 mt-1">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------------------------- */}
      {/* MAIN CONTENT */}
      {/* -------------------------------------------------------------------------------- */}
      <main className="max-w-7xl w-full mx-auto px-6 py-10 flex-grow">

        {/* หัวข้อเพจ + เมนูจัดการบัญชี (ปุ่มเล็กแบบหน้ารายงาน) */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-6">
          <div>
            <h2 className="text-2xl font-bold text-[#111827]">จัดการบัญชี</h2>
            <p className="text-sm text-gray-500 mt-1">จัดการข้อมูลส่วนตัวและบัญชีผู้ดูแลระบบ</p>
          </div>

          <div className="relative">
            <select
              defaultValue=""
              onChange={handleAccountAction}
              className="bg-[#650014] hover:bg-[#7A001A] text-white px-5 h-[44px] rounded-lg text-sm font-bold shadow-md cursor-pointer appearance-none outline-none transition-colors w-[180px]"
            >
              <option value="" disabled hidden>⚙️ จัดการบัญชี</option>
              <option value="บัญชีผู้ใช้งาน">บัญชีผู้ใช้งาน</option>
              <option value="บันทึก">บันทึก</option>
              <option value="ออก">ออก</option>
            </select>
            <svg className="w-4 h-4 text-white absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* ฟอร์มข้อมูลผู้ใช้งาน */}
        {/* --------------------------------------------------------- */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">

          <h3 className="text-[15px] font-bold text-[#111827] mb-6 flex items-center gap-2">
            <span className="text-xl text-gray-500">👤</span> ข้อมูลผู้ใช้งาน
          </h3>

          {/* แถวที่ 1: ชื่อ-นามสกุล / เบอร์ / อีเมล / วันเกิด (แบ่งครึ่งหน้า) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">ชื่อ-นามสกุล</label>
              <input
                type="text"
                placeholder="ระบุชื่อ-นามสกุล"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#650014] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">เบอร์โทรศัพท์</label>
              <input
                type="tel"
                placeholder="08X-XXX-XXXX"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#650014] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">อีเมล</label>
              <input
                type="email"
                placeholder="name@org.go.th"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#650014] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">วันเกิด</label>
              <input
                type="date"
                value={profile.birthDate}
                onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#650014] text-gray-500 transition-colors"
              />
            </div>
          </div>

          {/* แถวที่ 2: ตำแหน่ง / หน่วยงาน */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">ตำแหน่ง</label>
              <input
                type="text"
                placeholder="ระบุตำแหน่ง"
                value={profile.position}
                onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#650014] transition-colors"
              />
            </div>
            <div className="relative" ref={deptRef}>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">หน่วยงาน</label>
              <div
                onClick={() => setIsDeptOpen(!isDeptOpen)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex justify-between items-center bg-white cursor-pointer focus-within:border-[#650014]"
              >
                <span className={profile.dept === 'หน่วยงาน' ? "text-gray-400" : "text-inherit"}>{profile.dept}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 text-gray-500 transition-transform ${isDeptOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {isDeptOpen && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-3">
                  <input
                    type="text"
                    autoFocus
                    placeholder="พิมพ์ค้นหาหน่วยงาน..."
                    value={deptSearch}
                    onChange={(e) => setDeptSearch(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none mb-2 focus:border-[#650014]"
                  />
                  <div className="max-h-40 overflow-y-auto">
                    {filteredDepts.length > 0 ? filteredDepts.map((dept) => (
                      <div
                        key={dept}
                        onClick={() => { setProfile({ ...profile, dept }); setIsDeptOpen(false); setDeptSearch(""); }}
                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        {dept}
                      </div>
                    )) : <div className="px-3 py-2 text-sm text-gray-400 text-center">ไม่พบข้อมูล</div>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* แถวที่ 3: ที่อยู่ติดต่อ */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-1.5">ที่อยู่ติดต่อ</label>
            <textarea
              rows={3}
              placeholder="ระบุที่อยู่สำหรับติดต่อ"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#650014] resize-none transition-colors"
            />
          </div>

          {/* แถวที่ 4: รูปโปรไฟล์ (อัปโหลดได้จริง + เข้าไปดูไฟล์ได้ เหมือนหน้า Projects) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">รูปโปรไฟล์</label>

            <input type="file" ref={fileInputRef} onChange={handleProfileUpload} accept="image/*" className="hidden" />

            {!profileFileUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="text-4xl mb-3">📁</div>
                <button type="button" className="bg-[#650014] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#7A001A] transition-colors shadow-sm pointer-events-none">
                  + อัปโหลดไฟล์
                </button>
                <p className="text-xs text-gray-400 mt-2">คลิกเพื่อเลือกไฟล์รูปภาพจากเครื่อง</p>
              </div>
            ) : (
              <div className="w-full border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 bg-gray-50">
                <img src={profileFileUrl} alt="รูปโปรไฟล์ที่อัปโหลด" className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm flex-shrink-0" />
                <div className="flex-1 w-full">
                  <p className="text-sm font-bold text-gray-700 mb-1">ไฟล์แนบแล้ว:</p>
                  <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg text-blue-700 text-sm">
                    <span>📎</span>
                    <a href={profileFileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex-grow overflow-hidden text-ellipsis whitespace-nowrap">
                      {profileFile?.name}
                    </a>
                  </div>
                  <div className="flex gap-3 mt-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold text-[#650014] hover:underline"
                    >
                      เปลี่ยนรูป
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveProfileFile}
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      ลบไฟล์
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ปุ่มบันทึกท้ายฟอร์ม */}
          <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
            <Link href="/" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 h-[44px] flex items-center rounded-full text-sm font-bold transition-colors">
              ยกเลิก
            </Link>
            <button
              onClick={() => alert('บันทึกข้อมูลบัญชีผู้ใช้งานเรียบร้อยแล้ว!')}
              className="bg-[#650014] hover:bg-[#7A001A] text-white px-8 h-[44px] rounded-full text-sm font-bold shadow-md transition-colors"
            >
              บันทึก
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}