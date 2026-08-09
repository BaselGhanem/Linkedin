import { slideFormats } from '../config.js';
import { clamp } from '../utils.js';

const formatCards = selected => Object.entries(slideFormats).map(([id,format]) => `
  <button class="size-card ${id===selected?`active`:``}" data-select-format="${id}">
    <span class="size-ratio" style="aspect-ratio:${format.width}/${format.height}"></span>
    <span><strong>${format.name}</strong><small>${format.width} × ${format.height} px · ${format.ratio}</small><em>${format.bestFor}</em></span>
    ${format.recommended?`<b>Recommended</b>`:``}
  </button>`).join(``);

export function resizeProject(project,targetId){
  const source=slideFormats[project.format]||slideFormats.linkedin;
  const target=slideFormats[targetId];
  if(!target||project.format===targetId)return project;
  const scaleX=target.width/source.width,scaleY=target.height/source.height,fontScale=Math.min(scaleX,scaleY);
  project.slides.forEach(slide=>slide.elements.forEach(element=>{
    element.x=clamp(element.x*scaleX,0,target.width-40);
    element.y=clamp(element.y*scaleY,0,target.height-40);
    element.width=clamp(element.width*scaleX,40,target.width-element.x);
    element.height=clamp(element.height*scaleY,30,target.height-element.y);
    if(element.type===`text`)element.style.fontSize=clamp(Math.round(element.style.fontSize*fontScale),14,180);
  }));
  project.format=targetId;
  return project;
}

export function initSizeExperience({getProject,onResize}){
  const selected=()=>getProject()?.format||localStorage.getItem(`carousely.selectedFormat`)||`linkedin`;
  const openGuide=()=>{
    const backdrop=document.createElement(`div`);backdrop.className=`modal-backdrop`;
    backdrop.innerHTML=`<section class="modal size-guide"><div class="modal-head row between"><div><div class="eyebrow">Size masterclass</div><h2>Choose the right canvas for the platform</h2><p class="muted">Start with the destination. Carousely keeps logical coordinates and safely rescales every editable object.</p></div><button class="btn btn-ghost" data-close-size>×</button></div><div class="modal-body"><div class="size-grid">${formatCards(selected())}</div><div class="size-course"><article><b>01</b><h3>LinkedIn</h3><p><strong>1080 × 1350</strong> is the primary recommendation. The 4:5 portrait ratio occupies more mobile feed space and gives educational content room to breathe.</p></article><article><b>02</b><h3>Instagram</h3><p>Use <strong>1080 × 1350</strong> for feed impact, <strong>1080 × 1080</strong> for reusable square assets, and <strong>1080 × 1920</strong> for Stories.</p></article><article><b>03</b><h3>Presentations</h3><p>Use <strong>1600 × 900</strong> for 16:9 screens, webinars and editable PowerPoint decks. Keep critical content inside a 5% safe area.</p></article><article><b>04</b><h3>Practical rule</h3><p>Portrait for mobile reading, square for cross-platform reuse, vertical for full-screen stories, and widescreen for meetings.</p></article></div></div></section>`;
    document.body.append(backdrop);
    backdrop.onclick=event=>{if(event.target===backdrop||event.target.closest(`[data-close-size]`))backdrop.remove();const choice=event.target.closest(`[data-select-format]`);if(!choice)return;const id=choice.dataset.selectFormat;localStorage.setItem(`carousely.selectedFormat`,id);const active=getProject();if(active)onResize(id);backdrop.remove()};
  };
  document.addEventListener(`click`,event=>{if(event.target.closest(`[data-size-guide]`))openGuide()});
  const observer=new MutationObserver(()=>{
    const nav=document.querySelector(`.site-header nav`);if(nav&&!nav.querySelector(`[data-size-guide]`)){const b=document.createElement(`button`);b.className=`btn btn-ghost`;b.dataset.sizeGuide=``;b.textContent=`Size Guide`;nav.prepend(b)}
    const top=document.querySelector(`.editor-top`),exportButton=top?.querySelector(`[data-act="export"]`);if(top&&exportButton&&!top.querySelector(`[data-size-guide]`)){const b=document.createElement(`button`);b.className=`btn btn-sm`;b.dataset.sizeGuide=``;b.innerHTML=`▣ <span class="hide-tablet">Size</span>`;exportButton.before(b)}
    const firstStep=document.querySelector(`#topic`)?.closest(`.stack`);if(firstStep&&!firstStep.querySelector(`.wizard-size-choice`)){const card=document.createElement(`button`);card.type=`button`;card.className=`choice wizard-size-choice`;card.dataset.sizeGuide=``;const f=slideFormats[selected()];card.innerHTML=`<span><strong>Canvas size</strong><small>${f.name} · ${f.width} × ${f.height} px</small></span><b>Change</b>`;firstStep.append(card)}
  });
  observer.observe(document.querySelector(`#app`),{childList:true,subtree:true});
}
