'use client';
import { useEffect, useMemo, useState } from 'react';
import { createSupabaseClient } from '../../../lib/supabase';

const EMPTY_FORM = {
  slug: '',
  title: '',
  description: '',
  image: '',
  icon: 'fa-code',
  github: '',
  demo: '',
  tags: '',
  featured: false,
  published: false
};

export default function ProjectsPage() {
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState('');

  async function load() {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setRows(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(row) {
    setEditingId(row.id);
    setForm({
      slug: row.slug || '',
      title: row.title || '',
      description: row.description || '',
      image: row.image || '',
      icon: row.icon || 'fa-code',
      github: row.github || '',
      demo: row.demo || '',
      tags: (row.tags || []).join(', '),
      featured: !!row.featured,
      published: !!row.published
    });
  }

  function resetForm() {
    setEditingId('');
    setForm(EMPTY_FORM);
  }

  async function submitForm(e) {
    e.preventDefault();

    const payload = {
      slug: form.slug,
      title: form.title,
      description: form.description,
      image: form.image,
      icon: form.icon,
      github: form.github,
      demo: form.demo,
      tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean),
      featured: form.featured,
      published: form.published
    };

    if (editingId) {
      await supabase.from('projects').update(payload).eq('id', editingId);
    } else {
      await supabase.from('projects').insert(payload);
    }

    resetForm();
    load();
  }

  async function deleteRow(id) {
    await supabase.from('projects').delete().eq('id', id);
    if (editingId === id) {
      resetForm();
    }
    load();
  }

  async function togglePublish(row) {
    await supabase.from('projects').update({ published: !row.published }).eq('id', row.id);
    load();
  }

  return (
    <main style={{ maxWidth: 1100, margin: '30px auto', padding: 20 }}>
      <h1>Manage Projects</h1>

      <form onSubmit={submitForm} style={{ display: 'grid', gap: 8, marginBottom: 20 }}>
        <input placeholder="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
        <input placeholder="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea placeholder="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <input placeholder="project image url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
        <input placeholder="icon (e.g. fa-shopping-cart)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} required />
        <input placeholder="github url (optional)" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
        <input placeholder="demo url (optional)" value={form.demo} onChange={(e) => setForm({ ...form, demo: e.target.value })} />
        <input placeholder="tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        <label>
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
        </label>
        <label>
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">{editingId ? 'Update Project' : 'Add Project'}</button>
          {editingId ? <button type="button" onClick={resetForm}>Cancel Edit</button> : null}
        </div>
      </form>

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Slug</th><th>Title</th><th>Featured</th><th>Published</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.slug}</td>
              <td>{row.title}</td>
              <td>{row.featured ? 'Yes' : 'No'}</td>
              <td>{row.published ? 'Yes' : 'No'}</td>
              <td style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => startEdit(row)}>Edit</button>
                <button type="button" onClick={() => togglePublish(row)}>{row.published ? 'Unpublish' : 'Publish'}</button>
                <button type="button" onClick={() => deleteRow(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
