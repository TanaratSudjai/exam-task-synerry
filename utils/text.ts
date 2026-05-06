export const cleanThaiText = (text: string): string => {
    return text
        .replace(/\s+([ัิีึืุู็่้๊๋์])/g, '$1') // ลบช่องว่างหน้าสระ/วรรณยุกต์
        .replace(/([ก-ฮ])\s+([ก-ฮ])/g, '$1$2') // ลองรวมพยัญชนะที่แยกกัน (ถ้าจำเป็น)
        .trim();
};
