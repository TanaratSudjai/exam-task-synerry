"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown, Home, Menu, Settings, Users, X, LayoutDashboard, MessageSquare } from 'lucide-react';
import { MenuIcon, SidebarProps } from '@/types/layout/sidebar';

const iconMap: Record<MenuIcon, React.ComponentType<{ size?: number }>> = {
  home: Home,
  users: Users,
  settings: Settings,
  LayoutDashboard: LayoutDashboard,
  message: MessageSquare
};

function Sidebar({ menuItems }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const toggleSidebar = () => setIsOpen((current) => !current);
  const toggleSubMenu = (title: string) => {
    setOpenSubMenu((current) => (current === title ? null : title));
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-[60] p-2 bg-emerald-900 text-white rounded-md lg:hidden"
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
        fixed top-0 left-0 z-[50] h-screen bg-emerald-700 text-emerald-50 transition-transform duration-300 ease-in-out
        w-64 border-r border-emerald-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
      `}>
        <div className="p-3 flex justify-center items-center gap-3">
          <Image
            src="/hi-remove-bg.png"
            alt="Logo"
            width={150}
            height={150}
          />
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
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors group text-left ${openSubMenu === item.title || item.subMenu?.some(sub => isActive(sub.href))
                      ? 'bg-emerald-800/50 text-white'
                      : 'hover:bg-emerald-800 text-emerald-100'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${openSubMenu === item.title || item.subMenu?.some(sub => isActive(sub.href))
                        ? 'text-white'
                        : 'text-emerald-300 group-hover:text-white'
                        }`}>
                        {Icon ? <Icon size={20} /> : null}
                      </span>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${openSubMenu === item.title ? 'rotate-180' : ''}`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href ?? '#'}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors group text-left ${isActive(item.href)
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'hover:bg-emerald-800 text-emerald-100'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${isActive(item.href) ? 'text-white' : 'text-emerald-300 group-hover:text-white'}`}>
                        {Icon ? <Icon size={20} /> : null}
                      </span>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {isActive(item.href) && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    )}
                  </Link>
                )}

                {item.subMenu && openSubMenu === item.title && (
                  <div className="ml-6 mt-1 flex flex-col border-l border-emerald-700/50 pl-4 space-y-1 transition-all duration-300">
                    {item.subMenu.map((sub) => (
                      <Link
                        key={sub.title}
                        href={sub.href ?? '#'}
                        className={`relative group/sub flex items-center p-2 text-sm transition-all rounded-md overflow-hidden ${isActive(sub.href) ? 'text-white font-medium bg-white/10' : 'text-emerald-200 hover:text-white'
                          }`}
                      >
                        {/* Dot Indicator */}
                        <span className={`absolute left-[-17px] w-1.5 h-1.5 rounded-full transition-colors ${isActive(sub.href) ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-emerald-600 group-hover/sub:bg-white'
                          }`} />

                        <span className={`font-kanit ${isActive(sub.href) ? '' : 'font-light'} group-hover/sub:translate-x-1 transition-transform`}>
                          {sub.title}
                        </span>

                        {/* Hover/Active Highlight */}
                        <div className={`absolute inset-0 bg-white/5 transition-opacity ${isActive(sub.href) ? 'opacity-100' : 'opacity-0 group-hover/sub:opacity-100'
                          }`} />
                      </Link>
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
