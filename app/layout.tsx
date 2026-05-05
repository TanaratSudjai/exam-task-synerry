import "toastify-js/src/toastify.css"
import './globals.css';
import { Kanit } from 'next/font/google';
import AuthProvider from "@/components/Provider/AuthProvider";

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['400', '700'],
  variable: '--font-kanit',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${kanit.variable} min-h-screen bg-slate-50 `}>
        {children}
      </body>
    </html>
  );
}
