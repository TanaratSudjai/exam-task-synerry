import Image from 'next/image';

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
    <div>
      <Image src={"/give.png"} alt="AI Image" width={100} height={100} />
    </div>
    <div>
      <h3 className="text-xl font-bold text-slate-800">พร้อมเริ่มต้นการสนทนาหรือยัง?</h3>
      <p className="text-slate-400 mt-2 max-w-xs mx-auto">
        พิมพ์ข้อความด้านล่างเพื่อเริ่มคุยกับ AI อัจฉริยะของคุณได้ทันที
      </p>
    </div>
  </div>
);

export default EmptyState;
