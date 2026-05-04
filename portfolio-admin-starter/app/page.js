import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ maxWidth: 900, margin: '50px auto', padding: 20 }}>
      <h1>Portfolio Admin</h1>
      <p>Private admin app for managing projects and certifications.</p>
      <ul>
        <li><Link href="/admin/login">Login</Link></li>
        <li><Link href="/admin/projects">Manage Projects</Link></li>
        <li><Link href="/admin/certifications">Manage Certifications</Link></li>
      </ul>
    </main>
  );
}
