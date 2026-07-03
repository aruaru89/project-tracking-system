"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface ProjectItem {
  id: string;
  name: string;
  dept: string;
  status: string;
  endDate: string;
}

export default function ReportsPage() {
  // ข้อมูลโครงการ (เชื่อมต่อกับข้อมูลจริงภายหลัง - ยังไม่มีข้อมูลตัวอย่าง)
  const [projectList, setProjectList] = useState<ProjectItem[]>([]);

  // State ควบคุมป๊อปอัป
  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false);
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);

  // ---------------------------------------------------------
  // การคำนวณข้อมูลเรียลไทม์ (Real-time Calculations)
  // ---------------------------------------------------------
  const totalCount = projectList.length;
  const activeCount = projectList.filter(p => p.status === 'กำลังดำเนินการ').length;
  const completedCount = projectList.filter(p => p.status === 'เสร็จสิ้น').length;
  const delayedCount = projectList.filter(p => p.status === 'ล่าช้า').length;
  const onTimeCount = totalCount - delayedCount;

  const activePercent = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
  const completedPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const delayedPercent = totalCount > 0 ? Math.round((delayedCount / totalCount) * 100) : 0;
  const onTimePercent = totalCount > 0 ? Math.round((onTimeCount / totalCount) * 100) : 0;

  const avgProgress = totalCount > 0
    ? Math.round(((completedCount * 100) + (activeCount * 50) + (delayedCount * 30)) / totalCount)
    : 0;

  const deptCounts: { [key: string]: number } = {};
  projectList.forEach(p => {
    deptCounts[p.dept] = (deptCounts[p.dept] || 0) + 1;
  });
  const maxDeptCount = Math.max(...Object.values(deptCounts), 1);

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date('2026-07-02').getTime();
    const diffTime = end - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const upcomingProjects = projectList
    .filter(p => p.status !== 'เสร็จสิ้น')
    .map(p => ({ ...p, daysLeft: getDaysRemaining(p.endDate) }))
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const problemProjects = projectList.filter(p => p.status === 'ล่าช้า');

  const gaugeStrokeDasharray = `${(onTimePercent / 100) * 125.6} 125.6`;

  // ฟังก์ชันจัดการการกดส่งออกข้อมูล
  const handleExport = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue) {
      alert(`กำลังเตรียมไฟล์ส่งออกข้อมูลสำหรับ: ${selectedValue}`);
      e.target.value = ""; // รีเซ็ตค่ากลับเป็นค่าเริ่มต้นหลังจากเลือกเสร็จ
    }
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
            <div className="bg-[#650014] text-white px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium shadow-sm cursor-pointer">รายงาน</div>
            <Link href="/users" className="text-[#6B7280] hover:text-[#650014] hover:bg-gray-50 px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer">ผู้ใช้งาน</Link>
            <Link href="/admin" className="text-[#6B7280] hover:text-[#650014] hover:bg-gray-50 px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer">บัญชี</Link>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer hover:bg-gray-50 p-1.5 rounded-full transition-colors pr-4">
            <img src="/profile.jpg" alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-200" onError={(e) => (e.currentTarget.src = "https://ui-avatars.com/api/?name=Admin&background=F3F4F6")} />
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
        
        {/* หัวข้อเพจและกล่องสรุปผล */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-6">
          <div>
            <h2 className="text-2xl font-bold text-[#111827]">รายงานการติดตามโครงการ</h2>
            <p className="text-sm text-gray-500 mt-1">ภาพรวมความคืบหน้า สถานะ และปัญหาของโครงการทั้งหมด</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            {/* กล่องโครงการทั้งหมด */}
            <div className="bg-[#FFF8F9] px-5 h-[44px] rounded-lg border border-[#FCE8EB] shadow-sm flex items-center gap-3">
              <span className="text-sm font-bold text-gray-800">โครงการทั้งหมด</span>
              <span className="text-xl font-bold text-[#650014] ml-1">{totalCount}</span>
            </div>

            {/* กล่องความคืบหน้าเฉลี่ย */}
            <div className="bg-[#FFFAF0] px-5 h-[44px] rounded-lg border border-[#FEF3D9] shadow-sm flex items-center gap-3">
              <span className="text-sm font-bold text-gray-800">ความคืบหน้าเฉลี่ย</span>
              <span className="text-xl font-bold text-amber-500 ml-1">{avgProgress}%</span>
            </div>

            {/* เมนู Dropdown ส่งออกข้อมูล */}
            <div className="relative">
              <select 
                defaultValue="" 
                onChange={handleExport}
                className="bg-[#650014] hover:bg-[#7A001A] text-white px-5 h-[44px] rounded-lg text-sm font-bold shadow-md cursor-pointer appearance-none outline-none transition-colors w-[180px]"
              >
                <option value="" disabled hidden>📥 ส่งออกข้อมูล</option>
                <option value="สัดส่วนสถานะโครงการ">สัดส่วนสถานะโครงการ</option>
                <option value="แนวโน้มความคืบหน้าเฉลี่ย">แนวโน้มความคืบหน้าเฉลี่ย</option>
                <option value="จำนวนโครงการตามหน่วยงาน">จำนวนโครงการตามหน่วยงาน</option>
                <option value="รายงานความตรงต่อเวลา">รายงานความตรงต่อเวลา</option>
                <option value="โครงการใกล้ครบกำหนด">โครงการใกล้ครบกำหนด</option>
                <option value="ปัญหาและอุปสรรคที่พบ">ปัญหาและอุปสรรคที่พบ</option>
              </select>
              <svg className="w-4 h-4 text-white absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* กราฟและสถิติ (Real-time) */}
        {/* --------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* สัดส่วนสถานะโครงการ */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#111827] mb-6">สัดส่วนสถานะโครงการ</h3>
            <div className="flex items-center justify-between">
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#F3F4F6" strokeWidth="8"></circle>
                  <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#22C55E" strokeWidth="8" strokeDasharray={`${activePercent} ${100 - activePercent}`} strokeDashoffset="0"></circle>
                  <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#3B82F6" strokeWidth="8" strokeDasharray={`${completedPercent} ${100 - completedPercent}`} strokeDashoffset={`-${activePercent}`}></circle>
                  <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#EF4444" strokeWidth="8" strokeDasharray={`${delayedPercent} ${100 - delayedPercent}`} strokeDashoffset={`-${activePercent + completedPercent}`}></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-[#111827]">{totalCount}</span>
                  <span className="text-[10px] text-gray-500">โครงการ</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span><span className="text-gray-600 text-xs">กำลังดำเนินการ</span></div>
                  <span className="text-gray-900 font-medium text-xs">{activeCount} ({activePercent}%)</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span className="text-gray-600 text-xs">เสร็จสิ้น</span></div>
                  <span className="text-gray-900 font-medium text-xs">{completedCount} ({completedPercent}%)</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span className="text-gray-600 text-xs">ล่าช้า</span></div>
                  <span className="text-gray-900 font-medium text-xs">{delayedCount} ({delayedPercent}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* แนวโน้มความคืบหน้าเฉลี่ย */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#111827] mb-4">แนวโน้มความคืบหน้าเฉลี่ย</h3>
            <div className="relative h-40 w-full">
              <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-gray-400">
                <span>100%</span><span>80%</span><span>60%</span><span>40%</span><span>20%</span><span>0%</span>
              </div>
              <div className="absolute left-8 right-2 top-2 bottom-6 border-b border-l border-gray-100 relative">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#650014" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#650014" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon points={`10,70 30,62 50,55 70,45 90,${100 - avgProgress} 90,100 10,100`} fill="url(#grad1)" />
                  <polyline points={`10,70 30,62 50,55 70,45 90,${100 - avgProgress}`} fill="none" stroke="#650014" strokeWidth="2" />
                  
                  <circle cx="10" cy="70" r="2.5" fill="#650014" />
                  <circle cx="30" cy="62" r="2.5" fill="#650014" />
                  <circle cx="50" cy="55" r="2.5" fill="#650014" />
                  <circle cx="70" cy="45" r="2.5" fill="#650014" />
                  <circle cx="90" cy={100 - avgProgress} r="2.5" fill="#650014" />
                  
                  <text x="90" y={100 - avgProgress - 5} fontSize="5" fill="#4B5563" textAnchor="middle" fontWeight="bold">{avgProgress}%</text>
                </svg>
              </div>
              <div className="absolute left-8 right-2 bottom-0 flex justify-between text-[10px] text-gray-400">
                <span className="translate-x-1">ม.ค.</span><span>ก.พ.</span><span>มี.ค.</span><span>เม.ย.</span><span className="-translate-x-1">ปัจจุบัน</span>
              </div>
            </div>
          </div>

          {/* จำนวนโครงการตามหน่วยงาน */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col">
            <h3 className="text-[15px] font-bold text-[#111827] mb-6">จำนวนโครงการตามหน่วยงาน</h3>
            <div className="flex-grow flex flex-col justify-start gap-4 overflow-y-auto pr-2">
              {Object.keys(deptCounts).length > 0 ? (
                Object.entries(deptCounts).map(([dept, count], idx) => {
                  const barWidth = `${(count / maxDeptCount) * 100}%`;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-24 text-xs text-gray-600 truncate" title={dept}>{dept}</div>
                      <div className="flex-grow bg-transparent h-4 flex items-center relative">
                        <div className="bg-[#650014] h-3.5 rounded-r" style={{ width: barWidth }}></div>
                        <span className="text-xs font-bold text-gray-800 ml-2" style={{ position: 'absolute', left: barWidth }}>{count}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-400 text-xs py-6">ไม่มีข้อมูลโครงการ</div>
              )}
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* ครึ่งวงกลมและปุ่มเปิด Modal */}
        {/* --------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* รายงานความตรงต่อเวลา */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#111827] mb-6">รายงานความตรงต่อเวลา</h3>
            <div className="flex items-end justify-between h-[120px]">
              <div className="relative w-40 h-24 overflow-hidden flex-shrink-0">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#FCE8E8" strokeWidth="15" />
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#22C55E" strokeWidth="15" strokeDasharray={gaugeStrokeDasharray} />
                </svg>
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-2">
                  <span className="text-3xl font-bold text-[#111827] leading-none">{onTimePercent}%</span>
                  <span className="text-[10px] text-gray-500 mt-1">ส่งตรงเวลา</span>
                </div>
              </div>
              <div className="flex flex-col gap-4 text-sm pb-2">
                <div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span><span className="text-gray-600 text-xs font-medium">ส่งตรงเวลา</span></div>
                  <div className="text-gray-500 text-[11px] ml-4">{onTimeCount} โครงการ</div>
                </div>
                <div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span className="text-gray-600 text-xs font-medium">ล่าช้า</span></div>
                  <div className="text-gray-500 text-[11px] ml-4">{delayedCount} โครงการ</div>
                </div>
              </div>
            </div>
          </div>

          {/* ปุ่ม: โครงการใกล้ครบกำหนด (กดเพื่อเปิด Modal) */}
          <div onClick={() => setIsDeadlineModalOpen(true)} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col cursor-pointer hover:border-[#650014] hover:shadow-md transition-all group">
            <h3 className="text-[15px] font-bold text-[#111827] mb-4 group-hover:text-[#650014]">โครงการใกล้ครบกำหนด</h3>
            <div className="flex flex-col gap-4 flex-grow">
              {upcomingProjects.length > 0 ? (
                upcomingProjects.slice(0, 3).map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 max-w-[50%]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                      <span className="font-bold text-gray-800 truncate">{p.name}</span>
                    </div>
                    <div className="text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded text-[10px]">เหลือ {p.daysLeft} วัน</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 text-xs py-6">ไม่มีโครงการที่ใกล้ครบกำหนด</div>
              )}
            </div>
            <div className="text-center mt-auto pt-4 border-t border-gray-50">
              <span className="text-[#650014] text-xs font-bold underline">คลิกเพื่อดูทั้งหมด →</span>
            </div>
          </div>

          {/* ปุ่ม: ปัญหาและอุปสรรคที่พบ (กดเพื่อเปิด Modal) */}
          <div onClick={() => setIsProblemModalOpen(true)} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col cursor-pointer hover:border-[#650014] hover:shadow-md transition-all group">
            <h3 className="text-[15px] font-bold text-[#111827] mb-4 group-hover:text-[#650014]">ปัญหาและอุปสรรคที่พบ</h3>
            <div className="flex flex-col gap-3 flex-grow">
              <div className="flex justify-between items-center bg-gray-50 rounded-xl p-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center font-bold text-xs flex-shrink-0">!</div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-xs">ส่งงานเกินกำหนด (ล่าช้า)</span>
                    <span className="text-gray-400 text-[10px]">{delayedCount} โครงการ</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-auto pt-4 border-t border-gray-50">
              <span className="text-[#650014] text-xs font-bold underline">คลิกเพื่อดูรายละเอียด →</span>
            </div>
          </div>

        </div>
      </main>

      {/* -------------------------------------------------------------------------------- */}
      {/* POPUP MODALS */}
      {/* -------------------------------------------------------------------------------- */}
      
      {/* 1. Modal: โครงการใกล้ครบกำหนด */}
      {isDeadlineModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl max-h-[80vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-white/95 px-8 py-5 border-b border-gray-100 flex justify-between items-center z-10 sticky top-0">
              <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                <span className="text-amber-500">⏰</span> โครงการใกล้ครบกำหนด
              </h2>
              <button onClick={() => setIsDeadlineModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 h-[40px] rounded-full text-sm font-bold transition-colors">
                ออก
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              {upcomingProjects.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 mb-2">
                    <div className="col-span-6">ชื่อโครงการ</div>
                    <div className="col-span-3 text-center">ครบกำหนด</div>
                    <div className="col-span-3 text-center">สถานะเวลา</div>
                  </div>
                  {upcomingProjects.map((p, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-100 text-sm items-center hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="col-span-6 font-bold text-gray-800">{p.name}</div>
                      <div className="col-span-3 text-center text-gray-500">{new Date(p.endDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                      <div className="col-span-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${p.daysLeft < 30 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                          เหลือ {p.daysLeft} วัน
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-10">ไม่มีโครงการที่ใกล้ครบกำหนด</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: ปัญหาและอุปสรรคที่พบ */}
      {isProblemModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl max-h-[80vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-white/95 px-8 py-5 border-b border-gray-100 flex justify-between items-center z-10 sticky top-0">
              <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                <span className="text-red-500">⚠️</span> ปัญหาและอุปสรรคที่พบ
              </h2>
              <button onClick={() => setIsProblemModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 h-[40px] rounded-full text-sm font-bold transition-colors">
                ออก
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-lg inline-block">ปัญหา: ส่งงานเกินกำหนด</h3>
              </div>
              
              {problemProjects.length > 0 ? (
                <div className="flex flex-col gap-2 mt-4">
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 mb-2">
                    <div className="col-span-8">ชื่อโครงการ (ล่าช้า)</div>
                    <div className="col-span-4 text-center">หน่วยงาน</div>
                  </div>
                  {problemProjects.map((p, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-100 text-sm items-center hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="col-span-8 font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span> {p.name}
                      </div>
                      <div className="col-span-4 text-center text-gray-500">{p.dept}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-10">ไม่พบปัญหาหรือโครงการล่าช้าในระบบ</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}