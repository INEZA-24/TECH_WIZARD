'use client';

import { useState } from 'react';
import { createSupabaseClient } from '../../../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setMessage('Signing in...');

    try {
      const supabase = createSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setMessage(error ? error.message : 'Login successful. Go to projects/certifications pages.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: '60px auto', padding: 20 }}>
      <h1>Admin Login</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required />
        <button type="submit">Sign In</button>
      </form>
      <p>{message}</p>
    </main>
  );
}
