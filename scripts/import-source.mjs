// One-time, explicit migration of the preserved ZIP. The website never builds from this JSON.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imported = path.resolve(root, '../Source Files/Website Import 2026-10-28/avatar-engineering-portfolio');
const data = JSON.parse(fs.readFileSync(path.join(imported, 'src/content.json'), 'utf8'));
const assets = JSON.parse(fs.readFileSync(path.join(imported, 'src/assets.json'), 'utf8'));
const videos = JSON.parse(fs.readFileSync(path.join(imported, 'src/video-links.json'), 'utf8'));
if (fs.existsSync(path.join(root, 'MAIN.md'))) throw Error('Already imported. Edit the Markdown files; do not rerun migration.');
const write = (file, text) => { const p = path.join(root, file); fs.mkdirSync(path.dirname(p), {recursive:true}); fs.writeFileSync(p, text.trim()+'\n'); };
const doc = (meta, body='') => '---\n'+Object.entries(meta).map(([k,v])=>`${k}: ${v ?? ''}`).join('\n')+'\n---\n\n'+body;
const slug = str => str.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const pretty = str => str.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()).replace(/Dof/g,'DoF').replace(/Bldc/g,'BLDC').replace(/Cvt/g,'CVT').replace(/Cad/g,'CAD').replace(/Cae/g,'CAE').replace(/Imu/g,'IMU').replace(/Ml-/g,'ML-').replace(/Cfd/g,'CFD').replace(/Abu/g,'ABU').replace(/Krai/g,'KRAI').replace(/Nusabin/g,'Nusabin').replace(/Ne750j/g,'NE750J');
const seen = new Set();
function image(folder,id,description) {
  const file = `${slug(description).slice(0,52)}-${id}`;
  const dir = `${folder}/images`;
  fs.mkdirSync(path.join(root,dir), {recursive:true});
  fs.copyFileSync(path.join(imported,`public/assets/${id}.webp`),path.join(root,dir,`${file}.webp`));
  write(`${dir}/${file}.md`,doc({alt:description,source_asset:id,source_page:assets[id].page,width:assets[id].width,height:assets[id].height},description));
  seen.add(id);
  return `images/${file}.webp`;
}
function video(folder, url, title, order) {
  const old = videos.find(v=>v.sourceUrl===url);
  const id = `${String(order).padStart(2,'0')}-${slug(title).slice(0,65)}`;
  write(`${folder}/videos/${id}.md`,doc({title,source_url:url,youtube_url:'',placeholder:false},'Demonstration from the original portfolio.'));
  return id;
}
write('MAIN.md',doc({site_title:'Avatar Ndoen — Mechanical Engineering Portfolio',name:data.profile.name,short_name:'Avatar Ndoen',role:'Mechanical Engineer',location:'Toyota, Japan',eyebrow:'MECHANISMS / ROBOTICS / COMPUTATIONAL DESIGN',headline:'Maker at heart.',subheadline:'Build. Test. Optimize. Repeat.',featured_projects:'wrist, arm, cvt, continuum, hand',hero_image:'profile/images/portrait-p1-01.webp',hero_image_caption:'Avatar Sargamantha Ndoen',project_heading:'Ideas, made tangible.',about_heading:'Engineering starts with curiosity.',experience_heading:'From research to real hardware.',contact_heading:'Let’s talk engineering.'},`## Introduction\n\n${data.profile.about[0]}\n\n## Selected work introduction\n\nCompliant mechanisms, custom actuation, computational design, and hands-on robotics. Explore the decisions, prototypes, and testing behind each project.\n\n## About preview\n\n${data.profile.about.join('\n\n')}\n\n## Research direction\n\nI want to build on my experience with mechanisms, actuation, and teleoperation to develop more accessible robotic devices for healthcare. My interests include assistive and surgical robotics, compliant mechanisms, and computational design.\n\n## Contact introduction\n\nFor conversations about mechanical design, robotics, or research, you can reach me by email.`));
image('profile','p1-01','Portrait');
write('ABOUT.md',doc({title:'A little more about me.',eyebrow:'ABOUT / BACKGROUND',intro:'Mechanical engineer. Curious maker. Always learning.'},`${data.profile.about.join('\n\n')}\n\n## What draws me to research\n\nMy undergraduate thesis introduced me to biomechanics and machine learning. Working through unfamiliar design, automation, and optimization problems made me enjoy the process of research: asking questions, learning by doing, and testing ideas in hardware.\n\n## Where I want to go\n\nI want to develop robotic devices for healthcare, including assistive systems that support natural movement and surgical manipulators for precise tasks. My projects have given me a starting point in mechanisms, actuation, computational design, and teleoperation. I want to build on that foundation through further research.\n\n## Beyond engineering\n\nOutside engineering, I enjoy basketball, gaming, and anime.`));
write('DESIGN.md',doc({background:'#f4f2eb',paper:'#fffefa',ink:'#24382f',muted:'#62695f',accent:'#a5452c',line:'#d7d9ce',content_width:'1240px'},`# Visual direction\n\nWarm paper, deep green typography, and a restrained terracotta accent. Large editorial headings, generous spacing, clear section numbers, and real project images.\n\nThe homepage introduces Avatar, presents five substantial project previews, then gives a complete About preview, capabilities, research interests, experience, publication, and contact.\n\nProject pages explain the work through readable sections and uncropped figures. The navigation uses ordinary links and the browser’s natural scrolling.\n\nThe color and width fields above directly control the site. Detailed layout styles live in site/styles.css.`));
write('profile/EDUCATION.md',doc({title:'Institut Teknologi Bandung',degree:'Bachelor of Engineering in Mechanical Engineering',dates:'2021–2025',gpa:'3.80/4.00'},'Undergraduate research: Biomechanics Research Lab.'));
write('profile/SKILLS.md',data.profile.skills.map(([title,body])=>`## ${title}\n\n${body}`).join('\n\n')+'\n\n## Tools\n\nSolidWorks · CATIA V5 · Onshape · ANSYS Mechanical / Fluent · Python · MATLAB / Simulink · C++ · SolidWorks API · ANSYS ACT');
write('profile/INTERESTS.md','# Research interests\n\n'+data.profile.interests.map(x=>`- ${x}`).join('\n'));
data.profile.experience.forEach((e,i)=>write(`profile/experience/${String(i+1).padStart(2,'0')}-${slug(e.company)}.md`,doc({company:e.company,role:e.role,dates:e.dates.join(' / ')},e.text)));
write('profile/PUBLICATION.md',doc({title:data.profile.publication.title,citation:data.profile.publication.citation,link:'publication'},data.profile.publication.contributions));
write('links/email.md',doc({label:'Email Avatar',url:`mailto:${data.profile.contact[1]}`,display:data.profile.contact[1]}));
write('links/phone.md',doc({label:'Telephone',url:'tel:+628113812435',display:data.profile.contact[2]}));
write('links/publication.md',doc({label:'Read the paper',url:data.profile.publication.url,display:'Scientific Reports / 2026'}));
write('links/portfolio.md',doc({label:'Portfolio PDF',url:'downloads/Avatar_Sargamantha_Ndoen_Portfolio.pdf',display:'Download the original portfolio'}));
fs.mkdirSync(path.join(root,'downloads'),{recursive:true});
fs.copyFileSync(path.join(imported,'public/Avatar_Sargamantha_Ndoen_Portfolio.pdf'),path.join(root,'downloads/Avatar_Sargamantha_Ndoen_Portfolio.pdf'));
const tags = {wrist:'Compliant mechanisms, CAD–CAE automation, Optimization',arm:'Actuation, Teleoperation, System integration',cvt:'Transmissions, Kinematic modeling, Prototyping',continuum:'Compliant mechanisms, Tendon actuation, Robotics',hand:'Tendon actuation, Compliant mechanisms, Robotics'};
let projectOrder=0;
for (const p of data.projects) {
  projectOrder++;
  const folder=`projects/${String(projectOrder).padStart(2,'0')}-${p.id}`;
  const imageMap=new Map();
  const addImage=(id,description)=> { if(!imageMap.has(id)) imageMap.set(id,image(folder,id,description)); return imageMap.get(id); };
  const cover=addImage(p.cover,`${p.title} — ${p.id==='continuum'?'physical prototype':'design overview'}`);
  const title=p.id==='arm'?'Custom Actuators & Teleoperated Robotic Arm':p.title;
  const intro=p.id==='arm'?'Designed and built compact BLDC–cycloidal actuators, a wearable encoder-and-IMU master controller, and a robotic arm with five arm DoF and two wrist DoF.':p.intro;
  const summary=p.id==='arm'?'Custom BLDC–cycloidal actuators, a wearable controller, and a teleoperated arm with five arm DoF and two wrist DoF.':p.summary;
  const role=p.id==='wrist'?'Undergraduate thesis':'Self-funded personal project';
  write(`${folder}/PROJECT.md`,doc({id:p.id,title,order:projectOrder,collection:'selected',category:p.category || 'Compliant Mechanisms & Tendon Actuation',summary,cover,role,tags:tags[p.id],subtitle:p.subtitle || '',note:p.note || ''},intro));
  let sectionOrder=0,videoOrder=0;
  for (const group of p.groups) for (const f of group.features) {
    sectionOrder++;
    const title=pretty(f.title);
    let body=f.text;
    if(p.id==='wrist' && f.title==='EXPERIMENTAL SETUP') body="Built a motor-driven tendon-pulling rig with inline force measurement to test the printed prototype’s range of motion.";
    if(p.id==='cvt' && f.title==='PYTHON MODELING AND OPTIMIZATION') body='Used a Python-based kinematic model to investigate how linkage dimensions and noncircular gear profiles affected motion, then explored surrogate-assisted optimization to reduce modeled torque ripple.';
    if(p.id==='cvt' && f.title==='PHYSICAL CONCEPT PROTOTYPE') body+='.';
    const img=f.images.map((id,i)=>addImage(id,`${title} — figure ${i+1}`));
    const vid=f.video?video(folder,f.video,title,++videoOrder):'';
    write(`${folder}/sections/${String(sectionOrder).padStart(2,'0')}-${slug(title)}.md`,doc({title,group:group.title?pretty(group.title):'',images:img.join(', '),video:vid},body+(f.note?'\n\n'+f.note:'')));
  }
  const overview=(p.archive || []).map((id,i)=>addImage(id,`${p.title} — portfolio overview ${i+1}`));
  if(overview.length) write(`${folder}/sections/99-portfolio-overview.md`,doc({title:'Original portfolio overview',images:overview.join(', '),collapsed:true},'Additional overview figures from the source portfolio.'));
  if(p.id==='wrist') write(`${folder}/links/publication.md`,doc({label:'Published research',url:data.profile.publication.url}));
}
for (const [collection,list] of [['industry',data.contract],['competition',data.competition],['explorations',data.extra]]) {
  for (const p of list) {
    projectOrder++;
    const id=slug(p.title);
    const folder=`projects/${String(projectOrder).padStart(2,'0')}-${id}`;
    const imgs=p.images.map((id,i)=>image(folder,id,`${pretty(p.title)} — figure ${i+1}`));
    const cleaned=p.text.replaceAll('[VIDEO]','').replaceAll(' <3','').replace(/\s+,/g,',').trim();
    write(`${folder}/PROJECT.md`,doc({id,title:pretty(p.title),order:projectOrder,collection,category:collection==='industry'?'Industry & Collaboration':collection==='competition'?'Competition & Team Projects':'Personal Explorations',summary:cleaned,cover:imgs[0],role:collection==='industry'?'Mechanical design and simulation contributions':collection==='competition'?'Team project':'Personal project',tags:collection==='industry'?'Mechanical design, Simulation':collection==='competition'?'Teamwork, Mechanical design':'Making, Design exploration'},cleaned));
    let n=0;
    const vid=p.video?video(folder,p.video,pretty(p.title),++n):'';
    write(`${folder}/sections/01-project-figures.md`,doc({title:'Project figures',images:imgs.join(', '),video:vid}));
    for(const link of p.links || []) video(folder,link.url,link.label,++n);
  }
}
for(const [sourceKey,collection] of [['contract','industry'],['competition','competition'],['extra','explorations']]) {
  const title={industry:'Industry & collaboration',competition:'Competitions & teamwork',explorations:'Beyond the brief'}[collection];
  const folder=`collections/${collection}`;
  const imgs=data.summaryGalleries[sourceKey].map((id,i)=>image(folder,id,`${title} — portfolio overview ${i+1}`));
  write(`${folder}/COLLECTION.md`,doc({title,images:imgs.join(', ')},sourceKey==='contract'?data.contractIntro:sourceKey==='extra'?data.extraIntro:'Mechanical design, integration, and teamwork through robotics and energy projects.'));
}
if(seen.size!==Object.keys(assets).length) throw Error(`Migration missed images: ${Object.keys(assets).filter(x=>!seen.has(x))}`);
write('docs/MIGRATION.md',`# Source and claim boundaries\n\nImported locally on October 28, 2026 from Avatar_Engineering_Portfolio.zip. Original ZIP SHA-256: 4D06E76B3E317431418681AA0F38BE8DB5D129444668616813FF69780A04C137. The unchanged ZIP and complete original site are preserved in ../Source Files/Website Import 2026-10-28/.\n\nAll ${seen.size} image assets, ${videos.length} original video destinations, five main projects and eleven additional entries are retained. Source PNGs, PDF extraction, historical handoff notes and prior design are in the preserved import. The imported handoff is historical evidence; the applicant's October 28 request for a fuller homepage supersedes its compact-homepage preference.\n\nThe current website builds from Markdown only. Central JSON is preserved only in the original import. Image captions initially describe their source section; they are editable proposals, not new technical evidence.\n\nThe old site used a sample YouTube video for all 17 demonstrations. The rebuild leaves youtube_url empty and retains each original project link. Supplying an actual YouTube URL enables an inline player. No unrelated sample is presented as project evidence.\n\nThe homepage and About text use supplied portfolio paragraphs plus existing applicant records. Career goals are intentions. The arm is described as five arm plus two wrist DoF. Hand integration remains planned. Continuum tasks remain basic prototype demonstrations without new accuracy claims; no diameter is added because the latest applicant account differs from older source text. The CAD–CAE experimental-setup sentence's duplicated fragment was removed. CVT wording follows the canonical SOP sequence: Python model → surrogate-assisted optimization → SolidWorks engagement check → physical concept. Detailed ripple figures remain omitted under the recorded portfolio preference. No claim of physical ripple validation is added.\n\nThe downloaded PDF is the unchanged PDF from this ZIP; it is not a newly generated export of website edits. The ZIP import does not select a canonical Word/PDF portfolio from earlier source variants.`);
console.log(`Migrated ${projectOrder} projects, ${seen.size} images, and ${videos.length} original video links to editable Markdown.`);
