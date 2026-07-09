import Link from 'next/link';

export default function Home() {
  return (
    <main className="cyan-grid flex min-h-screen items-center justify-center p-6">
      <div className="max-w-2xl rounded-3xl border border-border bg-card/80 p-8 text-center shadow-2xl backdrop-blur">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Tech Wizard</p>
        <h1 className="mt-3 text-4xl font-black">Portfolio Admin</h1>
        <p className="mt-3 text-muted-foreground">Private admin app for managing projects and certificates.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow" href="/admin/login">Login</Link>
          <Link className="rounded-xl border border-primary/40 px-5 py-3 text-sm font-bold text-primary" href="/admin/projects">Projects</Link>
          <Link className="rounded-xl border border-primary/40 px-5 py-3 text-sm font-bold text-primary" href="/admin/certificates">Certificates</Link>
        </div>
      </div>
    </main>
  );
}
