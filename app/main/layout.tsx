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



import Navbar from '@/components/Layout/navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${kanit.variable} min-h-screen bg-slate-50 flex`}>
        {/* Sidebar */}
        <Sidebar menuItems={myMenu} />
        
        {/* Main Content Area */}
        <div className="flex flex-1 flex-col lg:ml-64 min-h-screen w-full overflow-hidden">
          {/* Top Navigation */}
          <Navbar />
          
          {/* Dynamic Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
