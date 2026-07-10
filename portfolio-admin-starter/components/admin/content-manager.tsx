'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Edit3, Plus, Search, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminShell } from './admin-shell';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import type { CertificateAsset } from '../../lib/certificate-assets';
import type { Certificate, Project } from '../../lib/types';
import { useAuth } from './auth-provider';

type Mode = 'projects' | 'certificates';
type Item = Project | Certificate;
type Toast = { type: 'success' | 'error'; message: string } | null;
type FormErrors = Record<string, string>;

const emptyProject: Project = {
  id: '',
  slug: '',
  title: '',
  description: '',
  image: '',
  tags: [],
  github: '',
  demo: '',
  icon: 'fa-code',
  published: true,
  sortOrder: 0,
};

const emptyCertificate: Certificate = {
  id: '',
  slug: '',
  title: '',
  issuer: '',
  issuedAt: '',
  issuedAtLabel: '',
  description: '',
  skills: [],
  certificateFile: '',
  icon: 'fa-certificate',
  published: true,
  sortOrder: 0,
};

export function ContentManager({ mode, initialItems, certificateAssets = [] }: { mode: Mode; initialItems: Item[]; certificateAssets?: CertificateAsset[] }) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Item | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<Toast>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(isSupabaseConfigured);
  const [isSaving, setIsSaving] = useState(false);

  const isProjects = mode === 'projects';
  const title = isProjects ? 'Projects' : 'Certificates';

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return items;
    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(normalizedQuery));
  }, [items, query]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!isSupabaseConfigured || !isAuthenticated) {
      setIsLoadingContent(false);
      return;
    }

    let isActive = true;
    setIsLoadingContent(true);

    listContent(mode)
      .then((loadedItems) => {
        if (isActive) setItems(loadedItems);
      })
      .catch((error) => {
        console.error(error);
        if (isActive) setToast({ type: 'error', message: `Could not load ${title.toLowerCase()} from Supabase.` });
      })
      .finally(() => {
        if (isActive) setIsLoadingContent(false);
      });

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, mode, title]);

  function addNew() {
    const nextSortOrder = items.length + 1;
    setErrors({});
    setEditing({ ...(isProjects ? emptyProject : emptyCertificate), id: crypto.randomUUID(), sortOrder: nextSortOrder });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setIsSaving(true);
    try {
      if (isSupabaseConfigured) await deleteContent(mode, deleteTarget.id);
      setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
      setToast({ type: 'success', message: `${getItemTitle(deleteTarget)} deleted.` });
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      setToast({ type: 'error', message: `Could not delete ${getItemTitle(deleteTarget)}.` });
    } finally {
      setIsSaving(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    const form = new FormData(event.currentTarget);
    const next = isProjects ? buildProject(editing as Project, form) : buildCertificate(editing as Certificate, form);
    const validation = validateItem(next, isProjects, items);

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      setToast({ type: 'error', message: 'Please fix the highlighted fields.' });
      return;
    }

    const exists = items.some((item) => item.id === next.id);
    setIsSaving(true);
    try {
      const saved = await persistItem(mode, next, exists);
      setItems((current) => (exists ? current.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...current]));
      setEditing(null);
      setErrors({});
      const target = isSupabaseConfigured ? 'in Supabase' : 'locally';
      setToast({ type: 'success', message: `${getItemTitle(saved)} ${exists ? 'updated' : 'created'} ${target}.` });
    } catch (error) {
      console.error(error);
      setToast({ type: 'error', message: `Could not save ${getItemTitle(next)}.` });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminShell>
      <ContentHeader title={title} isProjects={isProjects} onAdd={addNew} isConnected={isSupabaseConfigured} />
      {toast && <ToastMessage toast={toast} />}
      {isLoadingContent && <Card className="mb-5 text-sm text-muted-foreground">Loading {title.toLowerCase()} from Supabase...</Card>}
      <Card className="mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
          <Input className="pl-10" placeholder={`Search ${title.toLowerCase()}...`} value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
      </Card>
      <ContentTable items={filtered} title={title} onEdit={(item) => { setErrors({}); setEditing(item); }} onDelete={setDeleteTarget} />
      {editing && (
        <EditorDialog
          item={editing}
          isProjects={isProjects}
          certificateAssets={certificateAssets}
          errors={errors}
          onClose={() => { setEditing(null); setErrors({}); }}
          onSubmit={submit}
          isSaving={isSaving}
        />
      )}
      {deleteTarget && <DeleteDialog item={deleteTarget} isSaving={isSaving} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
    </AdminShell>
  );
}

function ContentHeader({ title, isProjects, isConnected, onAdd }: { title: string; isProjects: boolean; isConnected: boolean; onAdd: () => void }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Manage</p>
        <h1 className="mt-2 text-4xl font-black">{title}</h1>
        <p className="mt-2 text-muted-foreground">
          {isConnected ? 'Connected to Supabase. Changes are saved to your database.' : 'Supabase is not configured. Using local demo data only.'}
        </p>
      </div>
      <Button onClick={onAdd}><Plus className="mr-2" size={18} /> Add {isProjects ? 'Project' : 'Certificate'}</Button>
    </div>
  );
}

function ToastMessage({ toast }: { toast: NonNullable<Toast> }) {
  const Icon = toast.type === 'success' ? CheckCircle2 : AlertTriangle;
  return (
    <div className={`mb-5 flex items-center gap-3 rounded-2xl border p-4 text-sm font-semibold ${toast.type === 'success' ? 'border-primary/30 bg-primary/10 text-primary' : 'border-destructive/30 bg-destructive/10 text-destructive'}`}>
      <Icon size={18} /> {toast.message}
    </div>
  );
}

function ContentTable({ items, title, onEdit, onDelete }: { items: Item[]; title: string; onEdit: (item: Item) => void; onDelete: (item: Item) => void }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-border bg-secondary/40 text-muted-foreground">
            <tr>
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">Description</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Sort</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border/70 last:border-b-0">
                <td className="px-5 py-4 font-semibold">
                  {getItemTitle(item)}
                  <p className="mt-1 text-xs text-muted-foreground">/{item.slug}</p>
                </td>
                <td className="max-w-md px-5 py-4 text-muted-foreground">
                  {item.description}
                  <p className="mt-2 text-xs">{'tags' in item ? item.tags.join(', ') : item.skills.join(', ')}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{item.published ? 'Published' : 'Draft'}</span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{item.sortOrder}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onEdit(item)} aria-label={`Edit ${getItemTitle(item)}`}><Edit3 size={16} /></Button>
                    <Button variant="destructive" onClick={() => onDelete(item)} aria-label={`Delete ${getItemTitle(item)}`}><Trash2 size={16} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && <div className="p-8 text-center text-muted-foreground">No {title.toLowerCase()} found. Try another search or add new content.</div>}
    </Card>
  );
}

function EditorDialog({ item, isProjects, certificateAssets, errors, onClose, onSubmit }: { item: Item; isProjects: boolean; certificateAssets: CertificateAsset[]; errors: FormErrors; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="content-editor-title">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="content-editor-title" className="text-2xl font-black">Edit {isProjects ? 'Project' : 'Certificate'}</h2>
            <p className="text-sm text-muted-foreground">Keep portfolio content clean, complete, and synced with Supabase.</p>
          </div>
          <Button type="button" variant="ghost" onClick={onClose} aria-label="Close editor"><X size={18} /></Button>
        </div>
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          {isProjects ? <ProjectFields item={item as Project} errors={errors} /> : <CertificateFields item={item as Certificate} certificateAssets={certificateAssets} errors={errors} />}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function DeleteDialog({ item, isSaving, onCancel, onConfirm }: { item: Item; isSaving: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-title">
      <Card className="w-full max-w-md">
        <h2 id="delete-title" className="text-2xl font-black">Delete {getItemTitle(item)}?</h2>
        <p className="mt-3 text-sm text-muted-foreground">This permanently removes the item from Supabase when the admin app is connected.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={isSaving}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isSaving}>{isSaving ? 'Deleting...' : 'Delete'}</Button>
        </div>
      </Card>
    </div>
  );
}

function ProjectFields({ item, errors }: { item: Project; errors: FormErrors }) {
  return (
    <>
      <Field name="title" label="Title" defaultValue={item.title} error={errors.title} />
      <Field name="slug" label="Slug" defaultValue={item.slug} error={errors.slug} />
      <Area name="description" label="Description" defaultValue={item.description} error={errors.description} />
      <Field name="image" label="Cover Image URL" defaultValue={item.image} error={errors.image} />
      <Field name="tags" label="Tags" defaultValue={item.tags.join(', ')} error={errors.tags} />
      <Field name="github" label="GitHub URL" defaultValue={item.github} error={errors.github} required={false} />
      <Field name="demo" label="Demo URL" defaultValue={item.demo} error={errors.demo} required={false} />
      <Field name="icon" label="Icon" defaultValue={item.icon} error={errors.icon} />
      <Field name="sortOrder" label="Sort Order" type="number" defaultValue={item.sortOrder} error={errors.sortOrder} />
      <Check name="published" label="Published" defaultChecked={item.published} />
    </>
  );
}

function CertificateFields({ item, certificateAssets, errors }: { item: Certificate; certificateAssets: CertificateAsset[]; errors: FormErrors }) {
  return (
    <>
      <Field name="title" label="Title" defaultValue={item.title} error={errors.title} />
      <Field name="slug" label="Slug" defaultValue={item.slug} error={errors.slug} />
      <Field name="issuer" label="Issuer" defaultValue={item.issuer} error={errors.issuer} />
      <Field name="issuedAt" label="Issue Date" type="date" defaultValue={item.issuedAt} error={errors.issuedAt} />
      <Field name="issuedAtLabel" label="Issue Label" defaultValue={item.issuedAtLabel} error={errors.issuedAtLabel} />
      <Area name="description" label="Description" defaultValue={item.description} error={errors.description} />
      <Field name="skills" label="Skills" defaultValue={item.skills.join(', ')} error={errors.skills} />
      <CertificateAssetSelect assets={certificateAssets} defaultValue={item.certificateFile} error={errors.certificateFile} />
      <Field name="icon" label="Icon" defaultValue={item.icon} error={errors.icon} />
      <Field name="sortOrder" label="Sort Order" type="number" defaultValue={item.sortOrder} error={errors.sortOrder} />
      <Check name="published" label="Published" defaultChecked={item.published} />
    </>
  );
}

function CertificateAssetSelect({ assets, defaultValue, error }: { assets: CertificateAsset[]; defaultValue: string; error?: string }) {
  return (
    <label className="block text-sm font-semibold">
      Certificate file
      <select
        name="certificateFile"
        className="mt-2 h-11 w-full rounded-xl border border-input bg-secondary/60 px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        aria-invalid={Boolean(error)}
        defaultValue={defaultValue}
        required
      >
        <option value="">Select an existing certificate file</option>
        {assets.map((asset) => (
          <option key={asset.assetKey} value={asset.assetKey}>{asset.filename}</option>
        ))}
      </select>
      {assets.length === 0 && (
        <span className="mt-1 block text-xs text-muted-foreground">
          Add files manually to portfolio-admin-starter/public/certificates to make them selectable.
        </span>
      )}
      {defaultValue && !assets.some((asset) => asset.assetKey === defaultValue) && (
        <span className="mt-1 block text-xs text-muted-foreground">
          The saved file is not currently present in the local certificates folder.
        </span>
      )}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function Field({ label, error, required = true, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return <label className="block text-sm font-semibold">{label}<Input className="mt-2" aria-invalid={Boolean(error)} required={required} {...props} />{error && <span className="mt-1 block text-xs text-destructive">{error}</span>}</label>;
}

function Area({ label, error, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  return <label className="block text-sm font-semibold">{label}<Textarea className="mt-2" aria-invalid={Boolean(error)} required {...props} />{error && <span className="mt-1 block text-xs text-destructive">{error}</span>}</label>;
}

function Check({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 p-3 text-sm font-semibold">{label}<input type="checkbox" className="h-5 w-5 accent-cyanide" {...props} /></label>;
}

function buildProject(editing: Project, form: FormData): Project {
  return {
    id: editing.id,
    slug: text(form, 'slug'),
    title: text(form, 'title'),
    description: text(form, 'description'),
    image: text(form, 'image'),
    tags: list(form, 'tags'),
    github: text(form, 'github'),
    demo: text(form, 'demo'),
    icon: text(form, 'icon') || 'fa-code',
    published: form.get('published') === 'on',
    sortOrder: number(form, 'sortOrder'),
  };
}

function buildCertificate(editing: Certificate, form: FormData): Certificate {
  return {
    id: editing.id,
    slug: text(form, 'slug'),
    title: text(form, 'title'),
    issuer: text(form, 'issuer'),
    issuedAt: text(form, 'issuedAt'),
    issuedAtLabel: text(form, 'issuedAtLabel'),
    description: text(form, 'description'),
    skills: list(form, 'skills'),
    certificateFile: text(form, 'certificateFile'),
    icon: text(form, 'icon') || 'fa-certificate',
    published: form.get('published') === 'on',
    sortOrder: number(form, 'sortOrder'),
  };
}

function validateItem(item: Item, isProjects: boolean, existing: Item[]) {
  const errors: FormErrors = {};
  if (!item.title.trim()) errors.title = 'Title is required.';
  if (!item.slug.trim()) errors.slug = 'Slug is required.';
  if (item.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) errors.slug = 'Use lowercase letters, numbers, and hyphens.';
  if (existing.some((current) => current.id !== item.id && current.slug === item.slug)) errors.slug = 'This slug is already used.';
  if (!item.description.trim()) errors.description = 'Description is required.';
  if (isProjects && 'image' in item && !item.image.trim()) errors.image = 'Cover image URL is required.';
  if (item.sortOrder < 0) errors.sortOrder = 'Sort order cannot be negative.';
  if (isProjects && 'tags' in item && item.tags.length === 0) errors.tags = 'Add at least one tag.';
  if (!isProjects && 'skills' in item && item.skills.length === 0) errors.skills = 'Add at least one skill.';
  if (!isProjects && 'issuer' in item && !item.issuer.trim()) errors.issuer = 'Issuer is required.';
  if (!isProjects && 'issuedAt' in item && !item.issuedAt) errors.issuedAt = 'Issue date is required.';
  if (!isProjects && 'issuedAtLabel' in item && !item.issuedAtLabel.trim()) errors.issuedAtLabel = 'Issue label is required.';
  if (!isProjects && 'certificateFile' in item && !item.certificateFile.trim()) errors.certificateFile = 'Choose an existing certificate file.';
  if ('github' in item && item.github && !isValidUrl(item.github)) errors.github = 'Enter a valid URL.';
  if ('demo' in item && item.demo && !isValidUrl(item.demo)) errors.demo = 'Enter a valid URL.';
  if ('image' in item && item.image && !isValidUrl(item.image)) errors.image = 'Enter a valid URL.';
  return errors;
}

async function persistItem(mode: Mode, item: Item, exists: boolean) {
  if (!isSupabaseConfigured) return item;
  return mode === 'projects'
    ? saveContent('projects', item as Project, exists)
    : saveContent('certificates', item as Certificate, exists);
}

function getItemTitle(item: Item) {
  return item.title;
}

function text(form: FormData, key: string) {
  return String(form.get(key) ?? '').trim();
}

function list(form: FormData, key: string) {
  return text(form, key).split(',').map((item) => item.trim()).filter(Boolean);
}

function number(form: FormData, key: string) {
  return Number(form.get(key) || 0);
}

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}
