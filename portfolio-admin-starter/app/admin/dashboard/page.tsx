import Link from 'next/link';
import { Award, FolderKanban } from 'lucide-react';
import { AdminShell } from '../../../components/admin/admin-shell';
import { Card } from '../../../components/ui/card';
import { initialCertificates, initialProjects } from '../../../lib/mock-data';

export default function DashboardPage() {
  const cards = [
    { title: 'Projects', count: initialProjects.length, href: '/admin/projects', icon: FolderKanban },
    { title: 'Certificates', count: initialCertificates.length, href: '/admin/certificates', icon: Award },
  ];

  return (
    <AdminShell>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Dashboard</p>
        <h1 className="mt-2 text-4xl font-black">Content overview</h1>
        <p className="mt-2 text-muted-foreground">Manage the two portfolio content areas that matter right now.</p>
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
