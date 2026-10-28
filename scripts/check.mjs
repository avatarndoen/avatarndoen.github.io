import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {root,load,csv,local,youtube} from './content.mjs';
const data=load(),dist=path.join(root,'dist');
const pages=JSON.parse(fs.readFileSync(path.join(dist,'pages.json'),'utf8'));
assert.equal(pages.length,data.projects.filter(p=>p.meta.collection==='selected').length+Object.keys(data.collections).length+2,'Main projects and grouped collections need pages');
const imageUpgrades=JSON.parse(fs.readFileSync(path.join(root,'docs/WORD IMAGE UPGRADES.json'),'utf8')).upgrades;
for(const upgrade of imageUpgrades){const image=path.join(root,upgrade.image);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(image)).digest('hex'),upgrade.sha256,'Word image integrity: '+upgrade.image);}
const sourceURLs=new Set();const sourceAssets=new Set();const hashes=new Set();
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const sourceFiles=['projects','profile','collections'].flatMap(dir=>walk(path.join(root,dir)));
for(const file of sourceFiles.filter(f=>f.endsWith('.webp'))){
  assert(fs.existsSync(file.replace(/\.webp$/,'.md')),`Image needs editable caption: ${file}`);
  hashes.add(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'));
  const caption=fs.readFileSync(file.replace(/\.webp$/,'.md'),'utf8');const id=caption.match(/^source_asset: (.+)$/m)?.[1];if(id)sourceAssets.add(id);
}
for(const p of data.projects){
  assert(fs.existsSync(local(p.dir,p.meta.cover)),`Missing cover: ${p.meta.id}`);
  for(const img of csv(p.meta.home_images))assert(fs.existsSync(local(p.dir,img)),`Missing homepage image: ${img}`);
  const videoIds=new Set(p.videos.map(v=>path.basename(v.file,'.md')));
  for(const section of p.sections){for(const img of csv(section.meta.images))assert(fs.existsSync(local(p.dir,img)),`Missing figure: ${img}`);if(section.meta.video)assert(videoIds.has(section.meta.video),`Missing video record: ${section.meta.video}`);}
  for(const v of p.videos)sourceURLs.add(v.meta.source_url);
}
let references=0;
for(const page of pages){
  const file=path.join(dist,page),html=fs.readFileSync(file,'utf8');
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`One page heading: ${page}`);
  assert(html.includes('name="viewport"'),`Responsive viewport: ${page}`);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,`Duplicate HTML IDs: ${page}`);
  for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
    const url=match[1].replaceAll('&amp;','&');if(/^(https?:|mailto:|tel:|data:)/.test(url))continue;
    const [queryPart,anchor]=url.split('#');const part=queryPart.split('?')[0];const target=part?path.resolve(path.dirname(file),decodeURIComponent(part)):file;
    assert(target.startsWith(dist+path.sep),`Reference outside output: ${url}`);assert(fs.existsSync(target),`${page} references missing ${url}`);
    if(anchor&&path.extname(target)==='.html'){const targetHtml=fs.readFileSync(target,'utf8');assert(targetHtml.includes(`id="${anchor}"`),`${page} references missing #${anchor}`);}
    references++;
  }
  for(const match of html.matchAll(/<img\b([^>]+)>/g)){if(!/\bsrc=/.test(match[1]))continue;assert(/\balt="[^"]+"/.test(match[1]),`Image needs alt text: ${page}`);if(/\bwidth=/.test(match[1]))assert(/width="\d+"/.test(match[1]),`Invalid image width: ${page}`);}
  assert(!html.includes('data-zoom')&&!html.includes('image-dialog'),'Image zoom is removed');
  assert(!/href="[^"]*projects\.html/.test(html),'Links must return to Home as the portfolio index');
  assert(!html.includes('M7lc1UVf-VE'),'Unrelated sample video must not be presented as project evidence');
  assert(!html.includes('Original portfolio overview figures'),'Removed overview panels must not return');
  assert(!html.includes('<summary>Original portfolio overview'),'Removed overview panels must not return');
}
const homeHTML=fs.readFileSync(path.join(dist,'index.html'),'utf8');
assert(!fs.existsSync(path.join(dist,'projects.html')),'Home replaces the duplicate project index');
assert(homeHTML.includes('aria-label="Home contents"'),'Home needs integrated contents');
assert(!homeHTML.includes('<details'),'Home contents must stay integrated');
assert(!homeHTML.includes('All 16 projects'),'Remove the redundant index button');
for(const id of ['about','experience','publication','contact'])assert(!homeHTML.includes(`id="${id}"`),`Home must end after the project collections: ${id}`);
for(const p of data.featured){
  const page=fs.readFileSync(path.join(dist,'projects',p.meta.id+'.html'),'utf8');
  assert(!page.includes('<figcaption'),'No figure captions on individual project pages');
  assert(page.includes('<aside class="case-toc"><a class="back-link"'),'Portfolio return belongs at the top of contents');
  assert(!page.includes('class="case-cover"'),'Do not repeat the project image in its overview');
  assert(!page.includes('id="demonstrations"'),'Main project videos belong beside their topics');
  assert.equal((page.match(/class="video-module"/g)||[]).length,p.videos.length,`Each main topic has its own video block: ${p.meta.id}`);
}
for(const [key]of Object.entries(data.collections)){
  const group=fs.readFileSync(path.join(dist,'collections',key+'.html'),'utf8');
  for(const p of data.projects.filter(p=>p.meta.collection===key)){
    assert(group.includes(`id="entry-${p.meta.id}"`),`Missing grouped entry ${p.meta.id}`);
    assert(!fs.existsSync(path.join(dist,'projects',p.meta.id+'.html')),`Retire separate page for ${p.meta.id}`);
  }
}
// Audit migration against preserved source, without making the JSON a build dependency.
const imported=path.resolve(root,'../Source Files/Website Import 2026-10-28/avatar-engineering-portfolio');
if(fs.existsSync(imported)){
  const originalAssets=JSON.parse(fs.readFileSync(path.join(imported,'src/assets.json'),'utf8'));
  const originalVideos=JSON.parse(fs.readFileSync(path.join(imported,'src/video-links.json'),'utf8'));
  assert.equal(sourceAssets.size,Object.keys(originalAssets).length,'Retain every original image');
  for(const id of Object.keys(originalAssets)){
    assert(sourceAssets.has(id),`Missing imported asset ${id}`);
    const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(imported,'public/assets',id+'.webp'))).digest('hex');assert(hashes.has(hash)||imageUpgrades.some(upgrade=>upgrade.previous_sha256===hash),`Asset needs original or verified Word upgrade: ${id}`);
  }
  for(const video of originalVideos)assert(sourceURLs.has(video.sourceUrl),`Missing original demonstration ${video.id}`);
  // Current downloads are verified against the approved release manifest below.
}
for(const pdf of JSON.parse(fs.readFileSync(path.join(root,'docs/DOWNLOADS.json'),'utf8')))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,pdf.file))).digest('hex'),pdf.sha256,'Current PDF release: '+pdf.file);
assert.equal(youtube('https://youtu.be/M7lc1UVf-VE'),'https://www.youtube-nocookie.com/embed/M7lc1UVf-VE');
assert.equal(youtube('https://www.youtube.com/watch?v=M7lc1UVf-VE'),'https://www.youtube-nocookie.com/embed/M7lc1UVf-VE');
assert.equal(youtube('https://www.youtube.com/shorts/M7lc1UVf-VE'),'https://www.youtube-nocookie.com/embed/M7lc1UVf-VE');
assert.throws(()=>youtube('https://example.com/watch?v=M7lc1UVf-VE'));
console.log(`Checked ${pages.length} pages, ${references} local references, ${sourceAssets.size} retained image records (${imageUpgrades.length} verified Word replacements), and ${sourceURLs.size} original video links.`);
