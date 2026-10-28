import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const csv=s=>String(s||'').split(',').map(s=>s.trim()).filter(Boolean);
export function local(base,file) {
  const result=path.resolve(base,file);
  if(!result.startsWith(root+path.sep)) throw Error(`Path outside website: ${file}`);
  return result;
}
export function read(file) {
  let raw=fs.readFileSync(file,'utf8').replace(/^\uFEFF/,'').replace(/\r\n/g,'\n');
  const meta={};
  if(raw.startsWith('---\n')) {
    const end=raw.indexOf('\n---',4);
    if(end<0) throw Error(`Missing closing --- in ${file}`);
    for(const line of raw.slice(4,end).split('\n')) {
      if(!line.trim() || line.startsWith('#')) continue;
      const m=line.match(/^([a-z_]+):\s*(.*)$/);
      if(!m) throw Error(`Use key: value on one line in ${file}: ${line}`);
      if(m[1] in meta) throw Error(`Duplicate field ${m[1]} in ${file}`);
      meta[m[1]]=m[2].trim();
    }
    raw=raw.slice(end+4).trim();
  }
  return {meta,body:raw.trim(),file};
}
export function documents(dir) {
  if(!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir,{withFileTypes:true}).filter(e=>e.isFile()&&e.name.endsWith('.md')).sort((a,b)=>a.name.localeCompare(b.name)).map(e=>read(path.join(dir,e.name)));
}
export function blocks(body) {
  const result={}; let key='intro', lines=[];
  const save=()=>{result[key]=lines.join('\n').trim();lines=[];};
  for(const line of body.split('\n')) {
    if(line.startsWith('## ')){save();key=line.slice(3).toLowerCase();} else lines.push(line);
  }
  save();return result;
}
export function safeURL(url) {
  if(!url || /[<>"\s]/.test(url)) throw Error(`Invalid link: ${url}`);
  if(/^(https?:|mailto:|tel:)/i.test(url)) return url;
  if(/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//') || url.includes('..')) throw Error(`Unsupported link: ${url}`);
  return url;
}
export function markdown(body) {
  const inline=s=>esc(s).replace(/\[([^\]]+)\]\(([^\s)]+)\)/g,(_,label,url)=>`<a href="${esc(safeURL(url.replaceAll('&amp;','&')))}">${label}</a>`).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>');
  return body.split(/\n\s*\n/).filter(Boolean).map(part=>{
    if(/^#{1,4} /.test(part)){const m=part.match(/^(#{1,4}) (.*)$/s);return `<h${Math.max(2,m[1].length)}>${inline(m[2])}</h${Math.max(2,m[1].length)}>`;}
    if(part.split('\n').every(l=>l.startsWith('- '))) return `<ul>${part.split('\n').map(l=>`<li>${inline(l.slice(2))}</li>`).join('')}</ul>`;
    return `<p>${inline(part).replaceAll('\n',' ')}</p>`;
  }).join('\n');
}
export function load() {
  const main=read(path.join(root,'MAIN.md')),about=read(path.join(root,'ABOUT.md')),design=read(path.join(root,'DESIGN.md'));
  const links=Object.fromEntries(documents(path.join(root,'links')).map(d=>[path.basename(d.file,'.md'),d]));
  for(const l of Object.values(links))safeURL(l.meta.url);
  const projects=fs.readdirSync(path.join(root,'projects'),{withFileTypes:true}).filter(e=>e.isDirectory()&&fs.existsSync(path.join(root,'projects',e.name,'PROJECT.md'))).map(e=>{
    const dir=path.join(root,'projects',e.name),doc=read(path.join(dir,'PROJECT.md'));
    const videoGroups=documents(path.join(dir,'videos')).map(v=>({...v,clips:documents(path.join(dir,'videos',path.basename(v.file,'.md')))}));
    return {...doc,dir,folder:e.name,sections:documents(path.join(dir,'sections')).filter(s=>s.meta.collapsed!=='true'),videos:videoGroups,links:documents(path.join(dir,'links'))};
  }).sort((a,b)=>Number(a.meta.order)-Number(b.meta.order));
  const ids=new Set();
  for(const p of projects) {
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.meta.id)) throw Error(`Invalid project id in ${p.file}`);
    if(ids.has(p.meta.id))throw Error(`Duplicate project id: ${p.meta.id}`);ids.add(p.meta.id);
    if(!p.meta.title||!p.meta.summary||!p.meta.cover||!p.meta.collection)throw Error(`Missing title, summary, cover or collection in ${p.file}`);
    for(const v of p.videos){safeURL(v.meta.source_url);if(v.meta.folder_url)safeURL(v.meta.folder_url);if(v.meta.youtube_url)youtube(v.meta.youtube_url);for(const clip of v.clips){if(clip.meta.youtube_url)youtube(clip.meta.youtube_url);}}
    for(const l of p.links)safeURL(l.meta.url);
  }
  const featured=csv(main.meta.featured_projects).map(id=>{const p=projects.find(p=>p.meta.id===id);if(!p)throw Error(`Featured project not found: ${id}`);return p;});
  const collectionFolders=csv(main.meta.secondary_collections);
  const collections=Object.fromEntries(collectionFolders.map(key=>[key,{...read(local(root,`collections/${key}/COLLECTION.md`)),dir:local(root,`collections/${key}`)}]));
  for(const p of projects)if(p.meta.collection!=='selected'&&!(p.meta.collection in collections))throw Error(`Unknown collection ${p.meta.collection} in ${p.file}`);
  return {main,about,design,links,projects,featured,collections,home:blocks(main.body),education:read(path.join(root,'profile/EDUCATION.md')),skills:blocks(read(path.join(root,'profile/SKILLS.md')).body),interests:read(path.join(root,'profile/INTERESTS.md')).body.split('\n').filter(l=>l.startsWith('- ')).map(l=>l.slice(2)),experience:documents(path.join(root,'profile/experience')),publication:read(path.join(root,'profile/PUBLICATION.md'))};
}
export function youtube(url) {
  const u=new URL(url);
  if(!['https:','http:'].includes(u.protocol))throw Error('Use a YouTube web link');
  const host=u.hostname.replace(/^www\./,'');
  const id=host==='youtu.be'?u.pathname.slice(1):['youtube.com','m.youtube.com','youtube-nocookie.com'].includes(host)?u.searchParams.get('v')||u.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1]:null;
  if(!/^[a-zA-Z0-9_-]{11}$/.test(id||'')) throw Error(`Unrecognized YouTube video URL: ${url}`);
  return `https://www.youtube-nocookie.com/embed/${id}`;
}
