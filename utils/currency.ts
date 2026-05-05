
export const CurrencyUtils = {
    /**
     * ฟอร์แมตตัวเลขให้เป็นรูปแบบเงินตรา (เช่น 1,250.00)
     * @param value ตัวเลขที่ต้องการฟอร์แมต
     * @param decimals จำนวนทศนิยม (ค่าเริ่มต้น 2)
     * @returns string
     */
    format: (value: number | string | null | undefined, decimals: number = 2): string => {
        if (value === null || value === undefined || value === '') return '0.00';

        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num)) return '0.00';

        return new Intl.NumberFormat('th-TH', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(num);
    },

    /**
     * ฟอร์แมตตัวเลขแบบย่อ (เช่น 1.2K, 1.5M)
     */
    compact: (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(value);
    },
};
