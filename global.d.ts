declare module 'toastify-js' {
  interface ToastifyOptions {
    text?: string;
    duration?: number;
    close?: boolean;
    gravity?: 'top' | 'bottom';
    position?: 'left' | 'center' | 'right';
    stopOnFocus?: boolean;
    style?: Record<string, string>;
    onClick?: () => void;
    backgroundColor?: string;
  }

  interface ToastifyInstance {
    showToast: () => void;
  }

  export default function Toastify(options: ToastifyOptions): ToastifyInstance;
}
