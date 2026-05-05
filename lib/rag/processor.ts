import { PdfReader } from "pdfreader";

export interface ProcessedDocument {
    fileName: string;
    text: string;
    chunks: string[];
}

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
                    // จบการอ่านไฟล์
                    console.log("PDF Parsing Completed. Total length:", text.length);
                    if (!hasData && text.length === 0) {
                        console.warn("PDF parsed but no text was extracted.");
                    }
                    resolve(text.trim());
                } else if (item.text) {
                    // สะสมข้อความจากแต่ละส่วนของ PDF
                    text += item.text + " ";
                    hasData = true;
                }
            });
        });
    } else {
        return buffer.toString("utf-8");
    }
};

export const chunkText = (text: string, chunkSize: number = 800, overlap: number = 150): string[] => {
    if (!text || text.trim().length === 0) return [];

    // ลบ whitespace และอักขระพิเศษส่วนเกิน
    const cleanText = text.replace(/\s+/g, ' ').trim();
    const chunks: string[] = [];

    let i = 0;
    while (i < cleanText.length) {
        chunks.push(cleanText.slice(i, i + chunkSize));
        i += (chunkSize - overlap);

        // กัน Loop ค้างถ้า i ไม่เพิ่ม
        if (chunkSize - overlap <= 0) break;
    }
    return chunks;
};
