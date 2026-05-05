"use client"

import React from "react";
import Image from "next/image";
import BaseCard from "@/components/Base/Card";
import BaseInput from "@/components/Base/Input";
import BaseButton from "@/components/Base/Button";
import { useAuth } from "@/hook/useAuth";
import BaseItemForm from "@/components/Base/ItemForm";
import Link from "next/link";

export default function LoginPage() {
  const { form, setForm, isLoading, handleLogin, handleChange } = useAuth();

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <BaseCard className="p-8 shadow-md border-0">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/hi.png"
                alt="Logo"
                width={150}
                height={150}
              />
            </div>
            <h1 className="font-kanit font-bold text-3xl text-slate-800">เข้าสู่ระบบ</h1>
            <p className="font-kanit font-light text-slate-500 mt-2">
              กรุณากรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งาน
            </p>
          </div>
          <BaseItemForm onSubmit={handleLogin} className="space-y-5">
            <BaseInput
              label="อีเมล"
              type="email"
              placeholder="admin@admin.com"
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
              className="h-12 text-base mt-4"
            >
              เข้าสู่ระบบ
            </BaseButton>
          </BaseItemForm>

          <div className="mt-6 text-center">
            <p className="text-sm font-kanit text-slate-500">
              ยังไม่มีบัญชี?{" "}
              <Link href="/register" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                สมัครสมาชิก
              </Link>
            </p>
          </div>
        </BaseCard>
      </div>
    </main>
  );
}