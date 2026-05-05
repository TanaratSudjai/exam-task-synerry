import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { LoginForm } from "@/types/auth";

const initialForm: LoginForm = {
  email: "",
  password: "",
};

export const useAuth = () => {
  const [form, setForm] = useState<LoginForm>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!form.email || !form.password) {
      showToast("กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน", "error");
      return;
    }
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (result?.error) {
        showToast("อีเมลหรือรหัสผ่านไม่ถูกต้อง", "error");
      } else {
        showToast("เข้าสู่ระบบสำเร็จ!", "success");

        // พาเข้าไปหน้า Chat หลังจาก Login ผ่าน
        router.push("/main/chat");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      showToast("เกิดข้อผิดพลาดในการเชื่อมต่อระบบ", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { form, setForm, isLoading, handleLogin, handleChange };
};
