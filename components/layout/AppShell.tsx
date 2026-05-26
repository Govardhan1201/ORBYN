'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Network, Search, Plus, List, Bookmark, LayoutDashboard, 
  Settings, LogOut, ChevronLeft, Zap, Sparkles, BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/ThemeProvider';

import { AddDataModal } from '@/components/data/AddDataModal';
import { SearchBar } from '@/components/search/SearchBar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const NAV_ITEMS = [
    { label: 'Graph View', icon: Network, href: '/dashboard' },
    { label: 'List View', icon: List, href: '/dashboard/list' },
    { label: 'My Projects', icon: LayoutDashboard, href: '/dashboard/projects' },
    { label: 'Saved Links', icon: Bookmark, href: '/dashboard/saved' },
    { label: 'Topics & Tags', icon: BrainCircuit, href: '/dashboard/topics' },
  ];

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <div className="flex h-screen overflow-hidden bg-[#020617] p-4 gap-4">
      {/* Floating Sidebar */}
      <aside
        className={cn(
          'relative z-30 flex flex-col rounded-2xl border border-white/10 bg-[#09090b]/60 backdrop-blur-3xl transition-all duration-300 ease-in-out shadow-2xl',
          collapsed ? 'w-[80px]' : 'w-[280px]'
        )}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-4 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 shadow-glow-blue">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            {!collapsed && (
              <span className="font-display text-2xl font-bold text-gradient whitespace-nowrap opacity-100 transition-opacity">
                Orbyn
              </span>
            )}
          </Link>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-2 custom-scrollbar">
          {!collapsed && (
            <div className="px-3 mb-3 text-xs font-bold text-muted-foreground tracking-widest uppercase">
              Intelligence
            </div>
          )}
          
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative overflow-hidden',
                  isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-glow-blue' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent'
                )}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
                )}
                <item.icon className={cn('w-5 h-5 shrink-0 relative z-10', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-white transition-colors')} />
                {!collapsed && (
                  <span className="font-medium text-sm whitespace-nowrap relative z-10">{item.label}</span>
                )}
                {isActive && !collapsed && (
                  <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary shadow-glow-blue animate-pulse relative z-10" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-white/5 shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-4 px-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px] shadow-glow-blue">
                <div className="w-full h-full rounded-full bg-[#020617] flex items-center justify-center text-sm font-bold text-white">
                  {session?.user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{session?.user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all border border-transparent hover:border-white/5"
              title={collapsed ? 'Settings' : undefined}
            >
              <Settings className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="font-medium text-sm">Settings</span>}
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
              title={collapsed ? 'Log out' : undefined}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="font-medium text-sm">Log out</span>}
            </button>
          </div>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-[#020617] border border-white/20 flex items-center justify-center text-muted-foreground hover:text-white shadow-glow-blue z-40 transition-colors"
        >
          <ChevronLeft className={cn('w-4 h-4 transition-transform duration-300', collapsed && 'rotate-180')} />
        </button>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col relative z-20 min-w-0 gap-4">
        {/* Floating Top Navbar */}
        <header className="h-16 rounded-2xl flex items-center justify-between px-6 border border-white/10 bg-[#09090b]/60 backdrop-blur-3xl shrink-0 shadow-lg">
          {/* Search */}
          <div className="w-96">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 ml-4">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all shadow-glow-blue active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Data</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 rounded-2xl overflow-hidden relative border border-white/5 bg-[#09090b]/40 backdrop-blur-sm">
          {children}
        </div>
      </main>
      
      {/* Modals */}
      <AddDataModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
