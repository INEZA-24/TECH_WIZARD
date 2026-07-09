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
        <Link href="/admin/dashboard" className="flex items-center gap-3 text-xl font-black">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow"><WandSparkles size={22} /></span>
          Tech Wizard
        </Link>
        <nav className="mt-10 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return <Link key={item.href} href={item.href} className={cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition', active ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground')}><Icon size={18} />{item.label}</Link>;
          })}
        </nav>
        <Button variant="ghost" className="absolute bottom-6 left-6 right-6 justify-start" onClick={() => signOut()}><LogOut className="mr-2" size={18} /> Sign out</Button>
      </aside>
      <main className="min-h-screen p-4 lg:ml-72 lg:p-8">
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-border bg-card/70 p-4 backdrop-blur lg:hidden">
          <Link href="/admin/dashboard" className="font-black text-primary">Tech Wizard</Link>
          <Button variant="ghost" onClick={() => signOut()}><LogOut size={18} /></Button>
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>{children}</motion.div>
      </main>
    </div>
  );
}
