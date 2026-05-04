'use client';
import { useEffect, useState } from 'react';
import { createSupabaseClient } from '../../../lib/supabase';
import AdminTable from '../../../components/AdminTable';

export default function ProjectsPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ slug: '', title: '', description: '' });

  const supabase = createSupabaseClient();

  async function load() {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setRows(data || []);
  }

  useEffect(() => { load(); }, []);

  async function createRow(e) {
    e.preventDefault();
    await supabase.from('projects').insert({ ...form, tags: [], published: false });
    setForm({ slug: '', title: '', description: '' });
    load();
  }

  async function deleteRow(id) {
    await supabase.from('projects').delete().eq('id', id);
    load();
  }

  return (
    <main style={{ maxWidth: 1000, margin: '30px auto', padding: 20 }}>
      <h1>Manage Projects</h1>
      <form onSubmit={createRow} style={{ display: 'grid', gap: 8, marginBottom: 20 }}>
        <input placeholder="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
        <input placeholder="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea placeholder="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <button type="submit">Add Project</button>
      </form>
      <AdminTable title="Projects" rows={rows} columns={['slug', 'title', 'published']} onDelete={deleteRow} />
    </main>
  );
}
