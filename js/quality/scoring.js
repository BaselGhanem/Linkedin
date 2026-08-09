import { contrast } from '../utils.js';

export function scoreProject(project) {
  const issues = [];
  const scores = { Hook: 100, Readability: 100, "Text Density": 100, "Visual Hierarchy": 100, Branding: 100, CTA: 100, Consistency: 100, Accessibility: 100 };
  const hook = project.slides.find(slide => slide.role === `hook`);
  if (!hook || (hook.semantic?.title || ``).length < 18) {
    scores.Hook -= 35;
    issues.push({ slideId: hook?.id, message: `Hook is too short to establish tension or value.` });
  }
  project.slides.forEach((slide, index) => {
    const text = slide.elements.filter(element => element.type === `text`).map(element => element.content.text).join(` `);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    if (words > 85) {
      const over = Math.round((words - 85) / 85 * 100);
      scores[`Text Density`] -= Math.min(30, over);
      issues.push({ slideId: slide.id, message: `Slide ${index + 1} contains ${over}% more text than the recommended threshold.` });
    }
    if (slide.elements.some(element => element.type === `text` && element.style.fontSize < 24)) {
      scores.Readability -= 8;
      issues.push({ slideId: slide.id, message: `Slide ${index + 1} uses text below the recommended 24 px minimum.` });
    }
    slide.elements.filter(element => element.type === `text`).forEach(element => {
      const ratio = contrast(element.style.color || project.theme.text, slide.background.color || project.theme.background);
      if (ratio < 4.5) {
        scores.Accessibility -= 10;
        issues.push({ slideId: slide.id, message: `Slide ${index + 1} has low foreground/background contrast (${ratio.toFixed(1)}:1).` });
      }
    });
  });
  const cta = project.slides.find(slide => slide.role === `cta`);
  if (!cta || !/comment|share|save|follow|download|tell|رأيك|شارك|احفظ|تابع/i.test(`${cta.semantic?.title} ${cta.semantic?.body}`)) {
    scores.CTA -= 35;
    issues.push({ slideId: cta?.id, message: `CTA slide does not include a clear reader action.` });
  }
  if (!project.brandKitId) {
    scores.Branding -= 18;
    issues.push({ slideId: project.slides[0]?.id, message: `No Brand Kit is applied.` });
  }
  Object.keys(scores).forEach(key => scores[key] = Math.max(0, Math.round(scores[key])));
  return { total: Math.round(Object.values(scores).reduce((sum, value) => sum + value, 0) / Object.keys(scores).length), categories: scores, issues };
}
