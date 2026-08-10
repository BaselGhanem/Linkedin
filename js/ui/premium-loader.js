const labels = {
  en: { loading: `Preparing your workspace…`, demo: `Opening the demo carousel…`, generate: `Building your carousel…`, export: `Preparing your export…` },
  ar: { loading: `جارٍ تجهيز مساحة العمل…`, demo: `جارٍ فتح المثال…`, generate: `جارٍ بناء الكاروسيل…`, export: `جارٍ تجهيز التصدير…` }
};

const language = () => document.documentElement.lang === `ar` ? `ar` : `en`;
const messageFor = element => {
  const action = element?.dataset?.action || ``;
  if (action.includes(`demo`)) return `demo`;
  if (action === `next` && element.textContent.includes(`Generate`)) return `generate`;
  if (element?.closest(`[data-export]`)) return `export`;
  return `loading`;
};

const build = () => {
  if (document.querySelector(`#premium-loader`)) return document.querySelector(`#premium-loader`);
  const loader = document.createElement(`div`);
  loader.id = `premium-loader`;
  loader.className = `premium-loader`;
  loader.setAttribute(`aria-live`, `polite`);
  loader.innerHTML = `<div class="premium-loader__card"><div class="premium-loader__mark"><i></i><i></i><i></i></div><strong>Carousely</strong><span data-loader-message></span><div class="premium-loader__track"><b></b></div></div>`;
  document.body.append(loader);
  return loader;
};

export const premiumLoader = {
  show(kind = `loading`) {
    const loader = build();
    loader.querySelector(`[data-loader-message]`).textContent = labels[language()][kind] || labels[language()].loading;
    loader.classList.add(`is-visible`);
    clearTimeout(window.__carouselyLoaderTimer);
  },
  hide(delay = 180) {
    clearTimeout(window.__carouselyLoaderTimer);
    window.__carouselyLoaderTimer = setTimeout(() => build().classList.remove(`is-visible`), delay);
  }
};

export function initPremiumLoader() {
  build();
  document.addEventListener(`click`, event => {
    const button = event.target.closest(`button, a`);
    if (!button || button.disabled) return;
    if (button.matches(`[data-action="demo-en"], [data-action="demo-ar"], [data-action="next"], [data-action="regenerate"], [data-export], [data-action="export"]`)) premiumLoader.show(messageFor(button));
  });
  window.addEventListener(`error`, () => premiumLoader.hide(0));
  window.addEventListener(`unhandledrejection`, () => premiumLoader.hide(0));
  document.addEventListener(`carousely:ready`, () => premiumLoader.hide());
}
