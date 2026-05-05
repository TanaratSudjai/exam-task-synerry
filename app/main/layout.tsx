import "toastify-js/src/toastify.css"
import './globals.css';

import { Kanit } from 'next/font/google';
import { MenuItem } from '@/types/layout/sidebar';
import Sidebar from '@/components/Layout/sidebar';
import Navbar from '@/components/Layout/navbar';

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['400', '700'],
  variable: '--font-kanit',
});


const myMenu: MenuItem[] = [
  // {
  //   title: 'Board Lib components',
  //   icon: 'LayoutDashboard',
  //   href: '/main/lib'
  // },
  {
    title: 'Chat AI',
    icon: 'message',
    href: '/main/chat'
  },
  {
    title: 'Document RAG',
    icon: 'file',
    href: '/main/rag'
  }
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="en">
      <div className={`${kanit.variable} min-h-screen bg-slate-50 flex`}>
        {/* Sidebar */}
        <Sidebar menuItems={myMenu} />
        {/* Main Content Area */}
        <div className="flex flex-1 flex-col lg:ml-64 min-h-screen w-full overflow-hidden">
          <Navbar />
          {/* Dynamic Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
