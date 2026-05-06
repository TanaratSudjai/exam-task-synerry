import { PdfReader } from "pdfreader";

// ฟังก์ชันช่วยจัดการภาษาไทยที่เพี้ยนจากการสกัด PDF
const normalizeThaiText = (text: string): string => {
    return text
        // 1. ลบช่องว่างระหว่างพยัญชนะกับสระ/วรรณยุกต์ (เช่น แ ม ่ -> แม่)
        .replace(/\s+([ัิีึืุู็่้๊๋์])/g, '$1')
        // 2. จัดการช่องว่างที่อาจจะเกิดขึ้นระหว่างสระหน้ากับพยัญชนะ (เช่น แ ม -> แม)
        .replace(/([เแโใไ])\s+([ก-ฮ])/g, '$1$2')
        // 3. จัดการช่องว่างระหว่างพยัญชนะ (กรณีโดนแยกทุกตัวอักษร)
        // จะใช้ Regex ที่ระวังไม่ให้ไปรวมคำที่ตั้งใจเว้นวรรคจริงๆ
        .replace(/([ก-ฮ])\s+(?=[ก-ฮ][ัิีึืุู็่้๊๋์]?)/g, '$1')
        // 4. ลบช่องว่างซ้ำซ้อน
        .replace(/\s+/g, ' ')
        .trim();
};


export const extractTextFromBuffer = async (buffer: Buffer, fileType: string): Promise<string> => {
    if (fileType === "application/pdf") {
        return new Promise((resolve, reject) => {
            let text = "";
            let hasData = false;

            // @ts-ignore
            new PdfReader().parseBuffer(buffer, (err: any, item: any) => {
                if (err) {
                    console.error("PdfReader Error:", err);
                    reject(new Error("ไม่สามารถอ่านไฟล์ PDF ได้: " + err.message));
                } else if (!item) {
                    // จบการอ่านไฟล์ และทำความสะอาดภาษาไทย
                    const cleanedText = normalizeThaiText(text);
                    console.log("PDF Parsing Completed. Cleaned length:", cleanedText.length);
                    resolve(cleanedText);
                } else if (item.text) {
                    text += item.text + " ";
                    hasData = true;
                }
            });
        });
    } else {
        return normalizeThaiText(buffer.toString("utf-8"));
    }
};

export const chunkText = (text: string, chunkSize: number = 800, overlap: number = 150): string[] => {
    if (!text || text.trim().length === 0) return [];

    const chunks: string[] = [];
    let i = 0;
    while (i < text.length) {
        chunks.push(text.slice(i, i + chunkSize));
        i += (chunkSize - overlap);
        if (chunkSize - overlap <= 0) break;
    }
    return chunks;
};
