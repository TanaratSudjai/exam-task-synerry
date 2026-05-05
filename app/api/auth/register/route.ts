import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, first_name, last_name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "กรุณากรอกอีเมลและรหัสผ่าน" }, { status: 400 });
    }

    // Check if user already exists
    const [existing]: any = await db.execute(
      'SELECT id FROM clients WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result]: any = await db.execute(
      'INSERT INTO clients (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, first_name || null, last_name || null]
    );

    return NextResponse.json({ message: "สมัครสมาชิกสำเร็จ", id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" }, { status: 500 });
  }
}
