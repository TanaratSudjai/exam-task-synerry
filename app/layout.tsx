import "toastify-js/src/toastify.css"
import './globals.css';


import { Kanit } from 'next/font/google';
import { MenuItem } from '@/types/layout/sidebar';
import Sidebar from '@/components/Layout/sidebar';

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['400', '700'],
  variable: '--font-kanit',
});


const myMenu: MenuItem[] = [
  { title: 'Dashboard', icon: 'home', href: '/' },
  {
    title: 'Management',
    icon: 'users',
    subMenu: [
      { title: 'User List', href: '/users' },
      { title: 'Permissions', href: '/permissions' },
    ]
  },
  {
    title: 'Board Lib components',
    icon: 'LayoutDashboard',
    href: '/lib'
  }
];




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
