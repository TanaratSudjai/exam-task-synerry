import { NextResponse } from "next/server";
import { UserRepository } from "@/lib/user-db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, first_name, last_name } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "กรุณากรอกอีเมลและรหัสผ่าน" }, { status: 400 });
    }
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await UserRepository.createUser({
      email,
      passwordHash: hashedPassword,
      first_name,
      last_name
    });

    return NextResponse.json({ message: "สมัครสมาชิกสำเร็จ", id: userId }, { status: 201 });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" }, { status: 500 });
  }
}
