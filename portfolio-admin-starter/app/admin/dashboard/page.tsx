'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Award, FolderKanban } from 'lucide-react';
import { AdminShell } from '../../../components/admin/admin-shell';
import { useAuth } from '../../../components/admin/auth-provider';
import { Card } from '../../../components/ui/card';
import { countContent } from '../../../lib/content-service';
import { initialCertificates, initialProjects } from '../../../lib/mock-data';
import { isSupabaseConfigured } from '../../../lib/supabase-client';

type Counts = {
  projects: number;
  certificates: number;
};

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const [counts, setCounts] = useState<Counts>({
    projects: initialProjects.length,
    certificates: initialCertificates.length,
  });
  const [status, setStatus] = useState(isSupabaseConfigured ? 'Loading Supabase totals...' : 'Supabase is not configured. Showing local demo totals.');

  useEffect(() => {
    if (!isSupabaseConfigured || !isAuthenticated) return;

    let isActive = true;
    setStatus('Loading Supabase totals...');

    Promise.all([countContent('projects'), countContent('certificates')])
      .then(([projects, certificates]) => {
        if (!isActive) return;
        setCounts({ projects, certificates });
        setStatus('Connected to Supabase. Totals reflect your database.');
      })
      .catch((error) => {
        console.error(error);
        if (isActive) setStatus('Could not load Supabase totals. Check your connection and RLS policies.');
      });

    return () => {
      isActive = false;
    };
  }, [isAuthenticated]);

  const cards = [
    { title: 'Projects', count: counts.projects, href: '/admin/projects', icon: FolderKanban },
    { title: 'Certificates', count: counts.certificates, href: '/admin/certificates', icon: Award },
  ];

  return (
    <AdminShell>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Dashboard</p>
        <h1 className="mt-2 text-4xl font-black">Content overview</h1>
        <p className="mt-2 text-muted-foreground">{status}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <Icon className="mb-5 text-primary" size={34} />
              <h2 className="text-2xl font-black">{card.title}</h2>
              <p className="mt-3 text-muted-foreground">Total count</p>
              <p className="my-4 text-5xl font-black text-primary">{card.count}</p>
              <Link className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-glow transition hover:bg-primary/90" href={card.href}>
                Manage {card.title}
              </Link>
            </Card>
          );
        })}
      </div>
    </AdminShell>
  );
}
