# AI Usage Journal
 
## Session 1: Setting up Docker Environment
**Prompt:** "Help me create a docker-compose.yml for a Next.js app with a PostgreSQL database"
**AI Response:** AI สร้างไฟล์ `docker-compose.yml` มาให้ โดยใช้ image `postgres:15` พร้อมกับ `Dockerfile` สำหรับรัน Next.js และช่วยตั้งค่า Environment variables เบื้องต้น
**My Adjustment:** ผมนำมาปรับแก้ Port และ Username/Password ของ PostgreSQL ให้ตรงกับไฟล์ `.env` ของโปรเจกต์ และเลือกที่จะรัน Next.js แบบ Local (`npm run dev`) แทนการโยนลง Docker ทั้งหมด เพื่อให้ HMR (Hot Reload) ทำงานได้เร็วกว่าตอนพัฒนา

## Session 2: Implementing RAG Pipeline (Embeddings & Search)
**Prompt:** "How can I generate text embeddings locally in Next.js without using OpenAI API?"
**AI Response:** แนะนำให้ใช้ไลบรารี `@xenova/transformers` กับโมเดล `all-MiniLM-L6-v2` เพื่อสร้าง Vector Embeddings ได้เลยใน Node.js โดยไม่ต้องพึ่ง API ภายนอก พร้อมเขียนฟังก์ชัน Cosine Similarity สำหรับค้นหาความคล้ายให้ด้วย
**My Adjustment:** เอาฟังก์ชันมาปรับแต่งเป็นแบบ Singleton Pattern เขียนเก็บไว้ใน `lib/rag/embeddings.ts` เพื่อป้องกันไม่ให้ Next.js ต้องโหลด AI Model ใหม่ทุกครั้งที่มี API Request เข้ามา (โหลดแค่ครั้งแรกครั้งเดียว) 

## Session 3: Fixing Thai Text Extraction from PDF
**Prompt:** "When extracting Thai text from a PDF using pdfreader, the vowels and tone marks have wrong spacing. How can I fix this?"
**AI Response:** เขียนโค้ด Regex แบบยาวเหยียดมาเพื่อพยายามไล่ลบช่องว่างระหว่างพยัญชนะกับสระลอยต่างๆ 
**My Adjustment:** ผมย่อตัว Regex ให้เหลือแค่ตัวที่จำเป็น (cleanThaiText) และเลือกใช้ LLM เข้ามาช่วยแก้ปัญหาแทน โดยการเขียน System Prompt บังคับให้ Groq ช่วย "ซ่อมแซมและเรียบเรียง" ภาษาไทยจากเอกสารที่เพี้ยน ให้ออกมาเป็นประโยคที่ถูกต้อง ซึ่งได้ผลลัพธ์ที่เนียนกว่าการใช้ Regex เดาคำ

## Session 4: Code Refactoring (Architecture & Service Pattern)
**Prompt:** "How to clean up my Next.js API route? It has too much logic for RAG and similarity search."
**AI Response:** แนะนำให้แยก Logic ที่ซับซ้อนออกไปเป็น Helper functions วางไว้ในไฟล์แยก
**My Adjustment:** ผมนำมาต่อยอดโดยการทำเป็น Object Service Pattern เต็มรูปแบบ (`ragChatService` ในโฟลเดอร์ `service/RAG/ragBackendService.ts`) เพื่อให้ API Route สั้นที่สุด และย้าย `interface` ของ TypeScript ทั้งหมดที่กระจายอยู่ ไปรวมกันไว้ที่โฟลเดอร์ `/types` ส่วนกลาง เพื่อให้ดูแลรักษาง่ายขึ้น

## Session 5: Setting up NextAuth for Authentication
**Prompt:** "How to setup NextAuth with CredentialsProvider in Next.js App Router?"
**AI Response:** ให้ตัวอย่างไฟล์ `route.ts` สำหรับตั้งค่า NextAuth พร้อม Credentials Provider พื้นฐาน
**My Adjustment:** นำมาปรับเพิ่มตรรกะการตรวจสอบรหัสผ่านกับ Database โดยใช้ `bcryptjs` และดึงค่า Secret Key จากไฟล์ `.env` เพื่อความปลอดภัย

## Session 6: Password Hashing with bcryptjs
**Prompt:** "Best way to hash passwords before saving to PostgreSQL in Node.js?"
**AI Response:** แนะนำให้ใช้ไลบรารี `bcrypt` หรือ `bcryptjs` พร้อมตัวอย่างโค้ด `bcrypt.hashSync`
**My Adjustment:** ผมเลือกใช้ `bcryptjs` เพื่อลดปัญหาการ compile C++ (native bindings) ในบาง environment ตอน deploy และนำไปเขียนเป็นฟังก์ชันแยกใน `AuthService`

## Session 7: Designing a Reusable Modal Component
**Prompt:** "Create a reusable Modal component in React with Tailwind CSS, must be centered and have a backdrop blur."
**AI Response:** เขียนโค้ด Modal ธรรมดาที่มีพื้นหลังดำทึบ (bg-black/50) มาให้
**My Adjustment:** เพิ่มคลาส `backdrop-blur-sm` และใส่แอนิเมชัน `animate-in fade-in zoom-in-95` เข้าไปเพื่อให้ UI ดูนุ่มนวลและพรีเมียมขึ้นตามสไตล์ของโปรเจกต์

## Session 8: Chat UI - ChatBubble Component
**Prompt:** "Design a chat bubble UI similar to ChatGPT using Tailwind v4"
**AI Response:** ให้โค้ดหน้าตาแชทแบบสลับซ้ายขวา ใช้กล่องสีเทาและสีน้ำเงินเป็นพื้นฐาน
**My Adjustment:** ปรับแก้สีให้เป็นสีประจำโปรเจกต์ (Emerald) และปรับความโค้งมนของขอบ (rounded-2xl) พร้อมเพิ่มเงา `shadow-md` ให้เข้ากับ Design System ที่เหลือของระบบ

## Session 9: PostgreSQL Connection Pool Setup
**Prompt:** "How to correctly setup a PostgreSQL connection pool in Next.js to avoid 'too many connections' error?"
**AI Response:** แนะนำให้ใช้ไลบรารี `pg` (node-postgres) สร้าง `Pool` และเก็บไว้ในตัวแปร global สำหรับโหมด Development
**My Adjustment:** จัดการสร้างไฟล์ Database Helper และทำ Caching ตัว Pool ไว้ใน `globalThis` เพื่อป้องกันการสร้าง Connection ค้างไว้เยอะเกินไปเวลาที่ระบบทำการ Hot Reload

## Session 10: Extracting text from PDF Buffer
**Prompt:** "How to extract text from a PDF buffer in memory without saving to disk in Node.js?"
**AI Response:** แนะนำไลบรารี `pdf-parse` หรือ `pdfreader` สำหรับอ่านจาก Buffer โดยตรง
**My Adjustment:** ผมเลือกใช้ `pdfreader` เพราะจัดการเรื่องตำแหน่งตัวอักษรและการอ่านทีละบรรทัดได้ค่อนข้างละเอียดกว่า นำมาหุ้มด้วย Promise เพื่อให้ใช้คำสั่ง `async/await` ได้สะดวกในไฟล์ `processor.ts`

## Session 11: Prompt Engineering for Thai Language
**Prompt:** "My LLM answers in Thai but sounds like a robot. What system prompt should I use?"
**AI Response:** ให้คำแนะนำเรื่องการกำหนด Role และสั่งให้บอท "ตอบเหมือนมนุษย์ทั่วไป"
**My Adjustment:** ผมปรับแต่ง System Prompt ใน `RagChatService` แบบเฉพาะเจาะจง ให้สวมบทบาทเป็น "ผู้เชี่ยวชาญด้านการวิเคราะห์เอกสาร (Thai RAG Specialist)" กำหนดกฎเหล็กว่าต้องตอบจากเอกสารเท่านั้น และบังคับตอบกลับเป็นโครงสร้าง JSON ล้วนๆ

## Session 12: Implementing a Chat History Sidebar
**Prompt:** "Create a collapsible sidebar component for chat history in Next.js"
**AI Response:** ให้โค้ด Sidebar พื้นฐานที่มีปุ่มกดเปิดปิดและดึงข้อมูลจำลองมาแสดง
**My Adjustment:** นำมาปรับเพิ่มปุ่ม "แชทใหม่" และแยก Component เป็น `SidebarHistory` โดยปรับให้รับ Props ข้อมูลประวัติเซสชันแชทจากข้างนอกเข้ามาแทนที่จะประมวลผลเองข้างใน

## Session 13: Handling Loading States
**Prompt:** "Create a skeleton loading component for a list of items using Tailwind CSS"
**AI Response:** ให้โค้ดที่ใช้ `animate-pulse` แบบกล่องสี่เหลี่ยมธรรมดาเรียงกัน
**My Adjustment:** ผมต่อยอดสร้างเป็น Component ส่วนกลางชื่อ `BaseLoading` ที่สามารถปรับรูปแบบ (Type) ได้หลายแบบ เช่น แบบ Spinner, Table Skeleton, Card Skeleton เพื่อเอาไป reuse ใช้ได้ทั้งเว็บ

## Session 14: Centralizing TypeScript Interfaces
**Prompt:** "Is it bad practice to declare TypeScript interfaces in the same file as React components?"
**AI Response:** อธิบายว่าทำได้ แต่ถ้าระบบใหญ่ขึ้นควรแยกไฟล์ออกมาเพื่อการ Reuse ที่ดีกว่า
**My Adjustment:** ผมไล่ refactor ย้าย Interface ทั้งหมด (เช่น `ModalProps`, `BaseLoadingProps`, `SidebarHistoryProps`) ไปไว้ในโฟลเดอร์ `/types` ส่วนกลางอย่างเป็นระเบียบ

## Session 15: Fixing Image URL Errors
**Prompt:** "Next.js Invalid src prop on next/image, hostname is not configured"
**AI Response:** บอกว่าต้องไปแก้ไขไฟล์ `next.config.js` ตรงส่วน `images.remotePatterns`
**My Adjustment:** ผมเลือกที่จะแก้ไขที่ฝั่ง Client โดยนำ `process.env.NEXT_PUBLIC_BASE_URL` มาต่อหน้า string ของ Source เพื่อให้เรียกรูปผ่าน Relative Path หรือ URL ภายนอกได้อย่างถูกต้อง

## Session 16: Clickable Reference Citations
**Prompt:** "How to render a string containing '[1]' as a clickable span or button in React?"
**AI Response:** ให้โค้ดตัวอย่างการใช้ Regex `split` คู่กับ `.match` เพื่อหาข้อความในวงเล็บก้ามปู
**My Adjustment:** ผมนำมาสร้างเป็น Component แยกที่ชื่อ `ContentRenderer` จากเดิมที่เป็นปุ่มกด ก็ปรับเป็น `span` ธรรมดาและตกแต่งด้วยโทนสี Emerald เพื่อแสดงเป็นป้ายกำกับแหล่งอ้างอิงท้ายข้อความแบบเนียนๆ

## Session 17: Optimizing PDF Text Extraction Performance
**Prompt:** "Extracting text from large PDFs takes too long. How can I optimize this in Node.js?"
**AI Response:** แนะนำให้ใช้ `stream` เพื่อประมวลผลทีละหน้า และปิดการใช้งานฟีเจอร์ที่กินทรัพยากรสูง เช่น เอฟเฟกต์ 3 มิติ
**My Adjustment:** นำเทคนิค Stream มารวมกับ `pdfreader` ใน `ProcessorService` เพื่อให้อ่านไฟล์ขนาดใหญ่ได้โดยไม่ค้าง และสั่ง `disableTextLayer: true, disableFont: true` เพื่อตัดฟังก์ชันที่เกินความจำเป็นออกไป

## Session 18: Cleaning Up "Stray Characters" from PDF
**Prompt:** "My PDF text extraction has weird characters like circles or boxes around Thai text. How to fix it?"
**AI Response:** แนะนำให้ใช้ Regex แทนที่อักขระพิเศษเหล่านั้นด้วยช่องว่างหรืออักษรปกติ
**My Adjustment:** ผมเพิ่ม Regex Cleaning เข้าไปใน `ProcessorService` ที่จุดก่อนส่งเข้า Embeddings โดยเน้นลบพวก ``, `□`, และ `§` ออกไป เพื่อให้ Vector Search จับคู่คำได้แม่นยำขึ้น

## Session 19: Proper Error Handling in Next.js API Routes
**Prompt:** "My API route crashes when PDF parsing fails. How to handle it gracefully?"
**AI Response:** สอนเรื่องการใช้ Try-Catch และส่งค่า Error Code กลับไปให้ Client
**My Adjustment:** ผมนำมาปรับใช้กับ API ทั้งหมดใน `app/api/...` โดยห่อทุกอย่างด้วย `try-catch` และส่ง Status 500 พร้อมข้อความ error ที่อ่านง่าย (sanitized) กลับไปหา Frontend

## Session 20: Implementing a "Chat New" Functionality
**Prompt:** "I want to add a 'New Chat' button in my sidebar that clears the current chat messages."
**AI Response:** แนะนำให้ใช้ State Management หรือ Redux เพื่อควบคุมสถานะแชท
**My Adjustment:** ผมใช้ `useState` ใน `ChatPage` เป็นหลัก โดยสร้างฟังก์ชัน `handleNewChat` ที่สั่ง Set State `messages([])` และสร้าง `currentSessionId(Date.now())` ใหม่ เพื่อให้ Sidebar สามารถเรียกใช้และรีเซ็ต UI ได้ทันที

## Session 21: Securing PostgreSQL Credentials
**Prompt:** "Is it safe to put PostgreSQL password directly in `docker-compose.yml`?"
**AI Response:** แนะนำให้ใช้ Environment Variables (`env_file` หรือ Shell variables) แทนการพิมพ์รหัสผ่านลงไปตรงๆ
**My Adjustment:** ผมแก้ไขไฟล์ `docker-compose.yml` ให้ดึงค่าจากไฟล์ `.env` ที่สร้างขึ้นใหม่แทน เพื่อให้รักษารหัสผ่านเป็นความลับและทำความสะอาด `.env` (Add .env to .gitignore) ให้เรียบร้อย

## Session 22: Improving PDF Content Extraction Logic
**Prompt:** "My PDF text extraction is missing some content, especially from tables or columns."
**AI Response:** แนะนำให้อ่านเอกสารแบบ 'Raw' และปรับการแสดงผลตามตำแหน่ง (X, Y) ของตัวอักษร
**My Adjustment:** ผมเข้าไปแก้ไขใน `processor.ts` โดยเพิ่มตรรกะการจัดกลุ่มข้อความตามตำแหน่ง X เพื่อให้ข้อความที่อยู่ซ้ายมือขึ้นก่อน และพยายามรวมบรรทัดที่ดูเหมือนจะต่อกัน (มี Y ใกล้เคียงกัน) ให้เป็นประโยคเดียว

## Session 23: Implementing Chat History Pagination
**Prompt:** "I have 100 chat sessions, listing them all crashes the UI. How to fix?"
**AI Response:** แนะนำเทคนิค Pagination (แบ่งหน้า) หรือ Lazy Loading
**My Adjustment:** ผมไปที่ `SidebarHistory` และจำกัดการแสดงผลแค่ 10 เซสชันแรก (Slice) และเพิ่ม Logic ดึงข้อมูลทีละน้อยเมื่อผู้ใช้เลื่อนลง (Infinite Scroll concept แบบง่าย) เพื่อลดภาระการ Render

## Session 24: Adding Scrollbar Styling
**Prompt:** "Make the scrollbar in my chat interface look nicer, like the default macOS scrollbar."
**AI Response:** แนะนำใช้ Tailwind CSS หรือ Custom CSS selectors เช่น `::-webkit-scrollbar`
**My Adjustment:** ผมสร้างไฟล์ `globals.css` (ส่วนที่เพิ่ม) เพื่อกำหนดค่า Scrollbar ให้มีสีจางๆ (`scrollbar-thumb-gray-400/50`) และโปร่งแสงเมื่อไม่ใช้งาน เพื่อให้เข้ากับ Dark Mode ของแอป

## Session 25: Optimizing Vector Search Speed
**Prompt:** "Similarity search is slow. Should I switch from Cosine Similarity to Dot Product?"
**AI Response:** อธิบายว่า Dot Product เร็วกว่าเพราะไม่ต้องทำ Square Root แต่ต้องปรับค่าความยาว Vector ก่อน
**My Adjustment:** ผมทำการ Refactor ใน `ragService.ts` เพื่อเปลี่ยนไปใช้ `dotProduct` โดยเพิ่มฟังก์ชัน `normalize` และ `calculateSimilarity` เข้าไป คำนวณใหม่ทีเดียวตอนสร้าง Vector เลย เพื่อให้การค้นหาเร็วขึ้นทันที

## Session 26: Creating a Loading Spinner
**Prompt:** "Add a loading spinner component in the chat area."
**AI Response:** ให้โค้ด Spinner ที่ใช้ `rotate` และ `animate-spin` ของ Tailwind
**My Adjustment:** ผมนำมาปรับปรุงสร้างเป็น Component `BaseLoading` ให้รองรับ Props `type="spinner"` เพื่อให้สามารถเรียกใช้ซ้ำในส่วนอื่นๆ ของเว็บได้ และจัด UI ให้ดูสวยงามขึ้นในกล่องของตัวเอง

## Session 27: Handling Upload Errors
**Prompt:** "I uploaded a non-PDF file and the app crashed. How to validate file types?"
**AI Response:** สอนเรื่องการตรวจสอบ `file.type` หรือ Extentions ก่อนประมวลผล
**My Adjustment:** ผมเพิ่ม Logic `if (!file.name.toLowerCase().endsWith('.pdf'))` ที่ด่านหน้าใน `ChatPage` และแสดง Toast Error ไปพร้อมกัน เพื่อแจ้งเตือนผู้ใช้ก่อนที่ข้อมูลจะวิ่งไปหา Server

## Session 28: UI Layout Refinement
**Prompt:** "The sidebar is too wide, and the main content should have a fixed max-width."
**AI Response:** แนะนำให้ปรับค่า Tailwind `w-full md:w-1/4` และ `max-w-4xl`
**My Adjustment:** ผมนำไปปรับใช้กับ `ChatPage` โดยลดขนาด Sidebar เหลือ `md:w-1/3` และเพิ่ม `max-w-7xl` ให้พื้นที่ Chat เพื่อให้พื้นที่ดูสมดุลมากขึ้น ไม่เบียดจนเกินไป

## Session 29: Implementing File Drop Zone
**Prompt:** "Make the file upload section support drag and drop."
**AI Response:** แนะนำให้ใช้ Event Handlers (`onDragOver`, `onDrop`) ใน React
**My Adjustment:** ผมสร้าง Component `DropZone` แยกออกมาต่างหาก พร้อม Overlay (หน้าจอซ้อน) สีเทาจางๆ ตอนกำลังลากไฟล์ทับ และซ่อน Overlay เมื่อลากไฟล์ออก (Mouse Leave) เพื่อให้ UI ดูมีปฏิสัมพันธ์

## Session 30: Hiding Input While Uploading
**Prompt:** "When I click upload, the input field should disappear or be disabled."
**AI Response:** แนะนำให้ใช้ State `isUploading` เพื่อควบคุมการ Render
**My Adjustment:** ผมผูก State `isUploading` เข้ากับ Component `DropZone` และเพิ่ม Prop `disabled={isUploading}` เข้าไป เพื่อให้กดพิมพ์หรือเลือกไฟล์ไม่ได้ในช่วงที่กำลังรอประมวลผล
