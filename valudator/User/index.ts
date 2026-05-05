import { UserRequest, UserValidationError } from "@/types/user/request";

export const validateUserRequest = (data: Partial<UserRequest>) => {
    const errors: UserValidationError = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. ตรวจสอบชื่อ
    if (!data.name || data.name.trim() === "") {
        errors.name = "กรุณาระบุชื่อ-นามสกุล";
    } else if (data.name.length < 3) {
        errors.name = "ชื่อต้องมีความยาวอย่างน้อย 3 ตัวอักษร";
    }

    // 2. ตรวจสอบอีเมล
    if (!data.email || data.email.trim() === "") {
        errors.email = "กรุณาระบุอีเมล";
    } else if (!emailRegex.test(data.email)) {
        errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    // 3. ตรวจสอบสิทธิ์การใช้งาน
    if (!data.role || data.role === "") {
        errors.role = "กรุณาเลือกสิทธิ์การใช้งาน";
    }

    // 4. ตรวจสอบสถานะ
    if (!data.status || data.status === "") {
        errors.status = "กรุณาเลือกสถานะ";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
