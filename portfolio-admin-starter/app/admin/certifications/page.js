'use client';
import { useEffect, useState } from 'react';
import { createSupabaseClient } from '../../../lib/supabase';
import AdminTable from '../../../components/AdminTable';

export default function CertificationsPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ slug: '', title: '', issuer: '', image: '' });

  const supabase = createSupabaseClient();

  async function load() {
    const { data } = await supabase.from('certifications').select('*').order('created_at', { ascending: false });
    setRows(data || []);
  }

  useEffect(() => { load(); }, []);

  async function createRow(e) {
    e.preventDefault();
    await supabase.from('certifications').insert({ ...form, description: '', skills: [], issued_at_label: '', published: false });
    setForm({ slug: '', title: '', issuer: '', image: '' });
    load();
  }

  async function deleteRow(id) {
    await supabase.from('certifications').delete().eq('id', id);
    load();
  }

  return (
    <main style={{ maxWidth: 1000, margin: '30px auto', padding: 20 }}>
      <h1>Manage Certifications</h1>
      <form onSubmit={createRow} style={{ display: 'grid', gap: 8, marginBottom: 20 }}>
        <input placeholder="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
        <input placeholder="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="issuer" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} required />
        <input placeholder="image url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
        <button type="submit">Add Certification</button>
      </form>
      <AdminTable title="Certifications" rows={rows} columns={['slug', 'title', 'issuer', 'published']} onDelete={deleteRow} />
    </main>
  );
}
