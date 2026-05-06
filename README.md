# Knowledge Assistant
 
## Tech Stack (เทคโนโลยีที่ใช้)
- **Framework:** Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Database:** PostgreSQL
- **Vector DB / AI:** Local In-Memory Vector Search (`@xenova/transformers`), Groq SDK (LLM)
 
## Setup & Run (การติดตั้งและรัน)
สามารถรันโปรเจกต์ผ่าน npm หรือ Docker (ถ้าตั้งค่าไว้) ด้วยคำสั่งเดียว:
 
```bash
docker-compose up -d
# or
npm install && npm run dev
```
 
## Features Done (ฟีเจอร์ที่เสร็จแล้ว)
- [x] Login + Protected Routes
- [x] File Upload & Document Parsing
- [x] RAG (Semantic Search & AI Chat with Citations)
 
## Architecture (โครงสร้างระบบ)
แอปพลิเคชันทำงานแบบ Full-stack ด้วย Next.js App Router โดยยึดหลัก **Separation of Concerns** และ **Service Pattern** เพื่อให้ง่ายต่อการพัฒนาต่อยอด (Maintainability):

- **UI Components (`/components`)**: แยกเป็นชิ้นส่วนย่อยๆ โดยมี `Base/` สำหรับ UI กลาง (Button, Modal) และโฟลเดอร์แยกตามฟีเจอร์ (เช่น `Chat/`) เพื่อให้หน้า Page สะอาดที่สุด

- **Client Services (`/service`)**: แยก Logic การยิง API (Axios) ออกจาก Component ทำให้ Component ทำหน้าที่แค่ Render และส่ง Action เท่านั้น

- **Backend Services**: API Routes (`app/api/...`) จะสั้นกระชับ ทำหน้าที่แค่รับ Request/Response ส่วน Business Logic ที่ซับซ้อน (เช่น RAG, สกัดข้อความ) จะถูกแยกไปเขียนเป็น Service Pattern (เช่น `ragBackendService.ts`) เพื่อให้อ่านง่ายและเทสง่าย

- **Types & Utils (`/types`, `/utils`)**: รวบรวม TypeScript Interfaces และฟังก์ชันช่วยเหลือ (เช่น ซ่อมคำไทย) ไว้ที่ส่วนกลาง ไม่ประกาศทิ้งไว้ตามไฟล์ Component เด็ดขาด

- **RAG Flow:** 
  1. แปลงคำถามผู้ใช้เป็น Vector (Embeddings) ด้วย Local Model 
  2. ค้นหาเนื้อหาที่ตรงกันที่สุดด้วย Cosine Similarity (In-memory)
  3. ส่ง Context + คำถามไปให้ Groq LLM วิเคราะห์และเรียบเรียงคำตอบเป็นภาษาไทยพร้อมแหล่งอ้างอิง

## Known Issues (ปัญหาที่พบ)
- ระบบค้นหา Vector ปัจจุบันทำงานใน Memory (คำนวณ Cosine Similarity สดๆ) หากมีข้อมูลเอกสารจำนวนมากอาจมีปัญหาเรื่อง Performance (ควรเปลี่ยนไปใช้ Vector DB จริงๆ เช่น Milvus, Pinecone ในอนาคต)
- การสกัดข้อความภาษาไทยจาก PDF บางทียังมีปัญหาสระลอยและเว้นวรรคเพี้ยน ต้องใช้ทั้ง Regex ช่วยแก้และบังคับ LLM ให้ช่วยเรียบเรียงใหม่
