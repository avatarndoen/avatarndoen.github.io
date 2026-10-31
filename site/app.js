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
// Narrow-window contents: individual magnifying markers, not a modal menu.
document.querySelectorAll('.case-toc,.page-toc').forEach(toc=>{
  const entries=[...toc.querySelectorAll('a[href^="#"]')].map(link=>({link,section:document.getElementById(link.hash.slice(1))})).filter(e=>e.section);
  if(!entries.length)return;
  const compact=window.matchMedia('(max-width:1000px)');
  const reducedMotion=window.matchMedia('(prefers-reduced-motion:reduce)');
  const dock=document.createElement('nav');dock.className='contents-dock';dock.setAttribute('aria-label','Page contents');
  dock.innerHTML='<span class="dock-heading" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 6h12M8 12h12M8 18h12M3 6h1M3 12h1M3 18h1"/></svg></span>';
  const track=document.createElement('div');track.className='dock-track';
  const items=entries.map((entry,index)=>{
    const item=document.createElement('a');item.className='dock-item';item.href=entry.link.hash;
    item.setAttribute('aria-label',entry.link.textContent.trim());item.dataset.dockIndex=String(index);
    const mark=document.createElement('span');mark.className='dock-mark';mark.setAttribute('aria-hidden','true');item.append(mark);track.append(item);return item;
  });
  const tooltip=document.createElement('div');tooltip.className='dock-tooltip';tooltip.id='contents-preview';tooltip.hidden=true;
  const label=document.createElement('span');label.className='dock-label';
  const hint=document.createElement('span');hint.className='dock-hint';
  const go=document.createElement('button');go.type='button';go.className='dock-go';go.textContent='Go to section →';go.hidden=true;
  tooltip.append(label,hint,go);dock.append(track,tooltip);document.querySelector('.site-header').after(dock);document.body.classList.add('has-contents');
  let pointerInside=false,pending=false,activeIndex=0,previewIndex=-1,touch=null,touchFrame=0,suppressClickUntil=0,lastMouseY=null;
  function positionLabel(){
    if(tooltip.hidden||previewIndex<0)return;
    const box=dock.getBoundingClientRect(),item=items[previewIndex].getBoundingClientRect();
    const half=tooltip.offsetHeight/2;
    const center=Math.max(92+half,Math.min(window.innerHeight-16-half,item.top+item.height/2));
    tooltip.style.top=`${center-box.top}px`;
  }
  function preview(fraction,mode='mouse'){
    if(!compact.matches)return;
    fraction=Math.max(0,Math.min(items.length-1,fraction));previewIndex=Math.round(fraction);
    dock.classList.add('has-preview');dock.classList.toggle('is-touch-preview',mode==='touch');
    items.forEach((item,index)=>{
      const distance=Math.abs(index-fraction),effect=distance<2.25?(1+Math.cos(Math.PI*distance/2.25))/2:0;
      item.style.setProperty('--mark-width',`${(index===activeIndex?16:8)+20*effect}px`);
      item.style.setProperty('--mark-height',`${3+5*effect}px`);
      item.style.setProperty('--mark-shift',`${Math.sign(index-fraction)*effect*2.5}px`);
      item.classList.toggle('is-preview',index===previewIndex);
      if(index===previewIndex)item.setAttribute('aria-describedby','contents-preview');else item.removeAttribute('aria-describedby');
    });
    label.textContent=entries[previewIndex].link.textContent.trim();
    const dragging=!!touch&&(touch.dragging||touch.held);
    hint.textContent=mode==='touch'?(dragging?(touch.cancel?'Release to cancel':'Release to go'):'Tap Go, or hold and slide'):'';
    hint.hidden=!hint.textContent;go.hidden=mode!=='touch'||dragging;
    tooltip.hidden=false;positionLabel();
  }
  function clearPreview(){
    previewIndex=-1;tooltip.hidden=true;dock.classList.remove('has-preview','is-touch-preview');
    items.forEach(item=>{item.style.removeProperty('--mark-width');item.style.removeProperty('--mark-height');item.style.removeProperty('--mark-shift');item.classList.remove('is-preview');item.removeAttribute('aria-describedby');});
  }
  function nearest(y){
    let selected=0,distance=Infinity;
    items.forEach((item,index)=>{const b=item.getBoundingClientRect(),d=Math.abs(y-b.top-b.height/2);if(d<distance){selected=index;distance=d;}});
    return selected;
  }
  function mouseFraction(y){
    const first=items[0].getBoundingClientRect(),height=first.height;
    return (y-first.top-height/2)/height;
  }
  function navigate(index){
    if(index<0)return;
    const {link,section}=entries[index];
    if(section instanceof HTMLDetailsElement)section.open=true;
    if(location.hash!==link.hash)history.pushState(null,'',link.hash);
    section.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'start'});
    const temporary=!section.hasAttribute('tabindex');if(temporary)section.setAttribute('tabindex','-1');
    section.focus({preventScroll:true});if(temporary)section.addEventListener('blur',()=>section.removeAttribute('tabindex'),{once:true});
    clearPreview();
  }
  items.forEach((item,index)=>{
    item.addEventListener('focus',()=>preview(index,'keyboard'));
    item.addEventListener('click',event=>{event.preventDefault();if(performance.now()>=suppressClickUntil)navigate(index);});
    item.addEventListener('keydown',event=>{
      let next=index;
      if(event.key==='ArrowUp')next=Math.max(0,index-1);
      else if(event.key==='ArrowDown')next=Math.min(items.length-1,index+1);
      else if(event.key==='Home')next=0;
      else if(event.key==='End')next=items.length-1;
      else return;
      event.preventDefault();items[next].focus({preventScroll:true});items[next].scrollIntoView({block:'nearest'});preview(next,'keyboard');
    });
  });
  go.addEventListener('click',()=>navigate(previewIndex));
  dock.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();clearPreview();}});
  dock.addEventListener('focusout',event=>{if(!dock.contains(event.relatedTarget)&&!pointerInside&&!touch)clearPreview();});
  dock.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')pointerInside=true;});
  dock.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'){pointerInside=false;lastMouseY=null;if(!touch)clearPreview();}});
  track.addEventListener('pointermove',event=>{if(event.pointerType==='mouse'&&!touch){lastMouseY=event.clientY;preview(mouseFraction(event.clientY));}});
  track.addEventListener('scroll',()=>{if(!touch&&lastMouseY!==null)preview(mouseFraction(lastMouseY));else if(previewIndex>=0)positionLabel();},{passive:true});
  function inReleaseArea(event){const box=track.getBoundingClientRect();return event.clientX>=box.left-20&&event.clientX<=box.right+80&&event.clientY>=box.top-24&&event.clientY<=box.bottom+24;}
  function scrubFrame(){
    touchFrame=0;
    if(!touch||(!touch.dragging&&!touch.held))return;
    const box=track.getBoundingClientRect();
    const delta=touch.y<box.top+24?-5:touch.y>box.bottom-24?5:0;
    if(delta){track.scrollTop+=delta;preview(nearest(touch.y),'touch');}
    touchFrame=requestAnimationFrame(scrubFrame);
  }
  function startScrub(){if(!touchFrame)touchFrame=requestAnimationFrame(scrubFrame);}
  dock.addEventListener('pointerdown',event=>{
    if(event.pointerType==='mouse')return;
    const item=event.target.closest('.dock-item');if(!item)return;
    event.preventDefault();
    const index=Number(item.dataset.dockIndex),repeated=dock.classList.contains('is-touch-preview')&&previewIndex===index;
    touch={id:event.pointerId,x:event.clientX,y:event.clientY,startY:event.clientY,repeated,dragging:false,held:false,cancel:false,timer:0};
    dock.setPointerCapture(event.pointerId);preview(index,'touch');
    touch.timer=setTimeout(()=>{if(touch){touch.held=true;preview(nearest(touch.y),'touch');startScrub();}},280);
  });
  dock.addEventListener('pointermove',event=>{
    if(!touch||event.pointerId!==touch.id)return;
    touch.x=event.clientX;touch.y=event.clientY;touch.cancel=!inReleaseArea(event);
    if(!touch.dragging&&Math.abs(event.clientY-touch.startY)>7){touch.dragging=true;clearTimeout(touch.timer);startScrub();}
    preview(nearest(event.clientY),'touch');
  });
  function endTouch(event,cancelled=false){
    if(!touch||event.pointerId!==touch.id)return;
    const state=touch,index=previewIndex;clearTimeout(state.timer);cancelAnimationFrame(touchFrame);
    const commit=!cancelled&&inReleaseArea(event)&&(state.dragging||state.held||state.repeated);
    touch=null;suppressClickUntil=performance.now()+600;
    if(dock.hasPointerCapture(event.pointerId))dock.releasePointerCapture(event.pointerId);
    if(commit)navigate(index);else if(cancelled||state.cancel||state.dragging||state.held)clearPreview();else preview(index,'touch');
  }
  dock.addEventListener('pointerup',event=>endTouch(event));
  dock.addEventListener('pointercancel',event=>endTouch(event,true));
  dock.addEventListener('contextmenu',event=>{if(dock.classList.contains('is-touch-preview'))event.preventDefault();});
  document.addEventListener('pointerdown',event=>{if(!dock.contains(event.target)&&!touch)clearPreview();});
  compact.addEventListener('change',()=>{pointerInside=false;clearPreview();schedule();});
  toc.addEventListener('pointerenter',()=>{pointerInside=true;});toc.addEventListener('pointerleave',()=>{pointerInside=false;});
  toc.addEventListener('wheel',event=>{
    if(getComputedStyle(toc).position!=='sticky'||toc.scrollHeight<=toc.clientHeight)return;
    const distance=event.deltaY*(event.deltaMode===1?20:event.deltaMode===2?toc.clientHeight:1);if(distance){event.preventDefault();toc.scrollTop+=distance;}
  },{passive:false});
  function update(){
    pending=false;const threshold=Math.min(window.innerHeight*.28,240);let active=entries[0];
    for(const entry of entries){if(entry.section.getBoundingClientRect().top<=threshold)active=entry;}
    const journey=document.querySelector('[data-journey]');
    if(journey){const box=journey.getBoundingClientRect(),current=journey.querySelector('[data-journey-go][aria-current=true]');if(current&&box.top<=threshold&&box.bottom>threshold){const city=entries.find(e=>e.link.hash===current.hash);if(city)active=city;}}
    activeIndex=entries.indexOf(active);
    entries.forEach((entry,index)=>{
      for(const link of [entry.link,items[index]]){if(index===activeIndex)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');}
    });
    if(!tooltip.hidden)positionLabel();
    if(active&&!pointerInside&&toc.getClientRects().length&&getComputedStyle(toc).position==='sticky'){
      const box=toc.getBoundingClientRect(),item=active.link.getBoundingClientRect();
      if(item.top<box.top+20||item.bottom>box.bottom-20)toc.scrollTo({top:toc.scrollTop+item.top-box.top-toc.clientHeight/2+item.height/2,behavior:reducedMotion.matches?'instant':'smooth'});
    }
  }
  function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',()=>{clearPreview();schedule();},{passive:true});document.addEventListener('journeychange',schedule);
  entries.forEach(({link,section})=>link.addEventListener('click',()=>{if(section instanceof HTMLDetailsElement)section.open=true;}));
  update();
});

// A scroll-linked city journey; page scrolling remains entirely native.
document.querySelectorAll('[data-journey]').forEach(journey=>{
  const svg=journey.querySelector('svg');
  const chapters=[...journey.querySelectorAll('[data-journey-stop]')];
  const controls=[...journey.querySelectorAll('[data-journey-go]')];
  const pins=[...journey.querySelectorAll('[data-journey-pin]')];
  const legs=[...journey.querySelectorAll('[data-journey-leg]')];
  const legLengths=legs.map(path=>{path.removeAttribute('pathLength');return path.getTotalLength();});
  const label=journey.querySelector('[data-journey-label]'),counter=journey.querySelector('[data-journey-counter]');
  const reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
  const states=[[1235.833,60,300],[1076.4,35,330],[1371.563,-375,350]];
  const names=['Kupang, Indonesia','Bandung, Indonesia','Toyota, Japan'];
  let scheduled=false,lastActive=-1;
  const clamp=n=>Math.max(0,Math.min(1,n));
  function update(){
    scheduled=false;
    const map=journey.querySelector('.journey-map');
    const mapBox=map.getBoundingClientRect();
    const stacked=getComputedStyle(journey).display==='block'&&getComputedStyle(map).position==='sticky';
    const scrollPadding=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0;
    const anchorOffset=Math.max(0,Math.round((stacked?88+mapBox.height+24:110)-scrollPadding));
    chapters.forEach(chapter=>{chapter.style.scrollMarginTop=`${anchorOffset}px`;});
    // Use the pinned position, even while the map releases at the section end.
    const pinnedBottom=(parseFloat(getComputedStyle(map).top)||0)+mapBox.height;
    const focusLine=stacked?Math.min(window.innerHeight-80,Math.max(window.innerHeight*.55,(pinnedBottom+window.innerHeight)*.5)):window.innerHeight*.55;
    const boxes=chapters.map(c=>c.getBoundingClientRect());
    let progress=0;
    for(let i=0;i<2;i++){
      // Travel between chapter centres rather than rushing through their boundary.
      const start=boxes[i].top+boxes[i].height*.5;
      const end=boxes[i+1].top+boxes[i+1].height*.5;
      if(focusLine>=end)progress=i+1;
      else if(focusLine>start)progress=i+clamp((focusLine-start)/(end-start));
    }
    const active=Math.round(progress);
    const leg=Math.min(1,Math.floor(progress)),raw=progress-leg,t=raw*raw*(3-2*raw);
    const from=states[leg],to=states[leg+1];
    let width=from[2]+(to[2]-from[2])*t+Math.sin(Math.PI*t)*(leg===0?50:430);
    let height=width*470/720;
    let x=from[0]+(to[0]-from[0])*t-width/2;
    let y=from[1]+(to[1]-from[1])*t-height/2;
    if(reduced.matches){x=920;y=-495;width=640;height=650;}
    svg.setAttribute('viewBox',`${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)}`);
    const rect=svg.getBoundingClientRect();
    const unit=Math.max(width/Math.max(1,rect.width),height/Math.max(1,rect.height));
    pins.forEach((pin,index)=>{pin.classList.toggle('is-active',index===active);pin.querySelector('.journey-pin-size').setAttribute('transform',`scale(${unit.toFixed(4)})`);});
    legs.forEach((path,index)=>{const length=legLengths[index];path.style.strokeDasharray=`${length} ${length}`;path.style.strokeDashoffset=String(length*(1-clamp((reduced.matches?active:progress)-index)));path.style.strokeWidth=String(1.8*unit);});
    if(active!==lastActive){
      label.textContent=names[active];counter.textContent=`0${active+1} / 03`;
      chapters.forEach((c,index)=>c.classList.toggle('is-active',index===active));
      controls.forEach((a,index)=>{if(index===active)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
      lastActive=active;
      document.dispatchEvent(new Event('journeychange'));
    }
  }
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update);}}
  controls.forEach((control,index)=>control.addEventListener('click',event=>{
    event.preventDefault();
    const box=chapters[index].getBoundingClientRect();
    if(location.hash!==control.hash)history.pushState(null,'',control.hash);
    const map=journey.querySelector('.journey-map');
    const stacked=getComputedStyle(journey).display==='block'&&getComputedStyle(map).position==='sticky';
    const mapHeight=map.getBoundingClientRect().height;
    const focusLine=stacked?(88+mapHeight+window.innerHeight)*.5:window.innerHeight*.55;
    window.scrollTo({top:window.scrollY+box.top+box.height/2-focusLine,behavior:reduced.matches?'instant':'smooth'});
  }));
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});reduced.addEventListener('change',schedule);
  update();
});
