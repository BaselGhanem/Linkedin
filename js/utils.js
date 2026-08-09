export const uid=(prefix=`id`)=>`${prefix}_${Date.now().toString(36)}_${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;
export const clone=value=>structuredClone(value);
export const debounce=(fn,wait=400)=>{let t;return(...args)=>{clearTimeout(t);t=setTimeout(()=>fn(...args),wait)}};
export const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
export const escapeHtml=value=>String(value??``).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':`&quot;`}[c]));
export const textOnly=value=>{const div=document.createElement(`div`);div.textContent=String(value??``);return div.textContent.trim().slice(0,12000)};
export const hexToRgb=hex=>{const h=hex.replace(`#`,``);const n=parseInt(h.length===3?h.split(``).map(x=>x+x).join(``):h,16);return{r:n>>16,g:n>>8&255,b:n&255}};
export const contrast=(a,b)=>{const lum=h=>{const {r,g,b}=hexToRgb(h);return .2126*f(r)+.7152*f(g)+.0722*f(b)};const f=c=>{c/=255;return c<=.03928?c/12.92:((c+.055)/1.055)**2.4};const l1=lum(a),l2=lum(b);return(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)};
export const download=(blob,name)=>{const a=document.createElement(`a`);a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
export const slug=value=>String(value||`carousel`).toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/g,`-`).replace(/^-|-$/g,``);

