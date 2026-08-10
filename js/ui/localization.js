const key = `carousely.interfaceLanguage`;
const translations = {
  ar: {
    [`Content + Design + Personal Branding`]: `محتوى + تصميم + هوية شخصية`,
    [`Turn ideas into LinkedIn carousels people actually stop to read.`]: `حوّل أفكارك إلى كاروسيلات لينكدإن تستحق التوقف عندها.`,
    [`Create Carousel`]: `أنشئ كاروسيل`, [`View Demo`]: `عرض المثال`, [`New carousel`]: `كاروسيل جديد`,
    [`What do you want to post about?`]: `ما الذي تريد نشره؟`, [`Topic or short idea`]: `الموضوع أو الفكرة`,
    [`Paste article, notes, bullets or existing content`]: `الصق مقالة أو ملاحظات أو نقاطًا أو محتوى موجودًا`,
    [`Language`]: `اللغة`, [`Tone`]: `النبرة`, [`Audience`]: `الجمهور`, [`Objective`]: `الهدف`,
    [`Canvas size`]: `حجم التصميم`, [`Change`]: `تغيير`, [`Continue`]: `متابعة`, [`Back`]: `رجوع`,
    [`Structure`]: `البنية`, [`Choose how the story should unfold`]: `اختر كيف تتدرج القصة`,
    [`Hook`]: `الافتتاحية`, [`Select the opening readers cannot ignore`]: `اختر افتتاحية يصعب تجاهلها`,
    [`Regenerate hooks`]: `اقتراح افتتاحيات جديدة`, [`Design system`]: `نظام التصميم`,
    [`Choose a visual direction`]: `اختر اتجاهًا بصريًا`, [`Brand Kit`]: `حزمة الهوية`,
    [`Apply your identity`]: `طبّق هويتك`, [`Generate Carousel`]: `إنشاء الكاروسيل`,
    [`Premium loader`]: `تحميل احترافي`
  },
  en: {}
};

const apply = language => {
  const lang = language === `ar` ? `ar` : `en`;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === `ar` ? `rtl` : `ltr`;
  localStorage.setItem(key, lang);
  const dictionary = translations[lang];
  document.querySelectorAll(`[data-i18n-original]`).forEach(element => { element.textContent = element.dataset.i18nOriginal; });
  if (lang === `ar`) {
    document.querySelectorAll(`#app button, #app a, #app label, #app h1, #app h2, #app h3, #app p, #app small, #app strong, #app span`).forEach(element => {
      if (element.children.length || !element.textContent.trim()) return;
      const source = element.textContent.trim();
      if (!dictionary[source]) return;
      element.dataset.i18nOriginal = source;
      element.textContent = dictionary[source];
    });
  }
};

export function initLocalization() {
  apply(localStorage.getItem(key) || `en`);
  const hydrate = () => {
    const select = document.querySelector(`#language`);
    const saved = localStorage.getItem(key) || `en`;
    if (select && select.dataset.localeHydrated !== `true`) {
      select.value = saved;
      select.dataset.localeHydrated = `true`;
      apply(saved);
    } else apply(saved);
  };
  new MutationObserver(hydrate).observe(document.querySelector(`#app`), { childList: true });
  document.addEventListener(`change`, event => { if (event.target.id === `language`) apply(event.target.value); });
  document.addEventListener(`carousely:language`, event => apply(event.detail));
}
