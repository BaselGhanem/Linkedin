import { templates } from '../templates/templates.js';
import { slideFormats } from '../config.js';
import { clamp, escapeHtml } from '../utils.js';

const decorative = (template, theme) => {
  const style = template.style;
  const common = `pointer-events:none;position:absolute;z-index:0`;
  if (style === `bold`) return `<div style="${common};right:-130px;bottom:60px;width:430px;height:430px;border:72px solid ${theme.primary};border-radius:50%"></div><div style="${common};left:70px;top:72px;width:90px;height:12px;background:${theme.accent}"></div>`;
  if (style === `editorial`) return `<div style="${common};left:70px;top:70px;width:140px;height:10px;background:${theme.primary}"></div><div style="${common};right:75px;top:70px;font:700 20px serif;letter-spacing:5px;color:${theme.muted}">CAROUSELY / EDITORIAL</div><div style="${common};right:-120px;bottom:-120px;width:360px;height:360px;border:1px solid ${theme.primary};transform:rotate(28deg)"></div>`;
  if (style === `gradient`) return `<div style="${common};inset:0;background:radial-gradient(circle at 86% 8%,${theme.primary}66,transparent 36%),radial-gradient(circle at 8% 92%,${theme.accent}44,transparent 32%)"></div><div style="${common};inset:45px;border:1px solid ${theme.primary}33;border-radius:28px"></div>`;
  if (style === `premium`) return `<div style="${common};inset:38px;border:1px solid ${theme.primary}88"></div><div style="${common};inset:56px;border:1px solid ${theme.primary}2f"></div><div style="${common};left:56px;top:56px;width:110px;height:3px;background:${theme.accent}"></div><div style="${common};right:56px;bottom:56px;width:110px;height:3px;background:${theme.accent}"></div>`;
  if (style === `data` || style === `infographic`) return `<div style="${common};right:0;top:0;width:250px;height:250px;background:${theme.primary};clip-path:polygon(100% 0,100% 100%,0 0)"></div><div style="${common};left:70px;bottom:90px;width:260px;height:1px;background:${theme.primary}55"></div>`;
  if (style === `split`) return `<div style="${common};left:0;top:0;width:35%;height:100%;background:${theme.primary}12"></div><div style="${common};left:35%;top:80px;bottom:80px;width:1px;background:${theme.primary}66"></div>`;
  if (style === `quote`) return `<div style="${common};left:55px;top:80px;font:900 260px Georgia;color:${theme.primary}20">“</div><div style="${common};right:65px;bottom:80px;width:180px;height:6px;background:${theme.primary}"></div>`;
  if (style === `framework` || style === `steps`) return `<div style="${common};right:70px;top:70px;width:170px;height:170px;border:30px solid ${theme.primary}18;transform:rotate(45deg)"></div>`;
  return `<div style="${common};left:0;top:0;width:14px;height:100%;background:${theme.primary}"></div><div style="${common};right:64px;top:64px;width:38px;height:38px;border:8px solid ${theme.primary};border-radius:50%"></div>`;
};

const estimateFontSize = (text, width, height, preferred, minimum) => {
  const characters = Math.max(1, String(text || ``).replace(/\s+/g, ` `).length);
  for (let size = preferred; size >= minimum; size -= 2) {
    const perLine = Math.max(8, Math.floor(width / (size * .57)));
    const lines = Math.ceil(characters / perLine);
    if (lines * size * 1.18 <= height) return size;
  }
  return minimum;
};

const setTextBox = (element, box, preferred, minimum, color, weight) => {
  if (!element) return;
  element.x = box.x;
  element.y = box.y;
  element.width = box.width;
  element.height = box.height;
  element.zIndex = Math.max(2, element.zIndex || 2);
  element.style.fontSize = estimateFontSize(element.content.text, box.width, box.height, preferred, minimum);
  element.style.lineHeight = 1.14;
  element.style.color = color;
  element.style.fontWeight = weight;
};

const layoutSlideText = (project, slide, template) => {
  const text = slide.elements.filter(element => element.type === `text`);
  const [title, body, footer] = text;
  const isHook = slide.role === `hook`;
  const isData = [`statistic`, `chart`, `comparison`, `framework`].includes(slide.role);
  const direction = project.direction === `rtl` ? `right` : `left`;
  const headingFont = project.language === `ar` ? `Almarai` : template.typography.heading;
  const bodyFont = project.language === `ar` ? `Almarai` : template.typography.body;
  if (title) {
    title.style.fontFamily = headingFont;
    title.style.direction = project.direction;
    title.style.align = direction;
  }
  if (body) {
    body.style.fontFamily = bodyFont;
    body.style.direction = project.direction;
    body.style.align = direction;
  }
  if (footer) {
    footer.style.fontFamily = bodyFont;
    footer.style.direction = project.direction;
    footer.style.align = direction;
  }
  if (template.style === `bold`) {
    setTextBox(title, { x: 96, y: isHook ? 225 : 175, width: 888, height: isHook ? 420 : 290 }, 88, 42, project.theme.text, 800);
    if (title) title.style.align = `center`;
    setTextBox(body, { x: 120, y: isHook ? 760 : 560, width: 840, height: 260 }, 36, 24, project.theme.text, 500);
    if (body) body.style.align = `center`;
  } else if (template.style === `editorial`) {
    setTextBox(title, { x: 100, y: isHook ? 270 : 190, width: 680, height: isHook ? 390 : 260 }, 72, 38, project.theme.text, 800);
    setTextBox(body, { x: 100, y: isHook ? 760 : 520, width: 650, height: 370 }, 38, 24, project.theme.text, 400);
  } else if (template.style === `split`) {
    setTextBox(title, { x: 105, y: 190, width: 760, height: isHook ? 360 : 250 }, 68, 38, project.theme.text, 800);
    setTextBox(body, { x: 420, y: isHook ? 650 : 500, width: 510, height: 350 }, 36, 24, project.theme.text, 500);
  } else if (template.style === `quote`) {
    setTextBox(title, { x: 135, y: 300, width: 810, height: 400 }, 72, 40, project.theme.text, 800);
    if (title) title.style.align = `center`;
    setTextBox(body, { x: 160, y: 780, width: 760, height: 190 }, 30, 22, project.theme.muted, 600);
    if (body) body.style.align = `center`;
  } else if (isHook) {
    setTextBox(title, { x: 86, y: 220, width: 900, height: 390 }, 76, 44, project.theme.text, 800);
    setTextBox(body, { x: 86, y: 700, width: 820, height: 110 }, 32, 24, project.theme.muted, 600);
  } else if (isData) {
    setTextBox(title, { x: 86, y: 125, width: 900, height: 185 }, 64, 38, project.theme.text, 800);
    setTextBox(body, { x: 86, y: 330, width: 860, height: 145 }, 34, 24, project.theme.muted, 500);
  } else {
    setTextBox(title, { x: 86, y: 125, width: 900, height: 230 }, 64, 38, project.theme.text, 800);
    setTextBox(body, { x: 86, y: 445, width: 900, height: 560 }, 40, 24, project.theme.text, 400);
  }
  if (footer) setTextBox(footer, { x: 86, y: 1248, width: 320, height: 38 }, 20, 16, project.theme.muted, 600);
};

export function applyTemplate(project, templateId) {
  const template = templates[templateId] || templates.minimalProfessional;
  const paletteId = localStorage.getItem(`carousely.templatePalette`) || `Default`;
  const palette = template.palettes[paletteId] || template.palettes.Default;
  project.templateId = templateId;
  project.theme = { ...palette };
  project.slides.forEach(slide => {
    slide.layout = template.layouts[slide.role] || `content`;
    slide.background.color = project.theme.background;
    layoutSlideText(project, slide, template);
    slide.layoutVersion = 2;
    if ([`statistic`, `chart`].includes(slide.role) && !slide.elements.some(element => element.type === `shape`)) {
      slide.elements.unshift({ id: `shape_${slide.id}`, type: `shape`, x: 80, y: 510, width: 920, height: 380, rotation: 0, opacity: 1, zIndex: 1, visible: true, locked: false, content: { shape: `rect` }, style: { fill: project.theme.primary, radius: template.geometry.radius } });
    }
  });
  return project;
}

export function elementMarkup(element, selected = false, editable = false) {
  const style = element.style || {};
  const common = `left:${element.x}px;top:${element.y}px;width:${element.width}px;height:${element.height}px;transform:rotate(${element.rotation || 0}deg);opacity:${element.opacity ?? 1};z-index:${element.zIndex || 1};`;
  if (element.type === `text`) return `<div class="canvas-element ${selected ? `selected` : ``} ${element.locked ? `locked` : ``}" data-element-id="${element.id}" data-type="text" ${editable && !element.locked ? `contenteditable="plaintext-only"` : ``} spellcheck="false" style="${common}font-family:${style.fontFamily};font-size:${style.fontSize}px;font-weight:${style.fontWeight};color:${style.color};text-align:${style.align};line-height:${style.lineHeight};direction:${style.direction};">${escapeHtml(element.content.text)}</div>`;
  if (element.type === `shape`) return `<div class="canvas-element ${selected ? `selected` : ``}" data-element-id="${element.id}" data-type="shape" style="${common}background:${style.fill};border-radius:${style.radius || 0}px"></div>`;
  if (element.type === `image` || element.type === `logo`) return `<div class="canvas-element ${selected ? `selected` : ``}" data-element-id="${element.id}" data-type="${element.type}" style="${common}"><img src="${element.content.src}" alt="" style="width:100%;height:100%;object-fit:${style.fit || `cover`};border-radius:${style.radius || 0}px"></div>`;
  if (element.type === `chart`) {
    const maximum = Math.max(...element.content.data.values, 1);
    return `<div class="canvas-element ${selected ? `selected` : ``}" data-element-id="${element.id}" data-type="chart" style="${common}display:flex;align-items:end;gap:22px;padding:30px;background:${style.background || `#fff`}">${element.content.data.values.map((value, index) => `<div style="flex:1;height:${value / maximum * 80}%;background:${style.color};position:relative"><span style="position:absolute;bottom:-28px;font-size:18px">${escapeHtml(element.content.data.labels[index])}</span></div>`).join(``)}</div>`;
  }
  return ``;
}

export function slideMarkup(project, slide, { selectedId = null, editable = false, includeControls = false, id = `slide-canvas`, className = `slide-canvas` } = {}) {
  const template = templates[project.templateId] || templates.minimalProfessional;
  if (slide.layoutVersion !== 2) {
    layoutSlideText(project, slide, template);
    slide.layoutVersion = 2;
  }
  const format = slideFormats[project.format] || slideFormats.linkedin;
  const withMasterFooter = slide.elements.map(element => {
    const isFooter = element.type === `text` && (element.y > format.height * .86 || element.content.text === `Carousely`);
    return isFooter && project.master.footer ? { ...element, content: { ...element.content, text: project.master.footer } } : element;
  });
  const elements = withMasterFooter.filter(element => element.visible).sort((left, right) => left.zIndex - right.zIndex).map(element => elementMarkup(element, element.id === selectedId, editable)).join(``);
  const position = project.slides.indexOf(slide);
  const hiddenByMaster = (slide.role === `hook` && project.master.hideOnCover) || (slide.role === `cta` && project.master.hideOnCTA);
  const progress = project.master.showProgress && !hiddenByMaster ? `<div style="position:absolute;left:0;bottom:0;height:10px;width:${(position + 1) / project.slides.length * 100}%;background:${project.theme.primary};z-index:30"></div>` : ``;
  const page = project.master.showPageNumbers && !hiddenByMaster ? `<div style="position:absolute;right:68px;bottom:44px;font:700 22px ${project.language === `ar` ? `Almarai` : `Inter`};color:${project.theme.muted};z-index:30">${String(position + 1).padStart(2, `0`)}</div>` : ``;
  return `<div id="${id}" class="${className}" data-slide-id="${slide.id}" style="width:${format.width}px;height:${format.height}px;background:${slide.background.color || project.theme.background};direction:${project.direction}">${decorative(template, project.theme)}${elements}${page}${progress}${includeControls && selectedId ? `<span class="resize-handle nw" data-handle="nw"></span><span class="resize-handle se" data-handle="se"></span>` : ``}</div>`;
}
