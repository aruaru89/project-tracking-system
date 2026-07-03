"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase'; // เพิ่มบรรทัดนี้: นำเข้า Supabase

export default function ProjectsPage() {
  const [projectList, setProjectList] = useState<any[]>([]);

  const tableGridClass = "grid grid-cols-[1fr_2fr_1.5fr_1.5fr_1.5fr_1fr_1fr] gap-4 items-center";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("โครงการทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [deptSearchQuery, setDeptSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("หน่วยงาน");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newProject, setNewProject] = useState({
    name: '', desc: '', dept: 'หน่วยงาน', startDate: '', endDate: '',
    status: 'กำลังดำเนินการ', priority: '🔴 สูง (High)', pic: '', manager: ''
  });

  const [isModalDeptOpen, setIsModalDeptOpen] = useState(false);
  const [modalDeptSearch, setModalDeptSearch] = useState("");
  const modalDeptRef = useRef<HTMLDivElement>(null);
  
  // เพิ่ม State สำหรับจัดการสถานะกำลังโหลด
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = ["ทั้งหมด", "ไอที", "การตลาด", "วิจัยและพัฒนา", "บุคคล", "บัญชี", "ฝ่ายขาย", "จัดซื้อ", "ผู้บริหาร", "ประชาสัมพันธ์", "ธุรการ"];
  const filteredDepts = departments.filter(dept => dept.toLowerCase().includes(deptSearchQuery.toLowerCase()));
  const filteredModalDepts = departments.filter(dept => dept !== "ทั้งหมด" && dept.toLowerCase().includes(modalDeptSearch.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDeptDropdownOpen(false);
      if (modalDeptRef.current && !modalDeptRef.current.contains(event.target as Node)) setIsModalDeptOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus]);

  const totalCount = projectList.length;
  const activeCount = projectList.filter(p => p.status === 'กำลังดำเนินการ').length;
  const completedCount = projectList.filter(p => p.status === 'เสร็จสิ้น').length;
  const delayedCount = projectList.filter(p => p.status === 'ล่าช้า').length;

  const activePercent = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
  const completedPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const delayedPercent = totalCount > 0 ? Math.round((delayedCount / totalCount) * 100) : 0;

  const filteredProjects = projectList.filter(project => {
    const matchStatus = selectedStatus === "โครงการทั้งหมด" ? true : project.status === selectedStatus;
    const matchSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || (project.id && project.id.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setNewProject({
      name: '', desc: '', dept: 'หน่วยงาน', startDate: '', endDate: '',
      status: 'กำลังดำเนินการ', priority: '🔴 สูง (High)', pic: '', manager: ''
    });
    setUploadedFiles([]);
    setModalDeptSearch("");
    setIsSubmitting(false); // Reset สถานะ
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setNewProject({ name: '', desc: '', dept: 'หน่วยงาน', startDate: '', endDate: '', status: 'กำลังดำเนินการ', priority: '🔴 สูง (High)', pic: '', manager: '' });
    setIsModalOpen(true);
  };

  const openViewModal = (project: any) => {
    setModalMode('view');
    setEditingId(project.id);
    setNewProject({
      name: project.name, desc: project.desc || '', dept: project.dept, startDate: project.startDate || '', endDate: project.endDate || '',
      status: project.status, priority: project.priority || '🟡 ปานกลาง (Medium)', pic: project.pic || '', manager: project.manager || ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project: any) => {
    setModalMode('edit');
    setEditingId(project.id);
    setNewProject({
      name: project.name, desc: project.desc || '', dept: project.dept, startDate: project.startDate || '', endDate: project.endDate || '',
      status: project.status, priority: project.priority || '🟡 ปานกลาง (Medium)', pic: project.pic || '', manager: project.manager || ''
    });
    setIsModalOpen(true);
  };

  // แก้ไขฟังก์ชันนี้: ส่งข้อมูลเข้า Supabase จริงๆ
  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.desc || newProject.dept === 'หน่วยงาน' || !newProject.status || !newProject.priority || !newProject.pic || !newProject.manager) {
      alert("กรุณากรอกข้อมูลในช่องที่มีเครื่องหมาย * ให้ครบถ้วน");
      return;
    }

    setIsSubmitting(true); // เปลี่ยนปุ่มเป็น "กำลังบันทึก..."

    // 1. ส่งข้อมูลเข้า Supabase ตาราง 'project-tracker'
    const { data, error } = await supabase
      .from('project-tracker')
      .insert([
        { 
          project_name: newProject.name, 
          department: newProject.dept,
          person_in_charge: newProject.pic,
          status: newProject.status,
          // สังเกต: เรายังไม่ได้สร้างคอลัมน์เก็บ desc, manager, startDate, endDate, priority ใน Supabase
          // ถ้าอยากเก็บด้วย คุณต้องไปสร้างคอลัมน์พวกนี้ในหน้าเว็บ Supabase เพิ่มเติมนะครับ
        }
      ])
      .select(); // ดึงข้อมูลที่เพิ่งสร้างกลับมาเพื่อเอา ID

    if (error) {
      alert(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message}`);
      setIsSubmitting(false);
      return;
    }

    // 2. อัปเดตข้อมูลบนหน้าจอ VS Code (เพื่อให้มันโชว์บนตารางทันทีโดยไม่ต้อง Refresh หน้าเว็บ)
    if (data && data.length > 0) {
      const savedProject = data[0];
      
      let stColor = 'bg-green-100 text-green-700';
      if (newProject.status === 'เสร็จสิ้น') stColor = 'bg-blue-100 text-blue-700';
      if (newProject.status === 'ล่าช้า') stColor = 'bg-red-100 text-red-700';
      const dateDisplay = (newProject.startDate && newProject.endDate) ? `${newProject.startDate} - ${newProject.endDate}` : 'ยังไม่กำหนด';

      const addedProject = {
        id: `PRJ${String(savedProject.id).padStart(3, '0')}`, // ใช้ ID จาก Supabase
        name: newProject.name, 
        pic: newProject.pic, 
        manager: newProject.manager, 
        dept: newProject.dept,
        timeline: dateDisplay, 
        startDate: newProject.startDate, 
        endDate: newProject.endDate,
        status: newProject.status, 
        priority: newProject.priority, 
        desc: newProject.desc, 
        statusColor: stColor
      };
      
      setProjectList([addedProject, ...projectList]);
    }

    handleCancelModal();
    alert("เพิ่มโครงการใหม่สำเร็จ!");
  };

  const handleSaveEdit = () => {
    // โค้ดเดิม (ไว้ผมพาแก้รอบหน้านะครับ รอบนี้ลอง Create ให้ผ่านก่อน)
    if (!newProject.name || !newProject.desc || newProject.dept === 'หน่วยงาน' || !newProject.status || !newProject.priority || !newProject.pic || !newProject.manager) {
      alert("กรุณากรอกข้อมูลในช่องที่มีเครื่องหมาย * ให้ครบถ้วน");
      return;
    }
    const updatedList = projectList.map(p => {
      if (p.id === editingId) {
        let stColor = 'bg-green-100 text-green-700';
        if (newProject.status === 'เสร็จสิ้น') stColor = 'bg-blue-100 text-blue-700';
        if (newProject.status === 'ล่าช้า') stColor = 'bg-red-100 text-red-700';
        const dateDisplay = (newProject.startDate && newProject.endDate) ? `${newProject.startDate} - ${newProject.endDate}` : p.timeline;

        return {
          ...p, name: newProject.name, desc: newProject.desc, dept: newProject.dept, startDate: newProject.startDate, endDate: newProject.endDate,
          timeline: dateDisplay, status: newProject.status, statusColor: stColor, priority: newProject.priority, pic: newProject.pic, manager: newProject.manager
        };
      }
      return p;
    });
    setProjectList(updatedList);
    handleCancelModal();
    alert("บันทึกการแก้ไขสำเร็จ!");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] flex flex-col" style={{ fontFamily: "'Prompt', 'IBM Plex Sans Thai', 'Noto Sans Thai', sans-serif" }}>
      
      {/* HEADER */}
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
            <Link href="/" className="text-[#6B7280] hover:text-[#650014] hover:bg-gray-50 px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer">
              หน้าหลัก
            </Link>
            <div className="bg-[#650014] text-white px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium shadow-sm">
              โครงการ
            </div>
            <Link href="/reports" className="text-[#6B7280] hover:text-[#650014] hover:bg-gray-50 px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer">
              รายงาน
            </Link>
            <Link href="/users" className="text-[#6B7280] hover:text-[#650014] hover:bg-gray-50 px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer">
              ผู้ใช้งาน
            </Link>
            <Link href="/admin" className="text-[#6B7280] hover:text-[#650014] hover:bg-gray-50 px-6 h-[44px] flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer">
              บัญชี
            </Link>
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

      {/* MAIN CONTENT */}
      <main className="max-w-7xl w-full mx-auto px-6 py-10 flex-grow">
        
        <div className="w-full mb-8 text-left">
          <h2 className="text-2xl font-bold text-[#111827]">ฐานข้อมูลติดตามโครงการ</h2>
          <p className="text-sm text-gray-500 mt-1">จัดการและติดตามโครงการทั้งหมด</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          
          <div className="bg-[#FFF8F9] p-5 rounded-2xl border border-[#FCE8EB] shadow-sm flex items-start gap-4 transition-all hover:shadow-md cursor-pointer" onClick={() => setSelectedStatus('โครงการทั้งหมด')}>
            <div className="w-12 h-12 rounded-xl bg-[#FFE4E8] flex items-center justify-center flex-shrink-0 text-[#650014]">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z"/></svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-800">โครงการทั้งหมด</h3>
              <p className="text-[32px] font-bold text-[#650014] my-1 leading-none">{totalCount}</p>
              <p className="text-xs text-gray-500 mt-2">โครงการ</p>
            </div>
          </div>

          <div className="bg-[#F8FFF9] p-5 rounded-2xl border border-[#E8F8EE] shadow-sm flex items-start gap-4 transition-all hover:shadow-md cursor-pointer" onClick={() => setSelectedStatus('กำลังดำเนินการ')}>
            <div className="w-12 h-12 rounded-xl bg-[#E0F8E6] flex items-center justify-center flex-shrink-0 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14.59l-4.3-4.3 1.41-1.41L11 13.76l6.88-6.88 1.41 1.41L11 16.59z"/></svg>
            </div>
            <div className="flex-1 w-full">
              <h3 className="text-sm font-bold text-green-600">กำลังดำเนินการ</h3>
              <p className="text-[32px] font-bold text-gray-900 my-1 leading-none">{activeCount}</p>
              <div className="flex justify-between items-end mb-1.5 mt-2">
                <p className="text-xs text-gray-500">โครงการ</p>
                <p className="text-xs font-bold text-gray-700">{activePercent}%</p>
              </div>
              <div className="w-full bg-green-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full transition-all duration-500" style={{ width: `${activePercent}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-[#F5F8FF] p-5 rounded-2xl border border-[#E8EEFC] shadow-sm flex items-start gap-4 transition-all hover:shadow-md cursor-pointer" onClick={() => setSelectedStatus('เสร็จสิ้น')}>
            <div className="w-12 h-12 rounded-xl bg-[#E0E8FF] flex items-center justify-center flex-shrink-0 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <div className="flex-1 w-full">
              <h3 className="text-sm font-bold text-blue-600">เสร็จสิ้น</h3>
              <p className="text-[32px] font-bold text-gray-900 my-1 leading-none">{completedCount}</p>
              <div className="flex justify-between items-end mb-1.5 mt-2">
                <p className="text-xs text-gray-500">โครงการ</p>
                <p className="text-xs font-bold text-gray-700">{completedPercent}%</p>
              </div>
              <div className="w-full bg-blue-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${completedPercent}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-[#FFF5F5] p-5 rounded-2xl border border-[#FCE8E8] shadow-sm flex items-start gap-4 transition-all hover:shadow-md cursor-pointer" onClick={() => setSelectedStatus('ล่าช้า')}>
            <div className="w-12 h-12 rounded-xl bg-[#FFE0E0] flex items-center justify-center flex-shrink-0 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            </div>
            <div className="flex-1 w-full">
              <h3 className="text-sm font-bold text-red-600">ล่าช้า</h3>
              <p className="text-[32px] font-bold text-gray-900 my-1 leading-none">{delayedCount}</p>
              <div className="flex justify-between items-end mb-1.5 mt-2">
                <p className="text-xs text-gray-500">โครงการ</p>
                <p className="text-xs font-bold text-gray-700">{delayedPercent}%</p>
              </div>
              <div className="w-full bg-red-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full transition-all duration-500" style={{ width: `${delayedPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          
          <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4 relative z-10">
            <div className="bg-gray-50 rounded-full px-5 h-[44px] border border-gray-200 flex items-center w-full lg:w-[300px] focus-within:border-[#650014] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#650014]/20 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="ค้นหาโครงการ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent outline-none w-full text-sm text-[#111827] placeholder-gray-400" />
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="bg-gray-50 rounded-full px-5 h-[44px] border border-gray-200 text-sm outline-none cursor-pointer text-gray-600 appearance-none pr-8 focus:border-[#650014]">
                <option value="โครงการทั้งหมด">สถานะ</option>
                <option value="โครงการทั้งหมด">โครงการทั้งหมด</option>
                <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                <option value="ล่าช้า">ล่าช้า</option>
              </select>
              
              <div className="relative" ref={dropdownRef}>
                <div onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)} className="bg-gray-50 rounded-full px-5 h-[44px] border border-gray-200 flex items-center justify-between min-w-[150px] cursor-pointer text-sm text-gray-600 focus-within:border-[#650014]">
                  <span className="truncate">{selectedDept}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
                {isDeptDropdownOpen && (
                  <div className="absolute top-full mt-2 w-[220px] bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-3 right-0 lg:right-auto">
                    <input type="text" placeholder="พิมพ์ค้นหาหน่วยงาน..." value={deptSearchQuery} onChange={(e) => setDeptSearchQuery(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none mb-2 focus:border-[#650014]" autoFocus />
                    <div className="max-h-48 overflow-y-auto">
                      {filteredDepts.length > 0 ? filteredDepts.map((dept) => (
                        <div key={dept} onClick={() => { setSelectedDept(dept); setIsDeptDropdownOpen(false); setDeptSearchQuery(""); }} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">{dept}</div>
                      )) : <div className="px-3 py-2 text-sm text-gray-400 text-center">ไม่พบข้อมูล</div>}
                    </div>
                  </div>
                )}
              </div>

              <button onClick={openCreateModal} className="bg-[#650014] hover:bg-[#7A001A] text-white px-6 h-[44px] rounded-full text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
                + เพิ่มโครงการ
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <div className={`bg-gray-100 rounded-full px-6 py-4 mb-3 text-sm font-bold text-gray-600 shadow-sm ${tableGridClass}`}>
                <div>รหัสโครงการ</div>
                <div>ชื่อโครงการ</div>
                <div>ผู้รับผิดชอบ</div>
                <div>หน่วยงาน</div>
                <div>ระยะเวลา</div>
                <div>สถานะ</div>
                <div className="text-center">ดำเนินการ</div>
              </div>

              <div className="flex flex-col relative z-0">
                {displayedProjects.length > 0 ? (
                  displayedProjects.map((p) => (
                    <div key={p.id} className={`px-6 py-4 border-b border-gray-50 text-sm hover:bg-gray-50 transition-colors rounded-3xl ${tableGridClass}`}>
                      <div className="font-medium text-gray-900">{p.id}</div>
                      <div className="font-bold text-[#111827]">{p.name}</div>
                      <div className="text-gray-600">{p.pic}</div>
                      <div className="text-gray-600">{p.dept}</div>
                      <div className="text-gray-600">{p.timeline}</div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${p.statusColor}`}>● {p.status}</span>
                      </div>
                      <div className="flex justify-center gap-3 text-gray-400">
                        <button onClick={() => openViewModal(p)} className="hover:text-blue-600 transition-colors underline cursor-pointer hover:font-bold" title="ดูรายละเอียด">👁️ ดู</button>
                        <button onClick={() => openEditModal(p)} className="hover:text-amber-500 transition-colors underline cursor-pointer hover:font-bold" title="แก้ไข">✏️ แก้ไข</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">ไม่พบข้อมูลโครงการที่ค้นหา</div>
                )}
              </div>
            </div>
          </div>

          {totalPages > 0 && (
            <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
              <span>แสดง {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProjects.length)} จาก {filteredProjects.length} โครงการ</span>
              <div className="flex items-center gap-1">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-all">ก่อนหน้า</button>
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button key={pageNumber} onClick={() => setCurrentPage(pageNumber)} className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${currentPage === pageNumber ? "bg-[#650014] text-white shadow-md shadow-[#650014]/20" : "text-gray-600 hover:bg-gray-100 hover:text-[#650014]"}`}>
                      {pageNumber}
                    </button>
                  );
                })}
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-all">ถัดไป</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col relative animate-in fade-in zoom-in duration-200">
            
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-8 py-5 border-b border-gray-100 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-[#111827]">
                {modalMode === 'create' && "สร้างโครงการใหม่ (Create New Project)"}
                {modalMode === 'edit' && `แก้ไขโครงการ: ${editingId}`}
                {modalMode === 'view' && `รายละเอียดโครงการ: ${editingId}`}
              </h2>
              <div className="flex gap-3">
                {modalMode === 'view' ? (
                  <button onClick={handleCancelModal} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 h-[40px] rounded-full text-sm font-bold transition-colors">
                    ออก
                  </button>
                ) : (
                  <>
                    <button disabled={isSubmitting} onClick={handleCancelModal} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 h-[40px] rounded-full text-sm font-bold transition-colors disabled:opacity-50">
                      ยกเลิก
                    </button>
                    {modalMode === 'create' ? (
                      <button disabled={isSubmitting} onClick={handleCreateProject} className="bg-[#650014] hover:bg-[#7A001A] text-white px-6 h-[40px] rounded-full text-sm font-bold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? 'กำลังบันทึก...' : '+ สร้างโครงการ'}
                      </button>
                    ) : (
                      <button onClick={handleSaveEdit} className="bg-[#650014] hover:bg-[#7A001A] text-white px-6 h-[40px] rounded-full text-sm font-bold shadow-md transition-colors">
                        บันทึก
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <h3 className="text-[15px] font-bold text-[#111827] flex items-center gap-2">
                    <span className="text-xl text-gray-500">📁</span> ข้อมูลทั่วไป
                  </h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">ชื่อโครงการ <span className="text-red-500">*</span></label>
                    <input type="text" readOnly={modalMode === 'view' || isSubmitting} placeholder="พัฒนาระบบ e-Commerce ใหม่" value={newProject.name} onChange={(e)=>setNewProject({...newProject, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#650014] read-only:bg-gray-50 read-only:text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">รายละเอียดโครงการ <span className="text-red-500">*</span></label>
                    <textarea rows={3} readOnly={modalMode === 'view' || isSubmitting} placeholder="รายละเอียดโครงการ..." value={newProject.desc} onChange={(e)=>setNewProject({...newProject, desc: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#650014] resize-none read-only:bg-gray-50 read-only:text-gray-500"></textarea>
                  </div>
                  
                  <div className="relative" ref={modalDeptRef}>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">หน่วยงาน <span className="text-red-500">*</span></label>
                    <div onClick={() => modalMode !== 'view' && !isSubmitting && setIsModalDeptOpen(!isModalDeptOpen)} className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex justify-between items-center ${modalMode === 'view' || isSubmitting ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white focus-within:border-[#650014] cursor-pointer'}`}>
                      <span className={newProject.dept === 'หน่วยงาน' ? "text-gray-400" : "text-inherit"}>{newProject.dept}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    {isModalDeptOpen && modalMode !== 'view' && !isSubmitting && (
                      <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-3">
                        <input type="text" placeholder="พิมพ์ค้นหาหน่วยงาน..." value={modalDeptSearch} onChange={(e) => setModalDeptSearch(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none mb-2 focus:border-[#650014]" autoFocus />
                        <div className="max-h-40 overflow-y-auto">
                          {filteredModalDepts.length > 0 ? filteredModalDepts.map((dept) => (
                            <div key={dept} onClick={() => { setNewProject({...newProject, dept: dept}); setIsModalDeptOpen(false); setModalDeptSearch(""); }} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">{dept}</div>
                          )) : <div className="px-3 py-2 text-sm text-gray-400 text-center">ไม่พบข้อมูล</div>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-[15px] font-bold text-[#111827] flex items-center gap-2">
                    <span className="text-xl text-gray-500">📅</span> ระยะเวลา
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">วันที่เริ่ม</label>
                      <input type="date" readOnly={modalMode === 'view' || isSubmitting} value={newProject.startDate} onChange={(e)=>setNewProject({...newProject, startDate: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#650014] text-gray-500 read-only:bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">กำหนดส่ง</label>
                      <input type="date" readOnly={modalMode === 'view' || isSubmitting} value={newProject.endDate} onChange={(e)=>setNewProject({...newProject, endDate: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#650014] text-gray-500 read-only:bg-gray-50" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                
                <div className="flex flex-col gap-4">
                  <h3 className="text-[15px] font-bold text-[#111827] flex items-center gap-2">
                    <span className="text-xl text-red-500">🚩</span> สถานะ & ระดับความสำคัญ
                  </h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">สถานะ <span className="text-red-500">*</span></label>
                    <select disabled={modalMode === 'view' || isSubmitting} value={newProject.status} onChange={(e)=>setNewProject({...newProject, status: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#650014] disabled:bg-gray-50 disabled:text-gray-500 cursor-pointer">
                      <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                      <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                      <option value="ล่าช้า">ล่าช้า</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">ระดับความสำคัญ <span className="text-red-500">*</span></label>
                    <select disabled={modalMode === 'view' || isSubmitting} value={newProject.priority} onChange={(e)=>setNewProject({...newProject, priority: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#650014] disabled:bg-gray-50 disabled:text-gray-500 cursor-pointer">
                      <option value="🔴 สูง (High)">🔴 สูง (High)</option>
                      <option value="🟡 ปานกลาง (Medium)">🟡 ปานกลาง (Medium)</option>
                      <option value="🟢 ต่ำ (Low)">🟢 ต่ำ (Low)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">ผู้รับผิดชอบโครงการ <span className="text-red-500">*</span></label>
                    <input type="text" readOnly={modalMode === 'view' || isSubmitting} placeholder="ระบุชื่อผู้รับผิดชอบโครงการ" value={newProject.pic} onChange={(e)=>setNewProject({...newProject, pic: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#650014] read-only:bg-gray-50 read-only:text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">ผู้จัดการโครงการ <span className="text-red-500">*</span></label>
                    <input type="text" readOnly={modalMode === 'view' || isSubmitting} placeholder="ระบุชื่อผู้จัดการโครงการ" value={newProject.manager} onChange={(e)=>setNewProject({...newProject, manager: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#650014] read-only:bg-gray-50 read-only:text-gray-500" />
                  </div>
                </div>

                <div className="flex flex-col gap-4 h-full">
                  <h3 className="text-[15px] font-bold text-[#111827] flex items-center gap-2">
                    <span className="text-xl text-gray-500">📄</span> เอกสารแนบ
                  </h3>
                  
                  {modalMode !== 'view' && (
                    <>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple disabled={isSubmitting} />
                      <div onClick={() => !isSubmitting && fileInputRef.current?.click()} className={`w-full border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center transition-colors ${isSubmitting ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'}`}>
                        <div className="text-4xl mb-3">📁</div>
                        <button type="button" className="bg-[#650014] text-white px-6 py-2 rounded-full text-sm font-bold shadow-sm pointer-events-none">
                          + อัปโหลดไฟล์
                        </button>
                        <p className="text-xs text-gray-400 mt-2">คลิกเพื่อเลือกไฟล์จากเครื่อง</p>
                      </div>
                    </>
                  )}

                  {uploadedFiles.length > 0 ? (
                    <div className="mt-2 flex flex-col gap-2">
                      <p className="text-sm font-bold text-gray-700">ไฟล์แนบแล้ว:</p>
                      <ul className="text-sm space-y-1">
                        {uploadedFiles.map((file, index) => {
                          const fileUrl = URL.createObjectURL(file);
                          return (
                            <li key={index} className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg text-blue-700">
                              <span>📎</span>
                              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex-grow overflow-hidden text-ellipsis whitespace-nowrap">
                                {file.name}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    modalMode === 'view' && <div className="text-sm text-gray-400 bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">ไม่มีเอกสารแนบ</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}