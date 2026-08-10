import { makeSlide } from '../models/project.js';

const splitIdeas = text => String(text || ``).split(/\n|[.!؟]\s+/).map(item => item.replace(/^[-•\d.)\s]+/, ``).trim()).filter(Boolean);
const isArabic = text => /[\u0600-\u06ff]/.test(text);
const hookRuns = new Map();

const hookBatches = {
  en: [
    topic => [`Stop approaching ${topic} this way.`, `The practical guide to ${topic}.`, `Most professionals get ${topic} wrong.`, `Before your next decision, understand ${topic}.`, `7 lessons that change how you see ${topic}.`, `Why ${topic} is not producing the results you expect.`],
    topic => [`The ${topic} mistake that quietly costs you results.`, `I wish I knew this before working on ${topic}.`, `Your next ${topic} decision starts here.`, `The uncomfortable truth about ${topic}.`, `A better way to think about ${topic}.`, `If ${topic} feels harder than it should, read this.`],
    topic => [`Nobody tells you this about ${topic}.`, `The simple ${topic} system high performers use.`, `What separates average from excellent ${topic}.`, `The ${topic} checklist I use before publishing.`, `You do not need more effort. You need this ${topic} shift.`, `Save this before your next ${topic} project.`]
  ],
  ar: [
    topic => [`توقف عن التعامل مع ${topic} بهذه الطريقة.`, `الدليل العملي لفهم ${topic}.`, `أغلب المحترفين يخطئون في ${topic}.`, `قبل قرارك القادم، افهم ${topic}.`, `7 أفكار تغيّر طريقة نظرك إلى ${topic}.`, `لماذا لا تحقق ${topic} النتائج التي تتوقعها؟`],
    topic => [`خطأ واحد في ${topic} قد يكلّفك النتائج.`, `ليتني عرفت هذا قبل أن أبدأ في ${topic}.`, `قرارك القادم في ${topic} يبدأ من هنا.`, `الحقيقة غير المريحة عن ${topic}.`, `طريقة أذكى للتفكير في ${topic}.`, `إذا شعرت أن ${topic} أصعب مما يجب، اقرأ هذا.`],
    topic => [`لا أحد يخبرك بهذا عن ${topic}.`, `نظام بسيط لـ ${topic} يستخدمه المحترفون.`, `ما الذي يفرق بين العادي والمتميز في ${topic}؟`, `قائمة ${topic} التي أراجعها قبل النشر.`, `لا تحتاج جهدًا أكبر، بل تحتاج تغييرًا في ${topic}.`, `احفظ هذا قبل مشروعك القادم في ${topic}.`]
  ]
};

const structureRoles = {
  Educational: [`hook`, `intro`, `insight`, `insight`, `insight`, `summary`, `cta`],
  Listicle: [`hook`, `intro`, `insight`, `insight`, `insight`, `insight`, `cta`],
  [`Step-by-Step`]: [`hook`, `intro`, `step`, `step`, `step`, `summary`, `cta`],
  Storytelling: [`hook`, `problem`, `insight`, `insight`, `quote`, `summary`, `cta`],
  [`Problem → Solution`]: [`hook`, `problem`, `problem`, `insight`, `insight`, `summary`, `cta`],
  [`Before → After`]: [`hook`, `comparison`, `comparison`, `insight`, `summary`, `cta`],
  [`Myth vs Fact`]: [`hook`, `comparison`, `comparison`, `insight`, `summary`, `cta`],
  Framework: [`hook`, `intro`, `framework`, `framework`, `insight`, `summary`, `cta`],
  [`Case Study`]: [`hook`, `problem`, `insight`, `statistic`, `summary`, `cta`],
  Statistics: [`hook`, `statistic`, `chart`, `insight`, `summary`, `cta`],
  [`Personal Story`]: [`hook`, `quote`, `insight`, `insight`, `summary`, `cta`],
  [`Thought Leadership`]: [`hook`, `quote`, `insight`, `insight`, `summary`, `cta`],
  Checklist: [`hook`, `intro`, `step`, `step`, `step`, `summary`, `cta`],
  Tutorial: [`hook`, `intro`, `step`, `step`, `step`, `summary`, `cta`],
  Mistakes: [`hook`, `intro`, `mistake`, `mistake`, `mistake`, `summary`, `cta`],
  [`Best Practices`]: [`hook`, `intro`, `insight`, `insight`, `insight`, `summary`, `cta`],
  Comparison: [`hook`, `comparison`, `comparison`, `insight`, `summary`, `cta`],
  [`Lessons Learned`]: [`hook`, `intro`, `insight`, `insight`, `summary`, `cta`],
  [`Contrarian Opinion`]: [`hook`, `quote`, `problem`, `insight`, `summary`, `cta`],
  [`Data Story`]: [`hook`, `statistic`, `chart`, `insight`, `summary`, `cta`]
};

const fitRoles = (roles, count) => {
  const core = roles || structureRoles.Educational;
  if (count <= core.length) return core.slice(0, count);
  return [...core.slice(0, -2), ...Array(count - core.length).fill(core.includes(`step`) ? `step` : `insight`), ...core.slice(-2)];
};

export const aiService = {
  async generateHooks({ topic, tone = `Professional` }) {
    const subject = String(topic || ``).trim() || `your topic`;
    const ar = isArabic(subject);
    const key = `${ar ? `ar` : `en`}:${subject.toLowerCase()}:${tone}`;
    const run = hookRuns.get(key) || 0;
    hookRuns.set(key, run + 1);
    const batches = hookBatches[ar ? `ar` : `en`];
    const hooks = batches[run % batches.length](subject);
    if (tone === `Bold` || tone === `Provocative`) return hooks.map((hook, index) => index % 2 ? hook : `${hook.replace(/[.!؟]$/, ``)} ${ar ? `— وهذا ما يتجاهله كثيرون.` : `— and most people still miss it.`}`);
    if (tone === `Executive`) return hooks.map(hook => `${ar ? `قرار أفضل يبدأ هنا: ` : `A better decision starts here: `}${hook}`);
    return hooks;
  },
  async generateCarousel({ topic, content, hook, count = 7, structure = `Educational`, language = `en`, audience = `General LinkedIn Audience`, objective = `Educate` }) {
    const source = String(content || topic || ``).trim() || (language === `ar` ? `فكرة تستحق المشاركة` : `An idea worth sharing`);
    const ar = language === `ar` || isArabic(source);
    const ideas = splitIdeas(source);
    const generic = ar ? [`ابدأ بالهدف لا بالأداة`, `بسّط الرسالة الرئيسية`, `استخدم دليلًا واضحًا`, `رتّب المعلومات حول القرار`, `اختبر الفهم قبل النشر`, `راجع التفاصيل بعين القارئ`] : [`Start with the outcome, not the tool`, `Simplify the core message`, `Use evidence, not decoration`, `Order information around the decision`, `Test comprehension before publishing`, `Review through the reader's eyes`];
    const points = [...ideas, ...generic];
    const intro = ar ? `هذه الخلاصة صُممت لـ ${audience}. ركّز على النقطة التي تؤثر في قرارك التالي.` : `Built for ${audience}: focus on the point that changes your next decision.`;
    const ctaByObjective = ar ? { Educate: `ما النقطة التي ستطبقها أولًا؟ شارك رأيك.`, [`Build Authority`]: `احفظ هذا الدليل وشاركه مع فريقك.`, [`Generate Engagement`]: `هل تتفق أم تختلف؟ اكتب رأيك.`, [`Generate Leads`]: `إذا أردت تطبيق هذا على عملك، أرسل رسالة.`, [`Promote Service`]: `هل تحتاج مساعدة لتطبيق ذلك؟ تواصل معي.`, [`Promote Course`]: `اكتب “مهتم” لأرسل لك تفاصيل الدورة.`, [`Share Case Study`]: `أي نتيجة تريد أن نحللها في المرة القادمة؟`, [`Tell a Story`]: `هل مررت بتجربة مشابهة؟`, [`Explain Concept`]: `احفظ هذا المرجع للعودة إليه.` } : { Educate: `Which point will you apply first? Share your take.`, [`Build Authority`]: `Save this guide and share it with your team.`, [`Generate Engagement`]: `Do you agree or disagree? Add your view.`, [`Generate Leads`]: `Want this applied to your work? Send a message.`, [`Promote Service`]: `Need help applying this? Let’s talk.`, [`Promote Course`]: `Comment “interested” for course details.`, [`Share Case Study`]: `What result should we analyze next?`, [`Tell a Story`]: `Have you had a similar experience?`, [`Explain Concept`]: `Save this reference for later.` };
    const roles = fitRoles(structureRoles[structure], count);
    return roles.map((role, index) => {
      if (role === `hook`) return makeSlide(role, hook || source, ar ? `اسحب لاكتشاف الفكرة خطوة بخطوة ←` : `Swipe for the practical breakdown →`);
      if (role === `intro`) return makeSlide(role, ar ? `ابدأ من هنا` : `Start here`, intro);
      if (role === `summary`) return makeSlide(role, ar ? `الخلاصة` : `The takeaway`, points.slice(0, 3).map((point, pointIndex) => `${pointIndex + 1}. ${point}`).join(`\n`));
      if (role === `cta`) return makeSlide(role, ar ? `دورك الآن` : `Your turn`, ctaByObjective[objective] || ctaByObjective.Educate);
      const point = points[(index - 2) % points.length];
      const label = role === `mistake` ? (ar ? `خطأ ${index - 1}` : `Mistake ${index - 1}`) : role === `step` ? (ar ? `خطوة ${index - 1}` : `Step ${index - 1}`) : role === `problem` ? (ar ? `المشكلة` : `The problem`) : role === `comparison` ? (ar ? `قارن قبل أن تقرر` : `Compare before deciding`) : role === `framework` ? (ar ? `إطار العمل` : `The framework`) : role === `statistic` ? (ar ? `الرقم الذي يهم` : `The number that matters`) : role === `chart` ? (ar ? `ماذا يقول الاتجاه؟` : `What the trend shows`) : point;
      return makeSlide(role, `${label}: ${point}`, ar ? `حوّل هذه الفكرة إلى خطوة واضحة قابلة للتطبيق والقياس.` : `Turn this point into a clear action you can apply and measure.`);
    });
  },
  async rewriteSlide({ text, action }) {
    const value = text.trim();
    if (action === `Shorten`) return value.split(/\s+/).slice(0, Math.max(5, Math.ceil(value.split(/\s+/).length * .65))).join(` `);
    if (action === `Turn Into Bullets`) return splitIdeas(value).map(item => `• ${item}`).join(`\n`);
    if (action === `Make Bold`) return `${value.replace(/[.!]$/, ``)} — and most people still ignore it.`;
    if (action === `Simplify`) return value.replace(/\b(utilize|facilitate|approximately|therefore)\b/gi, match => ({ utilize: `use`, facilitate: `help`, approximately: `about`, therefore: `so` }[match.toLowerCase()]));
    return value;
  },
  async translateCarousel() { throw new Error(`No translation provider is configured. Switch direction and translate text manually.`); },
  async generateLinkedInPost(project) {
    const hook = project.slides[0]?.semantic?.title || project.title;
    const points = project.slides.slice(1, -1).map(slide => slide.semantic?.title).filter(Boolean).slice(0, 5);
    return { hook, caption: `${hook}\n\n${points.map(point => `• ${point}`).join(`\n`)}\n\nThe best carousel is not the busiest one. It is the one that makes the next decision easier.`, cta: project.slides.at(-1)?.semantic?.body || `What would you add?`, hashtags: [`#LinkedIn`, `#ContentStrategy`, `#PersonalBranding`], short: `${hook}\n\n${points.slice(0, 3).join(` • `)}` };
  }
};

export const backgroundRemovalService = { async removeBackground() { throw new Error(`Background removal needs an external provider. Your original image was not changed.`); } };
