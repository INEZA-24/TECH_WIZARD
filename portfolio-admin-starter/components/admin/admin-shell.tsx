'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Award, FolderKanban, LayoutDashboard, LogOut, WandSparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useAuth } from './auth-provider';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/certificates', label: 'Certificates', icon: Award },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoading, isAuthenticated, signOut } = useAuth();

  if (isLoading || !isAuthenticated) {
    return <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Loading admin...</div>;
  }

  return (
    <div className="cyan-grid min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border bg-background/85 p-6 backdrop-blur lg:block">
        <Brand />
        <NavList pathname={pathname} className="mt-10 space-y-2" />
        <Button variant="ghost" className="absolute bottom-12 left-6 right-6 justify-start" onClick={() => signOut()}>
          <LogOut className="mr-2" size={18} /> Sign out
        </Button>
      </aside>

      <main className="min-h-screen p-4 lg:ml-72 lg:p-8">
        <div className="mb-4 rounded-2xl border border-border bg-card/70 p-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="font-black text-primary">Tech Wizard</Link>
            <Button variant="ghost" onClick={() => signOut()} aria-label="Sign out"><LogOut size={18} /></Button>
          </div>
          <NavList pathname={pathname} className="mt-4 grid grid-cols-3 gap-2" compact />
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {children}
        </motion.div>
      </main>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/admin/dashboard" className="flex items-center gap-3 text-xl font-black">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
        <WandSparkles size={22} />
      </span>
      Tech Wizard
    </Link>
  );
}

function NavList({ pathname, className, compact = false }: { pathname: string; className?: string; compact?: boolean }) {
  return (
    <nav className={className} aria-label="Admin navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 rounded-2xl text-sm font-semibold transition',
              compact ? 'justify-center px-2 py-2 text-xs' : 'px-4 py-3',
              active ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
            )}
          >
            <Icon size={compact ? 15 : 18} />
            <span className={compact ? 'sr-only sm:not-sr-only' : ''}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
