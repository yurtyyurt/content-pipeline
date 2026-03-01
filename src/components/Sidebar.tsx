'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Search,
  Sparkles,
  Columns3,
  Users,
  Settings,
  Zap,
  Menu,
  X,
  MessageSquare,
  Brain,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/research', label: 'Research', icon: Search },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/create', label: 'Create', icon: Sparkles },
  { href: '/pipeline', label: 'Pipeline', icon: Columns3 },
  { href: '/competitors', label: 'Competitors', icon: Users },
  { href: '/brain', label: 'Brain', icon: Brain },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-800 border border-dark-500 rounded-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static z-50 h-screen w-64 bg-dark-800 border-r border-dark-500 flex flex-col transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-dark-500 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-accent" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight">Content Pipeline</h1>
              <p className="text-[11px] text-gray-500">TikTok & X Engine</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden p-1 text-gray-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-dark-500">
          <div className="flex gap-2">
            <span className="px-2 py-1 text-[11px] font-medium rounded-md bg-tiktok/10 text-tiktok">
              TikTok
            </span>
            <span className="px-2 py-1 text-[11px] font-medium rounded-md bg-xblue/10 text-xblue">
              X
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
