
export const FileUtils = {

    downloadBlob: (data: any, fileName: string, mimeType: string): void => {
        if (typeof window === 'undefined') return;
        const blob = new Blob([data], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },

    previewBlob: (data: any, mimeType: string = 'application/pdf'): void => {
        if (typeof window === 'undefined') return;

        const blob = new Blob([data], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
    },
    formatSize: (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};
