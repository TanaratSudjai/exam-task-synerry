"use client";

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Search } from 'lucide-react';
import BaseInput from '@/components/Base/Input';
import { useClickOutside } from '@/hook/useClickOutside';
import { DropdownProps } from '@/types/dropdown/'

function Dropdown({
  options,
  value,
  onChange,
  label,
  placeholder = "เลือกรายการ...",
  searchable = true,
  searchPlaceholder = "พิมพ์เพื่อค้นหา...",
  className = "",
  error
}: DropdownProps & { error?: string }) {

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
    setSearchTerm('');
  });

  const selectedOption = options.find(opt => opt.value === value);
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const updateCoords = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      updateCoords();
    }
    setIsOpen(!isOpen);
  };

  // ติดตามการ Resize หรือ Scroll เพื่อปรับตำแหน่ง
  React.useEffect(() => {
    if (isOpen) {
      window.addEventListener('scroll', updateCoords, true);
      window.addEventListener('resize', updateCoords);
    }
    return () => {
      window.removeEventListener('scroll', updateCoords, true);
      window.removeEventListener('resize', updateCoords);
    };
  }, [isOpen]);

  return (
    <div className={`flex flex-col gap-1.5 font-kanit w-full ${className}`} ref={dropdownRef}>
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}

      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={toggleDropdown}
          className={`
            flex w-full items-center justify-between rounded-xl border bg-white px-4 py-2.5 text-sm transition-all
            ${isOpen ? 'border-blue-500 ring-4 ring-blue-500/10' : 'hover:border-slate-300'}
            ${error ? 'border-rose-300' : 'border-slate-200'}
            ${!selectedOption ? 'text-slate-400' : 'text-slate-700'}
          `}
        >
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronDown
            size={18}
            className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {error && <p className="text-xs text-rose-500">{error}</p>}

        {isOpen && createPortal(
          <div
            className="fixed z-[9999] mt-2 rounded-xl border border-slate-100 bg-white p-1 shadow-xl animate-in fade-in zoom-in-95 duration-200"
            style={{
              top: coords.top,
              left: coords.left,
              width: coords.width
            }}
          >
            {searchable && (
              <div className="border-b border-slate-100 p-2">
                <BaseInput
                  autoFocus
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={searchPlaceholder}
                  leftIcon={<Search className="h-4 w-4" />}
                  containerClassName="w-full"
                  className="bg-white"
                />
              </div>
            )}

            <ul className="max-h-60 overflow-auto py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`
                    flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors mx-1
                    ${option.value === value
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'}
                  `}
                  >
                    {option.label}
                    {option.value === value && <Check size={16} className="text-blue-600" />}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-sm text-slate-400 text-center">ไม่พบรายการ</li>
              )}
            </ul>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}

export default Dropdown;
