"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface UserItem {
  id: number;
  name: string;
  email: string;
  dept: string;
  position: string;
  status: string;
  lastLogin: string;
}

export default function UsersPage() {
  // 1. ข้อมูลผู้ใช้งาน (เชื่อมต่อกับข้อมูลจริงภายหลัง - ยังไม่มีข้อมูลตัวอย่าง)
  const [users, setUsers] = useState<UserItem[]>([]);

  // คลาสสำหรับจัด Grid ของตาราง (6 คอลัมน์ตามบรีฟ)
  const tableGridClass = "grid grid-cols-[1.5fr_2fr_1.5fr_1.5fr_1.2fr_1.5fr] gap-4 items-center";

  // --- State การค้นหาและตัวกรอง ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("หน่วยงาน");
  const [selectedStatus, setSelectedStatus] = useState("สถานะ");

  // --- State สำหรับ Dropdown หน่วยงานแบบค้นหาได้ ---
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [deptSearch, setDeptSearch] = useState("");
  const deptRef = useRef<HTMLDivElement>(null);

  // รายชื่อหน่วยงานทั้งหมด (ดึงจากข้อมูลจริงแบบไม่ซ้ำ)
  const deptOptions = ["ทั้งหมด", ...Array.from(new Set(users.map(u => u.dept)))];
  const filteredDeptOptions = deptOptions.filter(d => d.toLowerCase().includes(deptSearch.toLowerCase()));

  // ปิด Dropdown หน่วยงานเมื่อคลิกนอกกรอบ
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (deptRef.current && !deptRef.current.contains(event.target as Node)) {
        setIsDeptOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- State สำหรับ Modal คู่มือการใช้งาน ---
  const [isManualOpen, setIsManualOpen] = useState(false);

  // --- State สำหรับการแบ่งหน้า (Pagination) ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // กรองข้อมูลเรียลไทม์ (คำนวณใหม่ทุกครั้งตามข้อมูลที่มีอยู่จริงในระบบ)
  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = selectedDept === "หน่วยงาน" || selectedDept === "ทั้งหมด" ? true : user.dept === selectedDept;
    const matchStatus = selectedStatus === "สถานะ" || selectedStatus === "ทั้งหมด" ? true : user.status === selectedStatus;
    return matchSearch && matchDept && matchStatus;
  });

  // รีเซ็ตกลับไปหน้า 1 ทุกครั้งที่ตัวกรอง/คำค้นหาเปลี่ยน
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDept, selectedStatus]);

  // คำนวณจำนวนหน้าทั้งหมดตามข้อมูลที่กรองได้จริง (เรียลไทม์)
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

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
            <div className="bg-[#650014] text-white px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium shadow-sm">ผู้ใช้งาน</div>
            <Link href="/admin" className="text-[#6B7280] hover:text-[#650014] hover:bg-gray-50 px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer">บัญชี</Link>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer hover:bg-gray-50 p-1.5 rounded-full transition-colors pr-4">
            <img src="profile.jpg" alt="profile.jpg" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[14px] font-bold text-[#111827] leading-none">Aruchira cts</span>
              <span className="text-[12px] text-gray-500 mt-1">Admin</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------------------------- */}
      {/* MAIN CONTENT */}
      {/* -------------------------------------------------------------------------------- */}
      <main className="max-w-7xl w-full mx-auto px-6 py-10 flex-grow">
        
        <div className="w-full mb-8 text-left">
          <h2 className="text-2xl font-bold text-[#111827]">จัดการผู้ใช้งาน</h2>
          <p className="text-sm text-gray-500 mt-1">การจัดการบัญชี บทบาท และความปลอดภัยของผู้ใช้งาน</p>
        </div>

        {/* 1. Summary Cards 4 ช่อง */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-center">
            <p className="text-sm text-gray-500 font-medium">ผู้ใช้งานทั้งหมด</p>
            <p className="text-3xl font-bold mt-2 text-[#111827]">{users.length} คน</p>
          </div>
          <div className="bg-green-50 p-6 rounded-3xl border border-green-100 shadow-sm flex flex-col justify-center">
            <p className="text-sm text-green-700 font-medium">ผู้ใช้งานที่ใช้งานอยู่</p>
            <p className="text-3xl font-bold mt-2 text-green-800">{users.filter(u=>u.status==='ใช้งานอยู่').length} คน</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 shadow-sm flex flex-col justify-center">
            <p className="text-sm text-blue-700 font-medium">กิจกรรมล่าสุด</p>
            <p className="text-xl font-bold mt-2 text-blue-800">อัปเดตข้อมูล</p>
          </div>
          <div className="bg-[#650014] p-6 rounded-3xl border border-[#650014] shadow-sm flex flex-col justify-center cursor-pointer hover:bg-[#7A001A] transition-colors">
            <p className="text-sm text-white font-medium">ส่งข้อมูลออก</p>
            <p className="text-2xl font-bold mt-2 text-white">Export Data</p>
          </div>
        </div>

        {/* 2. ส่วนการค้นหาและตัวกรอง (เลียนแบบหน้าโครงการ) */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          
          <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4 relative z-10">
            {/* ค้นหา */}
            <div className="bg-gray-50 rounded-full px-5 h-[44px] border border-gray-200 flex items-center w-full lg:w-[300px] focus-within:border-[#650014] transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="ค้นหา..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none w-full text-sm text-[#111827]" 
              />
            </div>

            {/* กลุ่มตัวกรองขวามือ */}
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              {/* หน่วยงาน: Dropdown แบบค้นหาได้ */}
              <div className="relative min-w-[160px]" ref={deptRef}>
                <button
                  type="button"
                  onClick={() => setIsDeptOpen(!isDeptOpen)}
                  className="bg-gray-50 rounded-full px-5 h-[44px] border border-gray-200 text-sm text-gray-600 w-full flex items-center justify-between gap-2 cursor-pointer"
                >
                  <span className="truncate">{selectedDept}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform ${isDeptOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {isDeptOpen && (
                  <div className="absolute top-[calc(100%+6px)] left-0 w-full min-w-[220px] bg-white border border-gray-200 rounded-2xl shadow-lg z-20 overflow-hidden">
                    <div className="p-2 border-b border-gray-100">
                      <input
                        type="text"
                        autoFocus
                        placeholder="ค้นหาหน่วยงาน..."
                        value={deptSearch}
                        onChange={(e) => setDeptSearch(e.target.value)}
                        className="w-full bg-gray-50 rounded-full px-4 h-[38px] text-sm outline-none border border-gray-200 focus:border-[#650014] transition-all"
                      />
                    </div>
                    <div className="max-h-[220px] overflow-y-auto py-1">
                      {filteredDeptOptions.length > 0 ? (
                        filteredDeptOptions.map((dept) => (
                          <div
                            key={dept}
                            onClick={() => { setSelectedDept(dept); setIsDeptOpen(false); setDeptSearch(""); }}
                            className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${selectedDept === dept ? 'text-[#650014] font-bold bg-gray-50' : 'text-gray-600'}`}
                          >
                            {dept}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-400 text-center">ไม่พบหน่วยงาน</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-gray-50 rounded-full px-5 h-[44px] border border-gray-200 text-sm outline-none cursor-pointer text-gray-600 appearance-none pr-8 min-w-[130px]"
              >
                <option>สถานะ</option>
                <option>ทั้งหมด</option>
                <option>ใช้งานอยู่</option>
                <option>ไม่ได้ใช้งานอยู่</option>
              </select>

              <select className="bg-gray-50 rounded-full px-5 h-[44px] border border-gray-200 text-sm outline-none cursor-pointer text-gray-600 appearance-none pr-8 min-w-[130px]">
                <option>ดำเนินการ</option>
                <option>ระงับสิทธิ์</option>
                <option>เปลี่ยนบทบาท</option>
              </select>

              <button
                onClick={() => setIsManualOpen(true)}
                className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 px-5 h-[44px] rounded-full text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                คู่มือการใช้งาน
              </button>
            </div>
          </div>

          {/* 3. รายงานผู้ใช้งาน (จำนวนคน) */}
          <div className="mb-4 px-2 flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-lg font-bold text-[#111827]">รายงานผู้ใช้งาน ({filteredUsers.length} คน)</h3>
          </div>

          {/* 4. ตารางข้อมูลผู้ใช้งาน */}
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              {/* Header ตาราง */}
              <div className={`bg-gray-100 rounded-full px-6 py-4 mb-3 text-sm font-bold text-gray-600 shadow-sm ${tableGridClass}`}>
                <div>ชื่อผู้ใช้งาน</div>
                <div>อีเมล</div>
                <div>หน่วยงาน</div>
                <div>ตำแหน่ง</div>
                <div>สถานะ</div>
                <div>เข้าสู่ระบบ</div>
              </div>

              {/* Body ตาราง */}
              <div className="flex flex-col">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <div key={user.id} className={`px-6 py-4 border-b border-gray-50 text-sm hover:bg-gray-50 transition-colors rounded-3xl ${tableGridClass}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#650014] text-white rounded-full flex items-center justify-center font-bold text-[10px]">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-bold text-[#111827]">{user.name}</span>
                      </div>
                      <div className="text-gray-600">{user.email}</div>
                      <div className="text-gray-600">{user.dept}</div>
                      <div className="text-gray-600">{user.position}</div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${user.status === 'ใช้งานอยู่' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          ● {user.status}
                        </span>
                      </div>
                      <div className="text-gray-500 text-xs italic">{user.lastLogin}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400 text-sm">ไม่พบข้อมูลผู้ใช้งาน</div>
                )}
              </div>
            </div>
          </div>

          {/* 5. Pagination: แสดงจำนวนรายการ + ปุ่มเปลี่ยนหน้า (แถวเดียวกัน ตามดีไซน์ในภาพ) */}
          {filteredUsers.length > 0 && (
            <div className="flex items-center justify-between mt-6 px-2 flex-wrap gap-4">
              <span className="text-sm text-gray-500">
                แสดง {(safeCurrentPage - 1) * itemsPerPage + 1}-{Math.min(safeCurrentPage * itemsPerPage, filteredUsers.length)} จาก {filteredUsers.length} โครงการ
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                  className="px-4 h-9 rounded-full text-sm font-medium border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ก่อนหน้า
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      safeCurrentPage === pageNum
                        ? 'bg-[#650014] text-white shadow-sm'
                        : 'text-gray-500 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="px-4 h-9 rounded-full text-sm font-medium border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ถัดไป
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* -------------------------------------------------------------------------------- */}
      {/* Modal คู่มือการใช้งาน */}
      {/* -------------------------------------------------------------------------------- */}
      {isManualOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative">
            <button onClick={() => setIsManualOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black text-2xl">✕</button>
            <h2 className="text-2xl font-bold mb-6 text-[#650014]">คู่มือการใช้งานระบบ (User Manual)</h2>

            <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
              <section>
                <h3 className="font-bold text-[#111827]">1. หน้าหลัก (Dashboard)</h3>
                <p>เป็นจุดเริ่มต้นของระบบ เพื่อดูภาพรวมความคืบหน้าของโครงการทั้งหมด<br/>
                - <b>การดูสรุปข้อมูล:</b> ระบบจะแสดงสถิติโครงการทั้งหมด, กำลังดำเนินการ, เสร็จสิ้น และล่าช้าแบบ Real-time<br/>
                - <b>การนำทาง:</b> กดที่เมนู โครงการ, รายงาน หรือ จัดการผู้ใช้งาน เพื่อเข้าสู่หน้าต่าง ๆ</p>
              </section>

              <section>
                <h3 className="font-bold text-[#111827]">2. เมนูโครงการ (Project Management)</h3>
                <p><b>การเพิ่มโครงการ:</b> คลิกปุ่ม "+ เพิ่มโครงการ" จากนั้นกรอก ข้อมูลทั่วไป, สถานะ และระดับความสำคัญ<br/>
                - <b>การจัดการโครงการ:</b> 👁️ ดูรายละเอียด และ ✏️ แก้ไขข้อมูล</p>
              </section>

              <section>
                <h3 className="font-bold text-[#111827]">3. เมนูรายงาน (Reports)</h3>
                <p>วิเคราะห์ภาพรวมการทำงาน<br/>
                - <b>การจัดการแจ้งเตือน:</b> คลิก "โครงการใกล้ครบกำหนด" หรือ "ปัญหาและอุปสรรคที่พบ"<br/>
                - <b>การส่งออกข้อมูล:</b> กดปุ่มสีแดงเพื่อดาวน์โหลดรายงานรายหัวข้อ</p>
              </section>

              <section>
                <h3 className="font-bold text-[#111827]">4. เมนูจัดการผู้ใช้งาน (User Management)</h3>
                <p>ตรวจสอบจำนวนผู้ใช้งานทั้งหมด/กำลังใช้งานอยู่ และดูประวัติกิจกรรมล่าสุด</p>
              </section>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-[#111827] mb-2">FAQ: คำถามที่พบบ่อย</h3>
                <p><b>Q: ถ้าสถานะโครงการเปลี่ยน ระบบจะคำนวณใหม่ไหม?</b><br/>A: ใช่ค่ะ ระบบเป็น Real-time ข้อมูลจะอัปเดตทันที</p>
                <p><b>Q: ต้องการติดต่อแอดมินเพื่อแจ้งปัญหา?</b><br/>A: สามารถติดต่อผ่าน Admin หลักของระบบโดยตรงค่ะ</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}