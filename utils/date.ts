import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';

export type DateFormatPattern = 'full' | 'short' | 'datetime' | 'relative' | 'iso';

export const DateUtils = {
    format: (date: Date | string | number | null | undefined, pattern: DateFormatPattern = 'full'): string => {
        if (!date) return '-';

        let dateObj: Date;

        if (typeof date === 'string') {
            dateObj = parseISO(date);
        } else if (typeof date === 'number') {
            dateObj = new Date(date);
        } else {
            dateObj = date;
        }

        if (!isValid(dateObj)) return 'Invalid Date';

        switch (pattern) {
            case 'full':
                // ตัวอย่าง: 12 เมษายน 2569 (บวก 543 สำหรับ พ.ศ.)
                const day = format(dateObj, 'd');
                const month = format(dateObj, 'MMMM', { locale: th });
                const year = dateObj.getFullYear() + 543;
                return `${day} ${month} ${year}`;

            case 'short':
                // ตัวอย่าง: 12 เม.ย. 69
                const shortYear = (dateObj.getFullYear() + 543).toString().slice(-2);
                return format(dateObj, `d MMM ${shortYear}`, { locale: th });

            case 'datetime':
                // ตัวอย่าง: 12/04/2026 18:44
                return format(dateObj, 'dd/MM/yyyy HH:mm');

            case 'relative':
                // ตัวอย่าง: 5 นาทีที่แล้ว
                return formatDistanceToNow(dateObj, { locale: th, addSuffix: true });

            case 'iso':
                return dateObj.toISOString();

            default:
                return format(dateObj, 'dd/MM/yyyy');
        }
    },

    /**
     * ดึงปี พ.ศ. ปัจจุบัน
     */
    getThaiYear: (date: Date = new Date()): number => {
        return date.getFullYear() + 543;
    },

    /**
     * ตรวจสอบว่าเป็นวันนี้หรือไม่
     */
    isToday: (date: Date): boolean => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    }
};
