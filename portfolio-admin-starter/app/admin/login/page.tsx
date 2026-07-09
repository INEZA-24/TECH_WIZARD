'use client';

import { FormEvent, useState } from 'react';
import { LockKeyhole, WandSparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { useAuth } from '../../../components/admin/auth-provider';
import { isSupabaseConfigured } from '../../../lib/supabase-client';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch {
      setError('Could not sign in. Check your admin credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="cyan-grid flex min-h-screen items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow"><WandSparkles /></div>
            <h1 className="text-3xl font-black">Admin Login</h1>
            <p className="mt-2 text-sm text-muted-foreground">Private Tech Wizard content manager.</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block text-sm font-semibold">Email<Input className="mt-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required /></label>
            <label className="block text-sm font-semibold">Password<Input className="mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your Supabase password" required /></label>
            {!isSupabaseConfigured && <p className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-xs text-muted-foreground">Supabase is not connected yet. Submitting this form uses a local mock session for UI testing only.</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full" disabled={loading}><LockKeyhole className="mr-2" size={18} />{loading ? 'Signing in...' : 'Sign in'}</Button>
          </form>
        </Card>
      </motion.div>
    </main>
  );
}
