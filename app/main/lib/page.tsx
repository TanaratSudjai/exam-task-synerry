"use client"
import React, { useState, useEffect } from "react"
import { UserService } from "@/service/User/userService"
import { validateUserRequest } from "@/valudator/User"
import { showToast } from "@/lib/toast"
import { DateUtils } from "@/utils"

import BaseButton from "@/components/Base/Button"
import BaseInput from "@/components/Base/Input"
import BaseCard from "@/components/Base/Card"
import BaseDatePicker from '@/components/Base/Picker'
import BaseDropdown from '@/components/Base/Dropdown'
import BaseModal from '@/components/Base/Modal'
import BaseConfirmModal from '@/components/Base/ConfirmModal'
import BaseTable from "@/components/Base/Table"
import BaseBadge from "@/components/Base/Badge"
import BaseSwitch from "@/components/Base/Switch"
import BaseLoading from "@/components/Base/Loading"
import BaseSpinner from "@/components/Base/Spinner"
import BaseFileUpload from "@/components/Base/FileUpload";
import { CurrencyUtils } from "@/utils"

// --- Types ---
import { Column } from "@/types/table"
import { UserResponse, UserSubRow } from "@/types/user/response"
import { UserRequest, UserValidationError } from "@/types/user/request"

// --- Icons ---
import { AlertTriangle, CheckCircle, Info, Mail, User, XCircle } from 'lucide-react'
import BaseItemForm from "@/components/Base/ItemForm"

export default function MyPage() {



    const [showDelete, setShowDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [switchOn, setSwitchOn] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('')


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDelete = async () => {
        setLoading(true);

        // จำลองการเรียก API
        await new Promise(res => setTimeout(res, 1000));

        showToast("ลบข้อมูลสำเร็จ", "success");
        setLoading(false);
        setShowDelete(false);
    };

    const handleSubmit = () => {
        setError('')
        console.log('');
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const initialForm = {
        name: "",
        email: "",
        role: "",
        status: "Active",
        preview: ""
    }

    const [formData, setFormData] = useState<UserRequest>(initialForm);
    const [formErrors, setFormErrors] = useState<UserValidationError>({});

    const handleFileChange = (file: File) => {
        const previewUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
            ...prev,
            preview: previewUrl,
        }));
    };

    const handleSave = () => {
        const { isValid, errors } = validateUserRequest(formData);

        if (!isValid) {
            setFormErrors(errors);
            showToast("กรุณาตรวจสอบข้อมูลให้ถูกต้อง", "error");
            return;
        }

        // ถ้าผ่าน...
        setFormErrors({});
        console.log("Saving data:", formData);
        setIsModalOpen(false);
        showToast('เพิ่มข้อมูลสำเร็จ', 'success');

        // Reset form
        setFormData(initialForm);
    };


    const [role, setRole] = useState<string | number>("");

    const roleOptions = [
        { label: "ผู้ดูแลระบบ (Admin)", value: "1" },
        { label: "บรรณาธิการ (Editor)", value: "2" },
        { label: "ผู้ใช้งานทั่วไป (User)", value: "3" },
    ];


    const [startDate, setStartDate] = useState<Date | null>(new Date());

    // ยุบฟังก์ชันให้เหลืออันเดียวเพื่อความ Clean (Optional)
    const handleNotify = (type: 'success' | 'error' | 'warning' | 'info') => {
        const messages = {
            success: "บันทึกข้อมูลสำเร็จแล้ว!",
            error: "เกิดข้อผิดพลาดในการบันทึก!",
            warning: "ระวัง! ข้อมูลบางส่วนอาจไม่ถูกต้อง",
            info: "ระบบกำลังดำเนินการ..."
        };
        showToast(messages[type], type);
    }

    // case table 
    const [search, setSearch] = useState("");
    const [data, setData] = useState<UserResponse[]>([]);
    const [isTableLoading, setIsTableLoading] = useState(true);

    // ดึงข้อมูลเมื่อโหลดหน้า
    useEffect(() => {
        const fetchData = async () => {
            setIsTableLoading(true);
            const users = await UserService.getAllUsers();
            setData(users);
            setIsTableLoading(false);
        };
        fetchData();
    }, []);

    const handleSearch = async () => {
        setIsTableLoading(true);
        const results = await UserService.searchUsers(search);
        setData(results);
        setIsTableLoading(false);
    };

    const handleReset = async () => {
        setSearch("");
        setIsTableLoading(true);
        const users = await UserService.getAllUsers();
        setData(users);
        setIsTableLoading(false);
    };

    const columns: Column<UserResponse>[] = [
        {
            header: "ชื่อ-นามสกุล",
            accessor: "name",
            width: "24%",
            minWidth: 180,
            maxWidth: 220,
        },
        {
            header: "อีเมล",
            accessor: "email",
            width: "30%",
            minWidth: 220,
            maxWidth: 280,
        },
        {
            header: "วันที่เข้าร่วม",
            width: "15%",
            accessor: (item) => (
                <div className="flex flex-col">
                    <span className="text-slate-700">{DateUtils.format(item.createdAt, 'short')}</span>
                    <span className="text-[10px] text-slate-400">{DateUtils.format(item.createdAt, 'relative')}</span>
                </div>
            )
        },
        {
            header: "ยอดเครดิต",
            width: "15%",
            accessor: (item) => (
                <span className="font-bold text-emerald-600">
                    ฿ {CurrencyUtils.format(Number(item.credit))}
                </span>
            )
        },
        {
            header: "สถานะ",
            width: "18%",
            minWidth: 120,
            maxWidth: 140,
            accessor: (item) => {
                const variantMap: Record<string, 'success' | 'warning' | 'danger'> = {
                    'Active': 'success',
                    'Pending': 'warning',
                    'Suspended': 'danger',
                };
                return (
                    <BaseBadge variant={variantMap[item.status] || 'info'}>
                        {item.status}
                    </BaseBadge>
                );
            }
        },
        {
            header: "ตำแหน่ง",
            width: "18%",
            minWidth: 120,
            maxWidth: 140,
            accessor: (item) => {
                const variantMap: Record<string, 'success' | 'warning' | 'danger'> = {
                    'Admin': 'danger',
                    'Editor': 'warning',
                    'Viewer': 'success',
                };
                return (
                    <BaseBadge variant={variantMap[item.role] || 'info'}>
                        {item.role}
                    </BaseBadge>
                );
            }
        },
    ];
    const subRowColumns: Column<UserSubRow>[] = [
        { header: "หัวข้อ", accessor: "field", width: "32%", minWidth: 160, maxWidth: 220 },
        { header: "รายละเอียด", accessor: "value", width: "68%", minWidth: 220, truncate: false },
    ];


    // formCase
    const [formUserCreate, setFormUserCreate] = useState<UserRequest>(initialForm)

    const handleFormUserCreateChange = (field: keyof UserRequest, value: string) => {
        setFormUserCreate((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Action Section */}
            <div className="flex flex-wrap gap-3">
                {/* 1. Case: Warning */}
                <BaseButton
                    shape="full"
                    variant="outline"
                    leftIcon={<AlertTriangle />}
                    onClick={() => handleNotify('warning')}
                    className="border-amber-500 text-amber-600 hover:bg-amber-50"
                >
                    Warning Toast
                </BaseButton>

                {/* 2. Case: Success */}
                <BaseButton
                    shape="full"
                    variant="primary"
                    leftIcon={<CheckCircle />}
                    onClick={() => handleNotify('success')}
                >
                    Success Toast
                </BaseButton>

                {/* 3. Case: Info */}
                <BaseButton
                    shape="full"
                    variant="secondary"
                    leftIcon={<Info />}
                    onClick={() => handleNotify('info')}
                >
                    Info Toast
                </BaseButton>

                {/* 4. Case: Error */}
                <BaseButton
                    shape="full"
                    variant="danger"
                    leftIcon={<XCircle />}
                    onClick={() => handleNotify('error')}
                >
                    Error Toast
                </BaseButton>

                {/* 5. แถม Case: Loading (ลองกดดูได้เลย) */}
                <BaseButton
                    shape="full"
                    variant="primary"
                    isLoading={true}
                >
                    กำลังบันทึก...
                </BaseButton>

                <BaseButton
                    shape="full"
                    variant="primary"
                    onClick={() => setIsModalOpen(true)}>เพิ่มข้อมูลใหม่ (modal)
                </BaseButton>


                <BaseButton
                    shape="full"
                    variant="danger"
                    rightIcon={<XCircle />}
                    onClick={() => setShowDelete(true)}
                >
                    ลบรายการนี้
                </BaseButton>

                <BaseConfirmModal
                    isOpen={showDelete}
                    onClose={() => setShowDelete(false)}
                    onConfirm={handleDelete}
                    isLoading={loading}
                    type="success"
                    title="คุณแน่ใจหรือไม่?"
                    description="การลบข้อมูลนี้จะไม่สามารถเรียกคืนได้อีก คุณต้องการดำเนินการต่อใช่หรือไม่?"
                    confirmText="ใช่, ลบเลย"
                    cancelText="ไม่, ยกเลิก"
                    shape="rounded"
                    btnSize="md"
                />

            </div>

            {/* Components Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BaseCard >
                    <BaseInput
                        id="name"
                        label="ชื่อ"
                        type="text"
                        value={formUserCreate.name}
                        onChange={(e) => handleFormUserCreateChange("name", e.target.value)}
                        placeholder="กรอกชื่อ"
                        leftIcon={<User className="h-4 w-4" />}
                    />
                    <BaseInput
                        id="email"
                        label="อีเมล"
                        type="email"
                        value={formUserCreate.email}
                        onChange={(e) => handleFormUserCreateChange("email", e.target.value)}
                        placeholder="กรอกอีเมล"
                        leftIcon={<Mail className="h-4 w-4" />}
                    />
                    <BaseInput
                        id="role"
                        label="รหัสผ่าน"
                        type="password"
                        value={formUserCreate.role}
                        onChange={(e) => handleFormUserCreateChange("role", e.target.value)}
                        placeholder="กรอกรหัสผ่าน"
                    />
                    <BaseInput
                        id="status"
                        label="สถานะ"
                        type="text"
                        value={formUserCreate.status}
                        onChange={(e) => handleFormUserCreateChange("status", e.target.value)}
                        placeholder="กรอกสถานะ"
                    />
                </BaseCard>


                <BaseCard className="grid grid-cols-3 gap-2">
                    <div className="">
                        <BaseDatePicker
                            label="วันที่เกิด"
                            selected={startDate}
                            onChange={(date: Date | null) => setStartDate(date)}
                        />
                        {startDate && (
                            <p className="mt-4 text-sm text-slate-500 font-kanit">
                                วันที่เลือก: {startDate.toLocaleDateString('th-TH')}
                            </p>
                        )}
                    </div>
                    <div className="">
                        <BaseDropdown
                            label="ระดับสิทธิ์การใช้งาน"
                            placeholder="กรุณาเลือกตำแหน่ง..."
                            options={roleOptions}
                            value={role}
                            onChange={(val) => setRole(val)}
                        />
                        {role && (
                            <p className="mt-4 text-sm font-kanit text-slate-500">
                                ค่าที่เลือกคือ: <strong>{role}</strong>
                            </p>
                        )}
                    </div>
                    <div className="">
                        <BaseSpinner
                            show={true}
                            fullScreen={false}
                            activeColor="emerald"
                            text="กำลังโหลดข้อมูล..."
                            description="กรุณารอสักครู่"
                        />
                    </div>
                </BaseCard>

                <BaseCard className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                        <BaseBadge variant="success">อนุมัติแล้ว</BaseBadge>
                        <BaseBadge variant="warning">รอตรวจสอบ</BaseBadge>
                        <BaseBadge variant="danger">ปฏิเสธ</BaseBadge>
                        <BaseBadge variant="info">กำลังดำเนินการ</BaseBadge>
                    </div>
                    <div className="flex flex-col gap-3 border-t pt-4">
                        <BaseSwitch
                            label="สลับสถานะการใช้งาน"
                            description={switchOn ? 'เปิดใช้งาน   ' : 'ปิดใช้งาน'}
                            activeColor="blue"
                            checked={switchOn}
                            onChange={setSwitchOn}
                        />


                        <BaseItemForm onSubmit={handleSubmit} error={error}>
                            <BaseFileUpload
                                id="profile"
                                name="profile"
                                label="เพิ่มรูปภาพ"
                                preview={formData.preview}
                                onFileChange={handleFileChange}
                            />
                            <BaseInput
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="ชื่อจริง-นามสกุล"
                            />
                            <div className="flex gap-3 pt-4">
                                <BaseButton type="submit" fullWidth isLoading={submitLoading}>
                                    บันทึกข้อมูล
                                </BaseButton>
                                <BaseButton type="button" variant="outline" fullWidth>
                                    ยกเลิก
                                </BaseButton>
                            </div>
                        </BaseItemForm>


                    </div>
                </BaseCard>

                <BaseCard>
                    <BaseLoading type="table" rows={5} />
                </BaseCard>

                <BaseModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="เพิ่มสมาชิกใหม่"
                    size="md"
                    footer={
                        <>
                            <BaseButton shape="full" variant="outline" onClick={() => setIsModalOpen(false)}>ยกเลิก</BaseButton>
                            <BaseButton shape="full" onClick={handleSave}>บันทึกข้อมูล</BaseButton>
                        </>
                    }
                >
                    {/* ใส่เนื้อหา Form ตรงนี้ */}
                    <form className="space-y-4 font-kanit">
                        <BaseInput
                            label="ชื่อ-นามสกุล"
                            type="text"
                            placeholder="ระบุชื่อ..."
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            error={formErrors.name}
                        />
                        <BaseInput
                            label="อีเมล"
                            type="email"
                            placeholder="ระบุอีเมล..."
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            error={formErrors.email}
                        />
                        <BaseDropdown
                            label="สิทธิ์การใช้งาน"
                            options={roleOptions}
                            value={formData.role}
                            onChange={(val) => setFormData({ ...formData, role: val.toString() })}
                            error={formErrors.role}
                        />
                    </form>
                </BaseModal>
            </div>

            <BaseCard  >
                <BaseTable
                    data={data}
                    columns={columns}
                    showIndex
                    searchValue={search}
                    onSearchChange={setSearch}
                    onSearchSubmit={handleSearch}
                    onReset={handleReset}
                    showPagination
                    pageSize={3}
                    isLoading={isTableLoading}
                    renderSubRow={(item) => (
                        <>
                            <BaseTable
                                data={item.subRows}
                                columns={subRowColumns}
                                showIndex
                                showToolbar={false}
                            />
                        </>
                    )}
                />
            </BaseCard>

        </div>
    );
}
