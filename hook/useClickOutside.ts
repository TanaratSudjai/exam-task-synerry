import { useEffect, useRef, RefObject } from 'react';

/**
 * Hook สำหรับจัดการการคลิกภายนอก Element ที่กำหนด
 * @param handler ฟังก์ชันที่จะให้ทำงานเมื่อคลิกข้างนอก
 * @returns ref ที่ต้องเอาไปแปะไว้ที่ Element หลัก
 */
export function useClickOutside<T extends HTMLElement>(handler: () => void): RefObject<T | null> {
    const domNode = useRef<T>(null);

    useEffect(() => {
        const maybeHandler = (event: MouseEvent) => {
            // ตรวจสอบว่าจุดที่คลิก ไม่ได้อยู่ใน domNode ที่เราอ้างอิงไว้
            if (domNode.current && !domNode.current.contains(event.target as Node)) {
                handler();
            }
        };

        document.addEventListener("mousedown", maybeHandler);

        return () => {
            document.removeEventListener("mousedown", maybeHandler);
        };
    }, [handler]);

    return domNode;
}