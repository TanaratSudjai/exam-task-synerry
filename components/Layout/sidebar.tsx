"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Home, Menu, Settings, Users, X, LayoutDashboard } from 'lucide-react';
import { MenuIcon, SidebarProps } from '@/types/layout/sidebar';

const iconMap: Record<MenuIcon, React.ComponentType<{ size?: number }>> = {
  home: Home,
  users: Users,
  settings: Settings,
  LayoutDashboard: LayoutDashboard
};

function Sidebar({ menuItems }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const toggleSidebar = () => setIsOpen((current) => !current);
  const toggleSubMenu = (title: string) => {
    setOpenSubMenu((current) => (current === title ? null : title));
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-[60] p-2 bg-slate-800 text-white rounded-md lg:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[40] lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed top-0 left-0 z-[50] h-screen bg-slate-900 text-slate-100 transition-transform duration-300 ease-in-out
        w-64 border-r border-slate-700
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
      `}>
        <div className="p-6">
          <h2 className="text-2xl font-kanit font-bold text-white">THOD DEV LIB</h2>
        </div>

        <nav className="mt-4 px-4 space-y-2 font-kanit">
          {menuItems.map((item) => {
            const Icon = item.icon ? iconMap[item.icon] : null;

            return (
              <div key={item.title}>
                {item.subMenu ? (
                  <button
                    type="button"
                    onClick={() => toggleSubMenu(item.title)}
                    aria-expanded={openSubMenu === item.title}
                    aria-controls={`submenu-${item.title}`}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 group-hover:text-white">
                        {Icon ? <Icon size={20} /> : null}
                      </span>
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${openSubMenu === item.title ? 'rotate-180' : ''}`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href ?? '#'}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 group-hover:text-white">
                        {Icon ? <Icon size={20} /> : null}
                      </span>
                      <span>{item.title}</span>
                    </div>
                  </Link>
                )}

                {item.subMenu && openSubMenu === item.title && (
                  <div className="ml-6 mt-1 flex flex-col border-l border-slate-700/50 pl-4 space-y-1 transition-all duration-300">
                    {item.subMenu.map((sub) => (
                      <a
                        key={sub.title}
                        href={sub.href}
                        className="relative group/sub flex items-center p-2 text-sm text-slate-400 hover:text-white transition-all rounded-md overflow-hidden"
                      >
                        {/* Dot Indicator: จุดเล็กๆ หน้าเมนูย่อย */}
                        <span className="absolute left-[-17px] w-1.5 h-1.5 rounded-full bg-slate-700 group-hover/sub:bg-blue-400 transition-colors" />

                        <span className="font-kanit font-light group-hover/sub:translate-x-1 transition-transform">
                          {sub.title}
                        </span>

                        {/* Hover Highlight: แถบสีบางๆ ด้านหลังเวลาเอาเมาส์วาง */}
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
