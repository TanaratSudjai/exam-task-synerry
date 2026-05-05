"use client"

import React from "react";
import Image from "next/image";
import BaseCard from "@/components/Base/Card";
import BaseInput from "@/components/Base/Input";
import BaseButton from "@/components/Base/Button";
import BaseItemForm from "@/components/Base/ItemForm";
import Link from "next/link";
import { useRegister } from "@/hook/useRegister";

export default function RegisterPage() {
  const { form, isLoading, handleRegister, handleChange } = useRegister();

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <BaseCard className="p-8 shadow-md border-0">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/give.png"
                alt="Logo"
                width={150}
                height={150}
              />
            </div>
            <h1 className="font-kanit font-bold text-3xl text-slate-800">สมัครสมาชิก</h1>
            <p className="font-kanit font-light text-slate-500 mt-2">
              กรอกข้อมูลเพื่อเริ่มต้นใช้งาน
            </p>
          </div>

          <BaseItemForm onSubmit={handleRegister} className="space-y-4">
            <div className="flex gap-4">
              <BaseInput
                label="ชื่อ"
                type="text"
                placeholder="ชื่อจริง"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                disabled={isLoading}
                containerClassName="flex-1"
              />
              <BaseInput
                label="นามสกุล"
                type="text"
                placeholder="นามสกุล"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                disabled={isLoading}
                containerClassName="flex-1"
              />
            </div>

            <BaseInput
              label="อีเมล"
              type="email"
              placeholder="example@email.com"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={isLoading}
            />

            <BaseInput
              label="รหัสผ่าน"
              type="password"
              placeholder="••••••••"
              name="password"
              value={form.password}
              onChange={handleChange}
              disabled={isLoading}
            />

            <BaseButton
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              className="h-12 text-base mt-2"
            >
              ยืนยันการสมัคร
            </BaseButton>
          </BaseItemForm>

          <div className="mt-6 text-center">
            <p className="text-sm font-kanit text-slate-500">
              มีบัญชีอยู่แล้ว?{" "}
              <Link href="/" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </BaseCard>
      </div>
    </main>
  );
}
