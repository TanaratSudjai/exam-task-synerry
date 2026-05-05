"use client";

import React, { useState } from 'react';
import { LogOut, User, Bell, Search, Settings, ChevronDown } from 'lucide-react';
import { useClickOutside } from '@/hook/useClickOutside';

export default function Navbar() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // ปิด dropdown เมื่อคลิกข้างนอก
    const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsProfileOpen(false));

    const handleLogout = () => {
        // จัดการ logic logout ตรงนี้
        console.log("Logout clicked");
        window.location.href = "/login";
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-end border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md font-kanit">
            {/* Right Side: Notifications & Profile */}
            <div className="flex items-center gap-3">
                <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-rose-500 border-2 border-white" />
                </button>

                <div className="h-6 w-px bg-slate-200 mx-1" />

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                    >
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm ring-2 ring-white">
                            <User size={18} />
                        </div>
                        <div className="hidden lg:flex flex-col items-start leading-none ml-1">
                            <span className="text-sm font-bold text-slate-700">Administrator</span>
                            <span className="text-[10px] text-slate-400 mt-0.5">Super Admin</span>
                        </div>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-3 py-2 border-b border-slate-50 mb-1 lg:hidden">
                                <p className="text-sm font-bold text-slate-700">Administrator</p>
                                <p className="text-xs text-slate-400">Super Admin</p>
                            </div>

                            <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                                <User size={16} />
                                โปรไฟล์
                            </button>
                            <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                                <Settings size={16} />
                                ตั้งค่า
                            </button>

                            <div className="my-1 h-px bg-slate-50" />

                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                                <LogOut size={16} />
                                ออกจากระบบ
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
