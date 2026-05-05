export const StorageUtils = {

    local: {
        get: (key: string): any => {
            if (typeof window === 'undefined') return null;
            const item = localStorage.getItem(key);
            try {
                return item ? JSON.parse(item) : null;
            } catch {
                return item;
            }
        },
        set: (key: string, value: any): void => {
            if (typeof window === 'undefined') return;
            const val = typeof value === 'string' ? value : JSON.stringify(value);
            localStorage.setItem(key, val);
        },
        remove: (key: string): void => {
            if (typeof window === 'undefined') return;
            localStorage.removeItem(key);
        }
    },

    cookie: {
        get: (name: string): string | null => {
            if (typeof window === 'undefined') return null;
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
            return null;
        },
        set: (name: string, value: string, days: number = 7): void => {
            if (typeof window === 'undefined') return;
            const d = new Date();
            d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
        },
        remove: (name: string): void => {
            if (typeof window === 'undefined') return;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        }
    }
};
