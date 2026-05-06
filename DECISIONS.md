# Architecture Decisions
 
## Decision 1: Chose Local Vector Search (`@xenova/transformers`) over Dedicated Vector DB
 
### Context
ระบบ RAG จำเป็นต้องเก็บข้อมูลจากเอกสาร PDF และแปลงข้อความเหล่านั้นเป็น Vector Embeddings เพื่อใช้ในการค้นหาคำตอบที่ตรงกับคำถามมากที่สุด (Semantic Search) ในโปรเจกต์ขนาดเล็กหรือช่วงเริ่มต้น การตั้งค่า Vector Database ใหม่ทั้งหมดอาจเป็นภาระเกินไป
 
### Alternatives Considered
เราได้พิจารณาบริการภายนอกยอดนิยมอย่าง Pinecone (อาจติดข้อจำกัดด้าน Cost/API Limit) รวมถึง ChromaDB และ Qdrant ซึ่งล้วนต้องตั้งค่า Container เพิ่มเติมและทำให้สถาปัตยกรรมมีความซับซ้อนเกินความจำเป็น
 
### Why Local Vector Search
เราเลือกใช้ไลบรารี `@xenova/transformers` กับโมเดล `all-MiniLM-L6-v2` เพื่อรันกระบวนการ Embedding แบบ Local ใน Node.js และใช้วิธีคำนวณ Cosine Similarity ด้วยคณิตศาสตร์พื้นฐานในหน่วยความจำ (In-memory) เหตุผลหลักคือเพื่อรักษาความเรียบง่ายของระบบ ลดภาระค่าใช้จ่าย API ภายนอก และทำให้โปรเจกต์ทำงานได้สมบูรณ์ในตัวเอง (Self-contained) 
 
### Trade-offs
เรายอมแลก (Trade-off) กับประสิทธิภาพความเร็ว (Performance) เมื่อปริมาณเอกสารและข้อมูล Chunk มีจำนวนเพิ่มขึ้นแตะหลักหลายหมื่น การคำนวณสดในหน่วยความจำอาจดึงทรัพยากร CPU และ RAM ของเซิร์ฟเวอร์สูงมาก และไม่สามารถทำ Indexing ได้ดีเท่า Vector DB เฉพาะทาง

## Decision 2: Chose PostgreSQL over MySQL
 
### Context
สำหรับฐานข้อมูลหลักที่เก็บข้อมูลผู้ใช้งาน, การ Authentication และประวัติการสนทนา เริ่มต้นเราพิจารณาว่าจะใช้ Relational Database ตัวไหนดีเพื่อให้ตอบโจทย์การสเกลและอาจรวมถึงฟีเจอร์ RAG ในอนาคต
 
### Alternatives Considered
พิจารณาใช้ MySQL ซึ่งเป็นฐานข้อมูลที่คุ้นเคยและตั้งค่าง่าย (ใช้ `mysql2`) 
 
### Why PostgreSQL
เราตัดสินใจเปลี่ยนมาใช้ PostgreSQL เป็นหลัก เนื่องจาก Postgres มีความสามารถในการต่อยอดด้าน Vector Database ที่ดีเยี่ยม (ผ่าน Extension อย่าง pgvector) ซึ่งเหมาะมากกับระบบ RAG ของเราในอนาคต หากเราต้องการย้ายจากการทำ In-memory Similarity Search มาเป็น Database Search นอกจากนี้ Postgres ยังรองรับโครงสร้างข้อมูลที่ซับซ้อนอย่าง JSONB ได้ดีกว่า ทำให้ยืดหยุ่นกว่าในการเก็บประวัติแชทที่มีโครงสร้างหลากหลาย
 
### Trade-offs
ทีมพัฒนาบางคนอาจจะคุ้นเคยกับ MySQL มากกว่า ทำให้ต้องเรียนรู้ Syntax เล็กๆ น้อยๆ ที่ต่างกันของ PostgreSQL รวมถึงอาจใช้ทรัพยากร (RAM) ของเซิร์ฟเวอร์เริ่มต้นที่สูงกว่า MySQL เล็กน้อยในโหมดพื้นฐาน

---

## Decision 3: Chose Service Object Pattern over Inline Route Logic
 
### Context
Next.js App Router แนะนำให้ใช้ API Route (`route.ts`) ในการจัดการ Endpoint อย่างไรก็ตาม เมื่อเราพัฒนาระบบ RAG ที่มีความซับซ้อน เช่น ต้องสกัดไฟล์, ทำ Embedding, และส่งพรอมต์ไปหา Groq LLM การรวมโค้ดทั้งหมดไว้ในฟังก์ชันเดียวทำให้เกิดปัญหาโค้ดบวม (Bloated) และยากต่อการอ่าน
 
### Alternatives Considered
พิจารณาวิธีการสร้างฟังก์ชัน Helper แบบแยกกันกระจัดกระจาย (Functional Helper) หรือการรวมทุกอย่างไว้ใน Route เลยเพื่อให้ไล่ Flow การทำงานจากบนลงล่างได้ในไฟล์เดียว (Inline Approach)
 
### Why Service Object Pattern
เราตัดสินใจใช้รูปแบบ Service Pattern ที่หุ้มการทำงาน (Encapsulate) อยู่ใน Object เดียว (เช่น `ragChatService`) และแยกไปไว้ในโฟลเดอร์ `/service` สาเหตุหลักคือการทำ Separation of Concerns — ไฟล์ `route.ts` จะมีหน้าที่แค่จัดการ Request/Response ในขณะที่การทำงานของ Business Logic หนักๆ จะถูกส่งมายัง Service การทำแบบนี้ช่วยให้เรานำฟังก์ชันไป Reuse ได้ง่ายขึ้น และในอนาคตหากต้องการเขียน Unit Test ก็สามารถ Mock ตัว Service ได้ง่ายกว่าการ Test API Route โดยตรง
 
### Trade-offs
การแยกไฟล์และสร้างเลเยอร์นี้ทำให้จำนวนไฟล์ในโปรเจกต์เพิ่มขึ้น โครงสร้างอาจดูซับซ้อนกว่าปกติสำหรับนักพัฒนามือใหม่ที่เพิ่งเข้ามาดูโค้ด และทำให้เกิด Overhead ตอนที่ต้องมานั่งกำหนด TypeScript Interfaces ส่งข้ามไฟล์ไปมา
