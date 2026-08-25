import { supabase } from './supabase-client';
import type { Certificate, Project } from './types';

type ContentMode = 'projects' | 'certificates';
type ContentItem = Project | Certificate;

type ProjectRow = {
  id: string; slug: string; title: string; description: string; image: string | null;
  tags: string[] | null; github: string | null; demo: string | null; icon: string | null;
  featured: boolean | null; published: boolean | null; sort_order: number | null;
};
type CertificateRow = { id:string; slug:string; title:string; issuer:string; issued_at:string|null; issued_at_label:string|null; description:string; skills:string[]|null; certificate_file:string; icon:string|null; published:boolean|null; sort_order:number|null; };

export async function listContent(mode:'projects'):Promise<Project[]>;
export async function listContent(mode:'certificates'):Promise<Certificate[]>;
export async function listContent(mode:ContentMode):Promise<ContentItem[]>;
export async function listContent(mode:ContentMode):Promise<ContentItem[]> { const {data,error}=await supabase.from(tableForMode(mode)).select('*').order('sort_order',{ascending:true}).order('created_at',{ascending:false}); if(error)throw error; return mode==='projects'?(data as ProjectRow[]).map(projectFromRow):(data as CertificateRow[]).map(certificateFromRow); }

export async function saveContent(mode:'projects',item:Project,exists:boolean):Promise<Project>;
export async function saveContent(mode:'certificates',item:Certificate,exists:boolean):Promise<Certificate>;
export async function saveContent(mode:ContentMode,item:ContentItem,exists:boolean):Promise<ContentItem>{ if(mode==='projects'){const payload=projectToRow(item as Project);const query=exists?supabase.from('projects').update(payload).eq('id',item.id):supabase.from('projects').insert(payload);const {data,error}=await query.select('*').single();if(error)throw error;return projectFromRow(data as ProjectRow)}const payload=certificateToRow(item as Certificate);const query=exists?supabase.from('certifications').update(payload).eq('id',item.id):supabase.from('certifications').insert(payload);const {data,error}=await query.select('*').single();if(error)throw error;return certificateFromRow(data as CertificateRow);}
export async function deleteContent(mode:ContentMode,id:string){const{error}=await supabase.from(tableForMode(mode)).delete().eq('id',id);if(error)throw error;}
export async function countContent(mode:ContentMode){const{count,error}=await supabase.from(tableForMode(mode)).select('id',{count:'exact',head:true});if(error)throw error;return count??0;}
function tableForMode(mode:ContentMode){return mode==='projects'?'projects':'certifications';}
function projectFromRow(row:ProjectRow):Project{return{id:row.id,slug:row.slug,title:row.title,description:row.description,image:row.image??'',tags:row.tags??[],github:row.github??'',demo:row.demo??'',icon:row.icon??'fa-code',featured:row.featured??false,published:row.published??false,sortOrder:row.sort_order??0};}
function projectToRow(project:Project){return{id:project.id,slug:project.slug,title:project.title,description:project.description,image:project.image,tags:project.tags,github:project.github,demo:project.demo,icon:project.icon,featured:project.featured,published:project.published,sort_order:project.sortOrder};}
function certificateFromRow(row:CertificateRow):Certificate{return{id:row.id,slug:row.slug,title:row.title,issuer:row.issuer,issuedAt:row.issued_at??'',issuedAtLabel:row.issued_at_label??'',description:row.description,skills:row.skills??[],certificateFile:row.certificate_file,icon:row.icon??'fa-certificate',published:row.published??false,sortOrder:row.sort_order??0};}
function certificateToRow(certificate:Certificate){return{id:certificate.id,slug:certificate.slug,title:certificate.title,issuer:certificate.issuer,issued_at:certificate.issuedAt||null,issued_at_label:certificate.issuedAtLabel,description:certificate.description,skills:certificate.skills,certificate_file:certificate.certificateFile,icon:certificate.icon,published:certificate.published,sort_order:certificate.sortOrder};}
