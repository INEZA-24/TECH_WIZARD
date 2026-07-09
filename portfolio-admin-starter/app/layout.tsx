import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tech Wizard Admin',
  description: 'Private admin panel for Tech Wizard portfolio content.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
