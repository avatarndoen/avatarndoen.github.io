import fs from 'node:fs';
import path from 'node:path';
import {root,load,esc,csv,local,markdown,youtube} from './content.mjs';
import {pathToFileURL} from 'node:url';
export function build() {
  const d=load(),m=d.main.meta;
  const mainProjects=d.projects.filter(p=>p.meta.collection==='selected');
  const out=path.join(root,'dist');
  fs.mkdirSync(out,{recursive:true});
  const urls=[];
  const write=(file,html)=>{const p=path.join(out,file);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,html);urls.push(file);};
  function publicFile(file){const absolute=local(root,file);if(!fs.existsSync(absolute))throw Error(`Missing file ${file}`);return path.relative(root,absolute).split(path.sep).join('/');}
  function assetURL(dir,file,prefix='') {return prefix+publicFile(path.relative(root,local(dir,file)));}
  function figure(dir,file,prefix='',opts={}) {
    const absolute=local(dir,file),side=absolute.replace(/\.[^.]+$/,'.md');
    const info=fs.existsSync(side)?dRead(side):null;
    if(!info) throw Error(`Image needs a caption file: ${side}`);
    const src=assetURL(dir,file,prefix),caption=info.body,alt=info.meta.alt||caption;
    const size=/^\d+$/.test(info.meta.width||'')&&/^\d+$/.test(info.meta.height||'')?` width="${esc(info.meta.width)}" height="${esc(info.meta.height)}"`:'';
    return `<figure class="${opts.className||''}"><div class="image-frame"><img src="${esc(src)}"${size} alt="${esc(alt)}" loading="${opts.eager?'eager':'lazy'}" decoding="async"></div>${opts.caption===false?'':`<figcaption>${esc(caption)}</figcaption>`}</figure>`;
  }
  function link(id,prefix='',className='text-link') {const l=d.links[id];if(!l)throw Error(`Unknown link ${id}`);const href=/^(https?:|mailto:|tel:)/.test(l.meta.url)?l.meta.url:prefix+publicFile(l.meta.url);return `<a class="${className}" href="${esc(href)}"${['portfolio','cv'].includes(id)?' download':''}>${esc(l.meta.label)} <span aria-hidden="true">↗</span></a>`;}
  function sectionHeading(n,title,description=''){return `<div class="section-heading"><p class="eyebrow">${n}</p><div><h2>${esc(title)}</h2>${description?`<div class="section-intro">${markdown(description)}</div>`:''}</div></div>`;}
  function tags(p){return `<ul class="tags" aria-label="Project topics">${csv(p.meta.tags).map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`;}
  function projectCard(p,prefix='',i=0){return `<article id="index-${p.meta.id}" class="project-card" data-category="${esc(p.meta.collection)}" data-search="${esc([p.meta.title,p.meta.summary,p.meta.tags].join(' ').toLowerCase())}"><div class="card-visual ${p.meta.collection==='selected'?'collage-visual':''}">${p.meta.collection==='selected'?previewGallery(p,prefix):figure(p.dir,p.meta.cover,prefix,{caption:false})}<span class="project-number">${String(i+1).padStart(2,'0')}</span></div><p class="eyebrow">${esc(p.meta.category)}</p><h3><a href="${prefix}projects/${p.meta.id}.html">${esc(p.meta.title)} <span aria-hidden="true">↗</span></a></h3><p>${esc(p.meta.summary)}</p>${tags(p)}</article>`;}
  function projectRow(p,i){return `<article class="project-row" id="home-${p.meta.id}"><div class="row-copy"><p class="eyebrow">${String(i+1).padStart(2,'0')} / ${esc(p.meta.role)}</p><h3><a href="projects/${p.meta.id}.html">${esc(p.meta.title)}</a></h3><p>${esc(p.meta.summary)}</p>${tags(p)}<a class="text-link" href="projects/${p.meta.id}.html">Explore the project <span aria-hidden="true">↗</span></a></div><div class="row-visual collage-visual">${previewGallery(p)}<span class="visual-label">${esc(p.meta.category)}</span></div></article>`;}

  function previewGallery(p,prefix='') {
    const files=csv(p.meta.home_images);const selected=files.length?files:[p.meta.cover];
    const ratios=selected.map(file=>{const meta=dRead(local(p.dir,file).replace(/\.[^.]+$/,'.md')).meta;return Number(meta.width)/Number(meta.height)||1;});
    const left=selected.length===3?ratios[0]*(1/ratios[1]+1/ratios[2]):ratios[0]/(ratios[1]||1);
    return `<div class="preview-gallery preview-count-${selected.length}" style="--preview-left:${left.toFixed(3)}fr">${selected.map(file=>figure(p.dir,file,prefix,{caption:false})).join('')}</div>`;
  }
  function pageContents(kind) {
    const home=kind==='home';
    const items=home?[['introduction','Introduction'],['skills','Skills'],['research-interests','Research interests'],['selected-work','Notable projects']]:[['collection-selected','Notable projects']];
    const projects=d.featured.map(p=>`<a class="toc-sub" href="#${home?'home':'index'}-${p.meta.id}">${esc(p.meta.title)}</a>`).join('');
    return `<aside class="case-toc page-toc"><p class="eyebrow">CONTENTS</p><nav aria-label="${home?'Home':'Project index'} contents">${items.map(([id,title])=>`<a href="#${id}">${title}</a>`).join('')}${projects}${Object.entries(d.collections).map(([key,col])=>`<a href="#${home?'home-collection':'collection'}-${key}">${esc(col.meta.title)}</a>`).join('')}</nav></aside>`;
  }
  function clipData(group) {
    if(group.meta.display==='link')return [];
    const clips=group.clips.length?group.clips:[group];
    return clips.map(clip=>({title:clip.meta.title,fileName:clip.meta.file_name||'',source:clip.meta.youtube_url||group.meta.source_url,sourceLabel:clip.meta.youtube_url?'Watch on YouTube':group.meta.source_url.includes('/f/')?'Open video folder':'Watch on OneDrive',embed:clip.meta.youtube_url&&clip.meta.placeholder!=='true'?youtube(clip.meta.youtube_url):'',caption:clip.body}));
  }
  function topicPlayer(p,section,prefix='../') {
    const ids=csv(section.meta.videos||section.meta.video);
    const groups=ids.map(id=>p.videos.find(v=>path.basename(v.file,'.md')===id)).filter(Boolean);
    const videos=groups.flatMap(clipData);
    if(!videos.length)return '';
    const poster=csv(section.meta.images)[0]||p.meta.cover;
    const first=videos[0];
    return `<aside class="topic-video"><p class="eyebrow">${videos.length===1?'VIDEO':videos.length+' VIDEOS'} / ${esc(section.meta.title)}</p><div class="video-module" role="group" aria-label="Videos for ${esc(section.meta.title)}" data-videos="${esc(JSON.stringify(videos))}" data-poster="${esc(assetURL(p.dir,poster,prefix))}"><div class="video-stage"><a class="video-poster" href="${esc(first.source)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(first.sourceLabel)}: ${esc(first.title)}"><img src="${esc(assetURL(p.dir,poster,prefix))}" alt="${esc(section.meta.title)}" loading="lazy"><span class="play-symbol" aria-hidden="true">▶</span><span class="video-open-label">${esc(first.sourceLabel)} ↗</span></a></div><div class="video-navigation"><button type="button" data-video-prev aria-label="Previous video"${videos.length===1?' hidden':''}>←</button><div><h3 class="video-title">${esc(first.title)}</h3><span class="video-counter">1 / ${videos.length}</span></div><button type="button" data-video-next aria-label="Next video"${videos.length===1?' hidden':''}>→</button></div>${videos.length>1?`<div class="video-choices">${videos.map((v,i)=>`<button type="button" data-video-index="${i}" aria-pressed="${i===0}">${esc(v.title)}</button>`).join('')}</div>`:''}</div></aside>`;
  }

  function education(){const e=d.education;return `<div class="education"><p class="eyebrow">EDUCATION</p><h3>${esc(e.meta.title)}</h3><p>${esc(e.meta.degree)}</p><p class="education-detail">${esc(e.meta.dates)} <span>GPA ${esc(e.meta.gpa)}</span></p>${markdown(e.body)}</div>`;}
  function skills(){return `<div class="skills-grid">${Object.entries(d.skills).filter(([k,v])=>k!=='intro'&&v&&k!=='tools').map(([title,body],i)=>`<article><span class="small-number">0${i+1}</span><h3>${esc(title.replace(/\b\w/g,c=>c.toUpperCase()))}</h3>${markdown(body)}</article>`).join('')}</div><div class="tool-line"><span class="eyebrow">TOOLS</span>${markdown(d.skills.tools||'')}</div>`;}
  function interests(){return `<ul class="interest-list">${d.interests.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`;}
  function experience(){return `<div class="timeline">${d.experience.map(e=>`<article><div><p class="eyebrow">${esc(e.meta.dates)}</p><h3>${esc(e.meta.company)}</h3></div><div><h4>${esc(e.meta.role)}</h4>${markdown(e.body)}</div></article>`).join('')}</div>`;}
  function publication(prefix=''){const p=d.publication;return `<article class="publication"><div><p class="eyebrow">RESEARCH / ${esc(p.meta.citation)}</p><h3>${esc(p.meta.title)}</h3>${markdown(p.body)}</div>${link(p.meta.link,prefix,'button button-light')}</article>`;}
  function layout(title,description,body,{prefix='',active='home',className=''}={}) {
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="${esc(d.design.meta.ink)}"><meta name="description" content="${esc(description)}"><title>${esc(title)}</title><link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${prefix}theme.css"><link rel="stylesheet" href="${prefix}styles.css"><link rel="stylesheet" href="${prefix}revision.css"><script src="${prefix}app.js" defer></script></head><body class="${className}"><a class="skip-link" href="#main">Skip to content</a><div id="top"></div><header class="site-header"><div class="header-inner"><a class="wordmark" href="${prefix}index.html" aria-label="${esc(m.name)} — Home"><span class="monogram" aria-hidden="true">an.</span><span>${esc(m.short_name)}</span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu <span aria-hidden="true">＋</span></button><nav id="site-nav" aria-label="Main navigation"><a href="${prefix}index.html"${active==='home'?' aria-current="page"':''}>Home</a><a href="${prefix}about.html"${active==='about'?' aria-current="page"':''}>About</a>${link('portfolio',prefix,'nav-pdf')}${link('cv',prefix,'nav-pdf nav-cv')}<a class="nav-contact" href="${esc(d.links.email.meta.url)}">Get in touch <span aria-hidden="true">↗</span></a></nav></div></header><main id="main">${body}</main><footer class="site-footer"><div><a class="wordmark" href="${prefix}index.html"><span class="monogram" aria-hidden="true">an.</span>${esc(m.short_name)}</a><p>${esc(m.role)} · ${esc(m.location)}</p></div><p>${esc(m.subheadline)}</p><a class="text-link" href="#top">Back to top ↑</a></footer></body></html>`;
  }
  const otherWork=Object.entries(d.collections).map(([key,col],i)=>{const entries=d.projects.filter(p=>p.meta.collection===key);return `<article class="secondary-group" id="home-collection-${key}"><div class="secondary-visual"><div class="preview-gallery secondary-gallery">${csv(col.meta.images).map(file=>figure(col.dir,file,'',{caption:false})).join('')}</div></div><p class="eyebrow">0${i+1} / ${entries.length} PROJECTS</p><h3><a href="collections/${key}.html">${esc(col.meta.title)}</a></h3><p>${esc(col.body)}</p><ul>${entries.map(p=>`<li id="home-${p.meta.id}"><a href="collections/${key}.html#entry-${p.meta.id}">${esc(p.meta.title)} <span aria-hidden="true">↗</span></a></li>`).join('')}</ul></article>`;}).join('');
  const home=`<div class="page-layout wrap home-layout">${pageContents('home')}<div class="page-content"><section class="hero wrap" id="introduction"><div class="hero-copy"><p class="eyebrow">${esc(m.eyebrow)}</p><p class="hero-name">${esc(m.name)} <span>${esc(m.role)}</span></p><h1>${esc(m.headline).replace('at heart.','<span class="hero-heading-line">at heart.</span>')}</h1><p class="hero-process">${esc(m.subheadline)}</p><div class="hero-intro">${markdown(d.home.introduction||'')}</div><div class="actions"><a class="button" href="#selected-work">Explore my work <span aria-hidden="true">↘</span></a><a class="text-link" href="about.html">More about me <span aria-hidden="true">↗</span></a></div></div><div class="hero-portrait"><img src="${esc(publicFile(m.hero_image))}" width="517" height="652" alt="${esc(m.hero_image_caption)}" fetchpriority="high"><div class="portrait-caption"><span>${esc(m.hero_image_caption)}</span><span>${esc(m.location)}</span></div></div></section><div class="identity-strip wrap"><span>${esc(d.education.meta.title)}</span><span>${esc(d.education.meta.degree)} / ${esc(d.education.meta.dates)}</span><span>GPA ${esc(d.education.meta.gpa)}</span></div><section class="section wrap home-capabilities" id="skills">${sectionHeading('SKILLS','Design, analysis, and making.')}${skills()}<div class="research-direction" id="research-interests"><div><p class="eyebrow">RESEARCH INTERESTS</p><h3>Mechanisms that support people.</h3>${markdown(d.home['research direction'])}</div>${interests()}</div></section><section class="section wrap" id="selected-work">${sectionHeading('NOTABLE PROJECTS',m.project_heading,d.home['selected work introduction'])}${d.featured.map(projectRow).join('')}<div class="secondary-work" id="more-projects"><div class="secondary-heading"><p class="eyebrow">THE WIDER COLLECTION</p><h2>${esc(m.secondary_heading)}</h2></div><div class="secondary-grid">${otherWork}</div></div></section></div></div>`;
  write('index.html',layout(m.site_title,'Mechanical engineering portfolio of Avatar Sargamantha Ndoen: mechanisms, robotics, computational design, and hands-on prototypes.',home));
  const about=`<section class="page-intro wrap"><p class="eyebrow">${esc(d.about.meta.eyebrow)}</p><h1>${esc(d.about.meta.title)}</h1><p class="page-lead">${esc(d.about.meta.intro)}</p></section><section class="wrap about-page"><aside class="about-sidebar">${figure(path.join(root,'profile'),'images/portrait-p1-01.webp','',{className:'about-portrait',caption:false,eager:true})}${education()}<div class="sidebar-contact">${link('email')}${link('portfolio')}</div></aside><div class="about-story prose">${markdown(d.about.body)}</div></section><section class="section wrap">${sectionHeading('01 / CAPABILITIES','Design, analysis, and making.')}${skills()}</section><section class="section wrap">${sectionHeading('02 / DIRECTION','What I’m curious about.')}${interests()}</section><section class="section wrap">${sectionHeading('03 / EXPERIENCE','Engineering in practice.')}${experience()}</section><section class="section wrap" id="publication">${sectionHeading('04 / PUBLICATION','Research in print.')}${publication()}</section><div class="wrap next-page"><p>See the mechanisms, prototypes, and design work behind this background.</p><a class="button" href="index.html#selected-work">Explore the projects ↗</a></div>`;
  write('about.html',layout(`About — ${m.short_name}`,d.about.meta.intro,about,{active:'about'}));
  const retiredIndex=path.resolve(out,'projects.html');
  if(path.dirname(retiredIndex)!==path.resolve(out))throw Error('Unexpected retired index path');
  if(fs.existsSync(retiredIndex))fs.unlinkSync(retiredIndex);
  for(const p of mainProjects){
    let group='';
    const sectionId=(s,i)=>`section-${i+1}`;
    const sections=p.sections.map((s,i)=>{
      let heading='';if(s.meta.group&&s.meta.group!==group){group=s.meta.group;heading=`<h2 class="project-group-heading">${esc(group)}</h2>`;}if(!s.meta.group)group='';
      const player=p.meta.collection==='selected'?topicPlayer(p,s):'';
      const content=`${heading}<div class="case-section-heading"><${s.meta.group?'h3':'h2'}>${esc(s.meta.title)}</${s.meta.group?'h3':'h2'}></div><div class="topic-layout${player?' has-video':''}"><div class="topic-content"><div class="prose">${markdown(s.body)}</div>${csv(s.meta.images).length?`<div class="figure-grid ${s.meta.figure_layout==='three-across'?'three-across':''} ${csv(s.meta.images).length===1?'single':''}">${csv(s.meta.images).map(file=>figure(p.dir,file,'../',{caption:false})).join('')}</div>`:''}</div>${player}</div>`;
      return s.meta.collapsed==='true'?`<details class="case-section overview-gallery" id="${sectionId(s,i)}"><summary>${esc(s.meta.title)}</summary>${content}</details>`:`<section class="case-section" id="${sectionId(s,i)}">${content}</section>`;
    }).join('');
    let tocGroup='';
    const projectTOC=p.sections.map((section,index)=>{
      let label='';
      if(section.meta.group&&section.meta.group!==tocGroup){tocGroup=section.meta.group;label=`<a class="toc-group" href="#${sectionId(section,index)}">${esc(tocGroup)}</a>`;}
      if(!section.meta.group)tocGroup='';
      return label+`<a${section.meta.group?' class="toc-sub"':''} href="#${sectionId(section,index)}">${esc(section.meta.title)}</a>`;
    }).join('');
    const videoData=p.meta.collection==='selected'?[]:p.videos.flatMap(v=>clipData(v).map(clip=>({...clip,id:path.basename(v.file,'.md')})));
    const videoHTML=videoData.length?`<section id="demonstrations" class="case-section video-section"><p class="eyebrow">PROJECT DEMONSTRATIONS</p><h2>See it in motion.</h2><div class="video-module" data-videos="${esc(JSON.stringify(videoData))}"><div class="video-stage"><div class="video-empty"><span aria-hidden="true">↗</span><p>${esc(videoData[0].title)}</p><a class="button" href="${esc(videoData[0].source)}" target="_blank" rel="noopener noreferrer">Open original video ↗</a></div></div><div class="video-navigation"><button type="button" data-video-prev aria-label="Previous demonstration">←</button><div><h3 class="video-title">${esc(videoData[0].title)}</h3><span class="video-counter">1 / ${videoData.length}</span></div><button type="button" data-video-next aria-label="Next demonstration">→</button></div><div class="video-choices">${videoData.map((v,i)=>`<button type="button" data-video-index="${i}" aria-pressed="${i===0}">${String(i+1).padStart(2,'0')} / ${esc(v.title)}</button>`).join('')}</div></div></section>`:'';
    const next=mainProjects[(mainProjects.indexOf(p)+1)%mainProjects.length];
    const body=`<section class="case-intro wrap"><p class="eyebrow">${esc(p.meta.category)}</p><h1>${esc(p.meta.title)}</h1><div class="case-intro-grid"><div><p class="page-lead">${esc(p.meta.summary)}</p>${tags(p)}</div><div class="case-meta"><span class="eyebrow">CONTEXT</span><p>${esc(p.meta.role)}</p>${p.meta.subtitle?`<p>${esc(p.meta.subtitle)}</p>`:''}${p.links.map(l=>`<a class="text-link" href="${esc(l.meta.url)}">${esc(l.meta.label)} ↗</a>`).join('')}</div></div></section><div class="wrap case-layout"><aside class="case-toc"><a class="back-link" href="../index.html#home-${p.meta.id}">← Back to portfolio</a><p class="eyebrow">IN THIS PROJECT</p><nav aria-label="Project contents">${projectTOC}${videoData.length?'<a href="#demonstrations">Demonstrations</a>':''}</nav></aside><div class="case-body"><div class="case-overview"><p class="eyebrow">OVERVIEW</p><div class="prose">${markdown(p.body)}</div></div>${sections}${p.meta.note?`<aside class="project-note">${markdown(p.meta.note)}</aside>`:''}${videoHTML}</div></div><div class="wrap next-page"><div><p class="eyebrow">NEXT PROJECT</p><h2>${esc(next.meta.title)}</h2></div><a class="button" href="${next.meta.id}.html">Explore project ↗</a></div>`;
    write(`projects/${p.meta.id}.html`,layout(`${p.meta.title} — ${m.short_name}`,p.meta.summary,body,{prefix:'../',active:'detail',className:'case-page'}));
  }

  const collectionEntries=Object.entries(d.collections);
  for(const [i,[key,col]] of collectionEntries.entries()) {
    const entries=d.projects.filter(p=>p.meta.collection===key);
    const toc=entries.map(p=>`<a href="#entry-${p.meta.id}">${esc(p.meta.title)}</a>${p.sections.map((section,i)=>section.meta.title==='Project figures'?'':`<a class="toc-sub" href="#entry-${p.meta.id}-topic-${i+1}">${esc(section.meta.title)}</a>`).join('')}`).join('');
    const content=entries.map(p=>{
      const usedGroups=new Set();
      const sections=p.sections.map((section,i)=>{
        const ids=csv(section.meta.videos||section.meta.video);ids.forEach(id=>usedGroups.add(id));
        const heading=section.meta.title==='Project figures'?'':`<h3>${esc(section.meta.title)}</h3>`;
        const topic={...section,meta:{...section.meta,title:section.meta.title==='Project figures'?p.meta.title:section.meta.title}};
        const player=topicPlayer(p,topic);
        const folderLinks=ids.map(id=>p.videos.find(v=>path.basename(v.file,'.md')===id)).filter(v=>v?.meta.display==='link').map(v=>`<a class="text-link folder-link" href="${esc(v.meta.folder_url||v.meta.source_url)}" target="_blank" rel="noopener noreferrer">Open ${esc(v.meta.title)} ↗</a>`).join('');
        return `<section class="collection-topic" id="entry-${p.meta.id}-topic-${i+1}">${heading}<div class="topic-layout${player?' has-video':''}"><div class="topic-content">${markdown(section.body)}${folderLinks}<div class="figure-grid ${csv(section.meta.images).length===1?'single':''}">${csv(section.meta.images).map(file=>figure(p.dir,file,'../',{caption:false})).join('')}</div></div>${player}</div></section>`;
      }).join('');
      const extras=p.videos.filter(v=>!usedGroups.has(path.basename(v.file,'.md')));
      const media=extras.length?`<div class="collection-media">${extras.map(v=>`<a class="text-link" href="${esc(v.meta.folder_url||v.meta.source_url)}" target="_blank" rel="noopener noreferrer">${esc(v.meta.title)} ↗</a>`).join('')}</div>`:'';
      return `<section class="collection-entry" id="entry-${p.meta.id}"><h2>${esc(p.meta.title)}</h2>${p.meta.show_intro==='false'?'':`<div class="prose">${markdown(p.body)}</div>`}${sections}${media}</section>`;
    }).join('');
    const next=collectionEntries[i+1];
    const ending=next?`<div class="wrap next-page"><div><p class="eyebrow">NEXT COLLECTION</p><h2>${esc(next[1].meta.title)}</h2></div><a class="button" href="${next[0]}.html">Explore collection ↗</a></div>`:`<div class="wrap next-page"><a class="button" href="../index.html#more-projects">Back to portfolio ↗</a></div>`;
    const body=`<section class="case-intro wrap"><p class="eyebrow">${entries.length} PROJECTS / COLLECTION</p><h1>${esc(col.meta.title)}</h1><div class="page-lead">${markdown(col.body)}</div></section><div class="wrap case-layout"><aside class="case-toc"><a class="back-link" href="../index.html#home-collection-${key}">← Back to portfolio</a><p class="eyebrow">IN THIS COLLECTION</p><nav aria-label="Collection contents">${toc}</nav></aside><div class="case-body">${content}</div></div>${ending}`;
    write(`collections/${key}.html`,layout(`${col.meta.title} — ${m.short_name}`,col.body,body,{prefix:'../',active:'detail',className:'collection-page'}));
    for(const p of entries){const retired=path.resolve(out,'projects',`${p.meta.id}.html`);if(path.dirname(retired)!==path.resolve(out,'projects'))throw Error('Unexpected retired project path');if(fs.existsSync(retired))fs.unlinkSync(retired);}
  }
  // Copy only public content and assets. Captions remain editable sources; private import docs stay outside dist.
  for(const folder of ['projects','profile','collections']) copyImages(path.join(root,folder),path.join(out,folder));
  fs.cpSync(path.join(root,'downloads'),path.join(out,'downloads'),{recursive:true});
  fs.copyFileSync(path.join(root,'site/styles.css'),path.join(out,'styles.css'));
  fs.copyFileSync(path.join(root,'site/app.js'),path.join(out,'app.js'));
  fs.copyFileSync(path.join(root,'site/revision.css'),path.join(out,'revision.css'));
  const colors=['background','paper','ink','muted','accent','line'];
  for(const key of colors)if(!/^#[a-f0-9]{6}$/i.test(d.design.meta[key]))throw Error(`DESIGN.md: ${key} must be a six-digit hex color`);
  if(!/^\d{3,4}px$/.test(d.design.meta.content_width))throw Error('DESIGN.md: content_width must be pixels, e.g. 1240px');
  fs.writeFileSync(path.join(out,'theme.css'),`:root{${colors.map(k=>`--${k}:${d.design.meta[k]}`).join(';')};--content-width:${d.design.meta.content_width}}\n`);
  fs.writeFileSync(path.join(out,'favicon.svg'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#24382f"/><text x="8" y="43" font-family="Georgia,serif" font-size="36" fill="#fffefa">an.</text></svg>');
  fs.writeFileSync(path.join(out,'.nojekyll'),'');
  fs.writeFileSync(path.join(out,'pages.json'),JSON.stringify(urls,null,2)+'\n');
  console.log(`Built ${urls.length} pages from Markdown.`);
  return urls;
}
import {read as dRead} from './content.mjs';
function copyImages(src,dest){for(const entry of fs.readdirSync(src,{withFileTypes:true})){const from=path.join(src,entry.name),to=path.join(dest,entry.name);if(entry.isDirectory())copyImages(from,to);else if(/\.(webp|png|jpe?g|gif|svg|avif)$/i.test(entry.name)){fs.mkdirSync(dest,{recursive:true});fs.copyFileSync(from,to);}}}
if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url) build();
