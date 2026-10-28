const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('#site-nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
nav?.addEventListener('click',e=>{if(e.target.closest('a')){menu?.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');menu.focus();}});
document.querySelectorAll('.video-module').forEach(module=>{
  const videos=JSON.parse(module.dataset.videos);let current=0;
  function select(index){
    current=(index+videos.length)%videos.length;const video=videos[current],stage=module.querySelector('.video-stage');stage.replaceChildren();
    if(video.embed){
      const iframe=document.createElement('iframe');iframe.src=video.embed;iframe.title=video.title;iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';iframe.allowFullscreen=true;stage.append(iframe);
    }else{
      if(module.dataset.poster){const a=document.createElement('a');a.className='video-poster';a.href=video.source;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',`${video.sourceLabel}: ${video.title}`);const img=document.createElement('img');img.src=module.dataset.poster;img.alt=video.title;const play=document.createElement('span');play.className='play-symbol';play.textContent='▶';play.setAttribute('aria-hidden','true');const label=document.createElement('span');label.className='video-open-label';label.textContent=`${video.sourceLabel} ↗`;a.append(img,play,label);stage.append(a);}else{const box=document.createElement('div');box.className='video-empty';const title=document.createElement('p');title.textContent=video.title;const a=document.createElement('a');a.className='button';a.textContent='Open original video ↗';a.href=video.source;a.target='_blank';a.rel='noopener noreferrer';box.append(title,a);stage.append(box);}
    }
    module.querySelector('.video-title').textContent=video.title;module.querySelector('.video-counter').textContent=`${current+1} / ${videos.length}`;
    module.querySelectorAll('[data-video-index]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===current)));
  }
  module.querySelector('[data-video-prev]').addEventListener('click',()=>select(current-1));module.querySelector('[data-video-next]').addEventListener('click',()=>select(current+1));
  module.querySelectorAll('[data-video-index]').forEach(button=>button.addEventListener('click',()=>select(Number(button.dataset.videoIndex))));
  document.querySelectorAll('[data-select-video]').forEach(button=>button.addEventListener('click',()=>{const index=videos.findIndex(v=>v.id===button.dataset.selectVideo);if(index>=0)select(index);}));
  if(videos[0].embed)select(0);
  if(videos.length===1){module.querySelector('[data-video-prev]').hidden=true;module.querySelector('[data-video-next]').hidden=true;}
});
document.querySelectorAll('.case-toc,.page-toc').forEach(toc=>{
  const links=[...toc.querySelectorAll('a[href^="#"]')];
  const entries=links.map(link=>({link,section:document.getElementById(link.hash.slice(1))})).filter(entry=>entry.section);
  let pointerInside=false,pending=false;
  toc.addEventListener('pointerenter',()=>{pointerInside=true;});
  toc.addEventListener('pointerleave',()=>{pointerInside=false;});
  toc.addEventListener('wheel',event=>{
    if(getComputedStyle(toc).position!=='sticky'||toc.scrollHeight<=toc.clientHeight)return;
    const distance=event.deltaY*(event.deltaMode===1?20:event.deltaMode===2?toc.clientHeight:1);
    if(distance){event.preventDefault();toc.scrollTop+=distance;}
  },{passive:false});
  function update(){
    pending=false;
    const threshold=Math.min(window.innerHeight*.28,240);
    let active=entries[0];
    for(const entry of entries){if(entry.section.getBoundingClientRect().top<=threshold)active=entry;}
    for(const entry of entries){if(entry===active)entry.link.setAttribute('aria-current','true');else entry.link.removeAttribute('aria-current');}
    if(active&&!pointerInside&&getComputedStyle(toc).position==='sticky'){
      const box=toc.getBoundingClientRect(),item=active.link.getBoundingClientRect();
      if(item.top<box.top+20||item.bottom>box.bottom-20){toc.scrollTo({top:toc.scrollTop+item.top-box.top-toc.clientHeight/2+item.height/2,behavior:'smooth'});}
    }
  }
  function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  entries.forEach(({link,section})=>link.addEventListener('click',()=>{if(section instanceof HTMLDetailsElement)section.open=true;}));
  update();
});
