'use client';
import { useEffect, useMemo, useState } from 'react';
import { createSupabaseClient } from '../../../lib/supabase';

const EMPTY_FORM = {
  slug: '',
  title: '',
  issuer: '',
  issued_at_label: '',
  description: '',
  image: '',
  icon: 'fa-certificate',
  skills: '',
  published: false
};

export default function CertificationsPage() {
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState('');
  const [uploading, setUploading] = useState(false);

  async function load() {
    const { data } = await supabase.from('certifications').select('*').order('created_at', { ascending: false });
    setRows(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const filePath = `certificates/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error } = await supabase.storage.from('certificates').upload(filePath, file, { upsert: false });

    if (!error) {
      const { data } = supabase.storage.from('certificates').getPublicUrl(filePath);
      setForm((prev) => ({ ...prev, image: data.publicUrl }));
    }

    setUploading(false);
  }

  function startEdit(row) {
    setEditingId(row.id);
    setForm({
      slug: row.slug || '',
      title: row.title || '',
      issuer: row.issuer || '',
      issued_at_label: row.issued_at_label || '',
      description: row.description || '',
      image: row.image || '',
      icon: row.icon || 'fa-certificate',
      skills: (row.skills || []).join(', '),
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
      issuer: form.issuer,
      issued_at_label: form.issued_at_label,
      description: form.description,
      image: form.image,
      icon: form.icon,
      skills: form.skills.split(',').map((item) => item.trim()).filter(Boolean),
      published: form.published
    };

    if (editingId) {
      await supabase.from('certifications').update(payload).eq('id', editingId);
    } else {
      await supabase.from('certifications').insert(payload);
    }

    resetForm();
    load();
  }

  async function deleteRow(id) {
    await supabase.from('certifications').delete().eq('id', id);
    if (editingId === id) {
      resetForm();
    }
    load();
  }

  async function togglePublish(row) {
    await supabase.from('certifications').update({ published: !row.published }).eq('id', row.id);
    load();
  }

  return (
    <main style={{ maxWidth: 1100, margin: '30px auto', padding: 20 }}>
      <h1>Manage Certifications</h1>

      <form onSubmit={submitForm} style={{ display: 'grid', gap: 8, marginBottom: 20 }}>
        <input placeholder="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
        <input placeholder="certificate name" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="issuer" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} required />
        <input placeholder="date label (e.g. April 2025)" value={form.issued_at_label} onChange={(e) => setForm({ ...form, issued_at_label: e.target.value })} required />
        <textarea placeholder="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <input placeholder="skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        <input placeholder="icon (e.g. fa-code)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} required />
        <input placeholder="certificate image/file url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
        <label>
          Upload certificate file (optional):
          <input type="file" accept="image/*,.pdf" onChange={onFileChange} />
          {uploading ? <span> Uploading...</span> : null}
        </label>
        <label>
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">{editingId ? 'Update Certification' : 'Add Certification'}</button>
          {editingId ? <button type="button" onClick={resetForm}>Cancel Edit</button> : null}
        </div>
      </form>

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Issuer</th><th>Name</th><th>Date</th><th>Published</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.issuer}</td>
              <td>{row.title}</td>
              <td>{row.issued_at_label}</td>
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
