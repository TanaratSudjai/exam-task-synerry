"use client";

import React, { CSSProperties, useState } from 'react';
import { Search, RotateCcw, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/Base/Button';
import BaseInput from '@/components/Base/Input';
import { Column, TableProps } from '@/types/table';
import BaseCard from './Card';
import BaseLoading from './Loading';

const toSize = (value?: number | string) => {
    if (typeof value === 'number') {
        return `${value}px`;
    }

    return value;
};

const getColumnStyle = <T,>(column: Column<T>): CSSProperties => ({
    width: toSize(column.width),
    minWidth: toSize(column.minWidth),
    maxWidth: toSize(column.maxWidth),
});

export function BaseTable<T extends { id: string | number }>({
    data,
    columns,
    renderSubRow,
    showIndex,
    indexHeader,
    searchValue,
    onSearchChange,
    onSearchSubmit,
    onReset,
    showToolbar,
    showPagination,
    pageSize = 10,
    isLoading
}: TableProps<T>) {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const shouldShowToolbar = showToolbar ?? Boolean(
        searchValue !== undefined && onSearchChange && onSearchSubmit && onReset
    );
    const shouldShowPagination = showPagination ?? data.length > pageSize;
    const totalPages = shouldShowPagination ? Math.max(1, Math.ceil(data.length / pageSize)) : 1;
    const activePage = Math.min(currentPage, totalPages);
    const pageStartIndex = shouldShowPagination ? (activePage - 1) * pageSize : 0;
    const pageEndIndex = shouldShowPagination ? pageStartIndex + pageSize : data.length;
    const visibleData = shouldShowPagination ? data.slice(pageStartIndex, pageEndIndex) : data;
    const visibleColumnCount = columns.length + (renderSubRow ? 1 : 0) + (showIndex ? 1 : 0);

    const toggleRow = (id: string | number) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="space-y-2 font-kanit">
            {shouldShowToolbar && (
                <BaseCard className="flex flex-wrap gap-2">
                    <BaseInput
                        type="text"
                        value={searchValue ?? ''}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        placeholder="ค้นหาข้อมูล..."
                        leftIcon={<Search className="h-4 w-4" />}
                        containerClassName="flex-1 min-w-[200px]"
                    />
                    <Button shape="full" onClick={onSearchSubmit} leftIcon={<Search size={18} />}>ค้นหา</Button>
                    <Button shape="full" variant="outline" onClick={onReset} leftIcon={<RotateCcw size={18} />}>รีเซ็ต</Button>
                </BaseCard>
            )}

            {/* Table Section */}
            <BaseCard className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                            <tr>
                                {renderSubRow && <th className="p-4 w-10"></th>}
                                {showIndex && <th className="p-4 w-16 font-medium text-sm">{indexHeader ?? 'ลำดับ'}</th>}
                                {columns.map((col: Column<T>, idx: number) => (
                                    <th
                                        key={idx}
                                        style={getColumnStyle(col)}
                                        className={`p-4 font-medium text-sm ${col.headerClassName ?? ''}`}
                                    >
                                        <div className={col.truncate === false ? '' : 'truncate'}>
                                            {col.header}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={visibleColumnCount}>
                                        <BaseLoading type="table" rows={pageSize} />
                                    </td>
                                </tr>
                            ) : data.length > 0 ? (
                                visibleData.map((item: T, idx: number) => (
                                    <React.Fragment key={item.id}>
                                        <tr className={`hover:bg-slate-50/80 transition-colors ${expandedRows[item.id] ? 'bg-blue-50/30' : ''}`}>
                                            {renderSubRow && (
                                                <td className="p-4">
                                                    <button type="button" onClick={() => toggleRow(item.id)} className="text-slate-400 hover:text-blue-600 transition-colors">
                                                        {expandedRows[item.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                                    </button>
                                                </td>
                                            )}
                                            {showIndex && (
                                                <td className="p-4 text-sm text-slate-500">
                                                    {pageStartIndex + idx + 1}
                                                </td>
                                            )}
                                            {columns.map((col: Column<T>, idx: number) => (
                                                <td
                                                    key={idx}
                                                    style={getColumnStyle(col)}
                                                    className={`p-4 text-sm text-slate-700 ${col.cellClassName ?? ''}`}
                                                >
                                                    <div className={col.truncate === false ? '' : 'truncate'}>
                                                        {typeof col.accessor === 'function'
                                                            ? col.accessor(item)
                                                            : (item[col.accessor] as T[keyof T] & React.ReactNode)}
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                        {/* Expandable Sub-row */}
                                        {renderSubRow && expandedRows[item.id] && (
                                            <tr className="bg-slate-50/50">
                                                <td colSpan={visibleColumnCount} className="p-0">
                                                    <div className="p-4 animate-in fade-in slide-in-from-left-2 duration-300">
                                                        {renderSubRow(item)}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={visibleColumnCount}>
                                        <BaseLoading type="empty" />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </BaseCard>

            {shouldShowPagination && data.length > 0 && (
                <BaseCard className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500">
                        แสดง {pageStartIndex + 1}-{Math.min(pageEndIndex, data.length)} จาก {data.length} รายการ
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCurrentPage((prev) => Math.max(Math.min(prev, totalPages) - 1, 1))}
                            disabled={activePage === 1}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ChevronLeft size={16} />
                            ก่อนหน้า
                        </button>
                        <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
                            {activePage} / {totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() => setCurrentPage((prev) => Math.min(Math.min(prev, totalPages) + 1, totalPages))}
                            disabled={activePage === totalPages}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            ถัดไป
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </BaseCard>
            )}
        </div>
    );
}

export default BaseTable;
