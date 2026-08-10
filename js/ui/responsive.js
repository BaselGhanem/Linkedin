const breakpoints={mobile:480,tablet:900,desktop:1200};

function modeFor(width){if(width<breakpoints.mobile)return`mobile`;if(width<breakpoints.tablet)return`tablet`;return`desktop`}

function canvasScale(){
  const canvas=document.querySelector(`#slide-canvas`),stage=document.querySelector(`#canvas-stage`);
  if(!canvas||!stage)return null;
  const logicalWidth=Number.parseFloat(canvas.style.width)||1080;
  const logicalHeight=Number.parseFloat(canvas.style.height)||1350;
  const mobile=window.innerWidth<900;
  const horizontalPadding=mobile?24:64;
  const verticalPadding=mobile?24:72;
  return Math.max(.16,Math.min(1,(stage.clientWidth-horizontalPadding)/logicalWidth,(stage.clientHeight-verticalPadding)/logicalHeight));
}

export function initResponsiveExperience(){
  let lastScale=0,frame=0;
  const update=()=>{
    cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
      document.documentElement.dataset.viewport=modeFor(window.innerWidth);
      const scale=canvasScale();
      if(scale&&Math.abs(scale-lastScale)>.015){lastScale=scale;document.dispatchEvent(new CustomEvent(`carousely:autozoom`,{detail:scale}))}
    })
  };
  const observer=new MutationObserver(update);
  observer.observe(document.querySelector(`#app`),{childList:true});
  window.addEventListener(`resize`,update,{passive:true});
  window.addEventListener(`orientationchange`,update,{passive:true});
  document.addEventListener(`click`,event=>{
    if(window.innerWidth>=900)return;
    if(event.target.closest(`.canvas-stage`)){document.querySelector(`#left-panel`)?.classList.remove(`open`);document.querySelector(`#right-panel`)?.classList.remove(`open`)}
    if(event.target.closest(`[data-slide-index]`))document.querySelector(`#left-panel`)?.classList.remove(`open`);
  });
  update();
}
