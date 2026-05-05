"use client";

import React, { useState } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { th } from 'date-fns/locale/th';
import { getMonth, getYear } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react';
import { DatePickerProps } from '@/types/date/picker';

registerLocale('th', th);

const monthsFull = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

const monthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

function BaseDatePicker({
    selected,
    onChange,
    label,
    placeholder = 'เลือกวันที่',
    minDate,
    maxDate,
    disabled = false,
    className = '',
}: DatePickerProps) {
    const [panel, setPanel] = useState<'calendar' | 'month' | 'year'>('calendar');
    const currentYear = getYear(new Date());
    const years = Array.from({ length: 100 }, (_, index) => currentYear - 80 + index);

    return (
        <div className={`flex w-full flex-col gap-1.5 font-kanit ${className}`}>
            {label && <label className="text-sm font-medium text-slate-700">{label}</label>}

            <div className="relative">
                <ReactDatePicker
                    locale="th"
                    selected={selected}
                    onChange={(date: Date | null) => {
                        onChange(date);
                        setPanel('calendar');
                    }}
                    minDate={minDate}
                    maxDate={maxDate}
                    disabled={disabled}
                    dateFormat="dd/MM/yyyy"
                    placeholderText={placeholder}
                    calendarClassName={`base-datepicker-calendar ${panel !== 'calendar' ? 'base-datepicker-calendar--picker-open' : ''}`}
                    // ใช้ PopperModifiers เพื่อลดเงาและปรับระยะ
                    renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                        <div className="relative z-[60] bg-white p-2 font-kanit">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                                <button
                                    type="button"
                                    onClick={() => setPanel(panel === 'month' ? 'calendar' : 'month')}
                                    className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                                >
                                    {monthsFull[getMonth(date)]} {getYear(date) + 543}
                                    <ChevronsUpDown size={14} className="text-slate-400" />
                                </button>

                                <div className="flex gap-1">
                                    <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled || panel !== 'calendar'} className="p-1.5 hover:bg-slate-50 rounded-full disabled:opacity-10">
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button onClick={increaseMonth} disabled={nextMonthButtonDisabled || panel !== 'calendar'} className="p-1.5 hover:bg-slate-50 rounded-full disabled:opacity-10">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Month Panel */}
                            {panel === 'month' && (
                                <div className="absolute inset-x-0 top-[48px] z-[70] grid grid-cols-3 gap-2 bg-white p-4 border-t border-slate-100 h-[260px]">
                                    {monthsShort.map((month, index) => (
                                        <button
                                            key={month}
                                            type="button"
                                            onClick={() => { changeMonth(index); setPanel('year'); }}
                                            className={`rounded-xl text-sm font-medium transition-all ${getMonth(date) === index ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-500'}`}
                                        >
                                            {month}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Year Panel */}
                            {panel === 'year' && (
                                <div className="absolute inset-x-0 top-[48px] z-[70] grid grid-cols-3 gap-2 bg-white p-4 border-t border-slate-100 h-[260px] overflow-y-auto custom-scrollbar">
                                    {years.map((year) => (
                                        <button
                                            key={year}
                                            type="button"
                                            onClick={() => { changeYear(year); setPanel('calendar'); }}
                                            className={`py-3 rounded-xl text-sm font-medium transition-all ${getYear(date) === year ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-500'}`}
                                        >
                                            {year + 543}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 transition-all focus:border-blue-500 focus:ring-0 disabled:bg-slate-50 disabled:text-slate-400"
                />
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
        </div>
    );
}

export default BaseDatePicker;
