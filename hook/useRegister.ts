import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import axios from "axios";
import { RegisterForm } from "@/types/auth";

const initialForm: RegisterForm = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
};

export const useRegister = () => {
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!form.email || !form.password) {
      showToast("กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน", "warning");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("/api/auth/register", {
        email: form.email,
        password: form.password,
        first_name: form.firstName,
        last_name: form.lastName,
      });
      showToast("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ", "success");
      router.push("/");
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.error || "เกิดข้อผิดพลาดในการเชื่อมต่อระบบ";
      showToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { form, setForm, isLoading, handleRegister, handleChange };
};
