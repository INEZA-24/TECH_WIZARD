'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminShell } from './admin-shell';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import type { Certificate, Project } from '../../lib/types';

type Mode = 'projects' | 'certificates';
type Item = Project | Certificate;

const emptyProject: Project = { id: '', name: '', description: '', coverImage: '', githubUrl: '', liveDemoUrl: '', techStack: [], featured: false, published: true };
const emptyCertificate: Certificate = { id: '', title: '', issuer: '', description: '', issueDate: '', thumbnailImage: '', certificateFile: '', verificationUrl: '' };

export function ContentManager({ mode, initialItems }: { mode: Mode; initialItems: Item[] }) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Item | null>(null);
  const [open, setOpen] = useState(false);
  const isProjects = mode === 'projects';
  const title = isProjects ? 'Projects' : 'Certificates';

  const filtered = useMemo(() => items.filter((item) => JSON.stringify(item).toLowerCase().includes(query.toLowerCase())), [items, query]);

  function addNew() {
    setEditing({ ...(isProjects ? emptyProject : emptyCertificate), id: crypto.randomUUID() });
    setOpen(true);
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const next: Item = isProjects ? {
      id: editing.id,
      name: String(form.get('name')),
      description: String(form.get('description')),
      coverImage: String(form.get('coverImage')),
      githubUrl: String(form.get('githubUrl')),
      liveDemoUrl: String(form.get('liveDemoUrl')),
      techStack: String(form.get('techStack')).split(',').map((item) => item.trim()).filter(Boolean),
      featured: form.get('featured') === 'on',
      published: form.get('published') === 'on',
    } : {
      id: editing.id,
      title: String(form.get('title')),
      issuer: String(form.get('issuer')),
      description: String(form.get('description')),
      issueDate: String(form.get('issueDate')),
      thumbnailImage: String(form.get('thumbnailImage')),
      certificateFile: String(form.get('certificateFile')),
      verificationUrl: String(form.get('verificationUrl')),
    };
    setItems((current) => current.some((item) => item.id === next.id) ? current.map((item) => item.id === next.id ? next : item) : [next, ...current]);
    setOpen(false);
    setEditing(null);
  }

  return <AdminShell><div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Manage</p><h1 className="mt-2 text-4xl font-black">{title}</h1><p className="mt-2 text-muted-foreground">Mock data today, Supabase-ready structure tomorrow.</p></div><Button onClick={addNew}><Plus className="mr-2" size={18} /> Add {isProjects ? 'Project' : 'Certificate'}</Button></div><Card className="mb-5"><div className="relative"><Search className="absolute left-3 top-3 text-muted-foreground" size={18} /><Input className="pl-10" placeholder={`Search ${title.toLowerCase()}...`} value={query} onChange={(e) => setQuery(e.target.value)} /></div></Card><Card className="overflow-hidden p-0"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border bg-secondary/40 text-muted-foreground"><tr><th className="px-5 py-4">Name</th><th className="px-5 py-4">Description</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id} className="border-b border-border/70"><td className="px-5 py-4 font-semibold">{'name' in item ? item.name : item.title}<p className="mt-1 text-xs text-muted-foreground">{'issuer' in item ? item.issuer : item.techStack.join(', ')}</p></td><td className="max-w-md px-5 py-4 text-muted-foreground">{item.description}</td><td className="px-5 py-4">{'published' in item ? <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{item.published ? 'Published' : 'Draft'}</span> : <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">Uploaded</span>}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => { setEditing(item); setOpen(true); }}><Edit3 size={16} /></Button><Button variant="destructive" onClick={() => removeItem(item.id)}><Trash2 size={16} /></Button></div></td></tr>)}</tbody></table></div>{filtered.length === 0 && <div className="p-8 text-center text-muted-foreground">No {title.toLowerCase()} found.</div>}</Card>{open && editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl"><div className="mb-5"><h2 className="text-2xl font-black">{editing.id && items.some((item) => item.id === editing.id) ? 'Edit' : 'Add'} {isProjects ? 'Project' : 'Certificate'}</h2><p className="text-sm text-muted-foreground">Keep it clean and complete.</p></div><form className="space-y-4" onSubmit={submit}>{isProjects ? <ProjectFields item={editing as Project} /> : <CertificateFields item={editing as Certificate} />}<div className="flex justify-end gap-3 pt-2"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Save</Button></div></form></motion.div></div>}</AdminShell>;
}

function ProjectFields({ item }: { item: Project }) {
  return <><Field name="name" label="Project Name" defaultValue={item.name} /><Area name="description" label="Description" defaultValue={item.description} /><Field name="coverImage" label="Cover Image" defaultValue={item.coverImage} /><Field name="githubUrl" label="GitHub URL" defaultValue={item.githubUrl} /><Field name="liveDemoUrl" label="Live Demo URL" defaultValue={item.liveDemoUrl} /><Field name="techStack" label="Tech Stack" defaultValue={item.techStack.join(', ')} /><div className="grid gap-3 md:grid-cols-2"><Check name="featured" label="Featured" defaultChecked={item.featured} /><Check name="published" label="Published" defaultChecked={item.published} /></div></>;
}
function CertificateFields({ item }: { item: Certificate }) { return <><Field name="title" label="Title" defaultValue={item.title} /><Field name="issuer" label="Issuer" defaultValue={item.issuer} /><Area name="description" label="Description" defaultValue={item.description} /><Field name="issueDate" label="Issue Date" type="date" defaultValue={item.issueDate} /><Field name="thumbnailImage" label="Thumbnail Image" defaultValue={item.thumbnailImage} /><Field name="certificateFile" label="Certificate File (PDF or Image)" defaultValue={item.certificateFile} /><Field name="verificationUrl" label="Optional Verification URL" defaultValue={item.verificationUrl} required={false} /></>; }
function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) { return <label className="block text-sm font-semibold">{label}<Input className="mt-2" required {...props} /></label>; }
function Area({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) { return <label className="block text-sm font-semibold">{label}<Textarea className="mt-2" required {...props} /></label>; }
function Check({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) { return <label className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 p-3 text-sm font-semibold">{label}<input type="checkbox" className="h-5 w-5 accent-cyanide" {...props} /></label>; }
