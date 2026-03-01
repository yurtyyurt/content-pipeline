import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'Content Pipeline — TikTok & X Engine',
  description: 'AI-powered content research, creation, and pipeline management for TikTok and X',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-900 text-white`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-6 lg:p-8 pl-16 lg:pl-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
