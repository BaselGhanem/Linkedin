import { slideMarkup } from '../editor/render.js';
import { slideFormats } from '../config.js';
import { download, slug } from '../utils.js';

const ensure = key => {
  if (!window[key]) throw new Error(`${key} library did not load. Check your internet connection and try again.`);
};

const dataUrlFromBlob = blob => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error(`The image renderer returned an unreadable file.`));
  reader.readAsDataURL(blob);
});

async function nodeFor(project, slide) {
  const host = document.createElement(`div`);
  host.style.cssText = `position:fixed;left:-20000px;top:0;pointer-events:none`;
  const liveCanvas = document.querySelector(`#slide-canvas`);
  if (liveCanvas?.dataset.slideId === slide.id) {
    const exactClone = liveCanvas.cloneNode(true);
    exactClone.id = `export-slide`;
    exactClone.style.transform = `none`;
    exactClone.style.margin = `0`;
    exactClone.style.boxShadow = `none`;
    exactClone.querySelectorAll(`.selected,.resize-handle`).forEach(node => node.remove());
    host.append(exactClone);
  } else {
    host.innerHTML = slideMarkup(project, slide, { className: `slide-canvas`, id: `export-slide` });
  }
  document.body.append(host);
  await document.fonts.ready;
  return host;
}

async function pngBlob(project, slide, scale = 2) {
  ensure(`htmlToImage`);
  const host = await nodeFor(project, slide);
  try {
    const blob = await window.htmlToImage.toBlob(host.firstElementChild, { pixelRatio: scale, cacheBust: true, backgroundColor: slide.background.color || project.theme.background });
    if (!blob) throw new Error(`The slide could not be rendered as an image.`);
    return blob;
  } finally {
    host.remove();
  }
}

const currentSlide = project => {
  const id = document.querySelector(`#slide-canvas`)?.dataset.slideId;
  return project.slides.find(slide => slide.id === id) || project.slides[project.currentSlideIndex || 0] || project.slides[0];
};

export const exportService = {
  async png(project, currentOnly = false, quality = 2, onProgress = () => {}) {
    const slides = currentOnly ? [currentSlide(project)] : project.slides;
    if (slides.length === 1) {
      download(await pngBlob(project, slides[0], quality), `${slug(project.title)}-${String(project.slides.indexOf(slides[0]) + 1).padStart(2, `0`)}.png`);
      onProgress(1);
      return;
    }
    ensure(`JSZip`);
    const zip = new JSZip();
    for (let index = 0; index < slides.length; index += 1) {
      zip.file(`${String(index + 1).padStart(2, `0`)}-${slug(slides[index].role)}.png`, await pngBlob(project, slides[index], quality));
      onProgress((index + 1) / slides.length);
    }
    download(await zip.generateAsync({ type: `blob` }), `${slug(project.title)}-png.zip`);
  },
  async pdf(project, quality = 1.5, onProgress = () => {}) {
    ensure(`jspdf`);
    const format = slideFormats[project.format] || slideFormats.linkedin;
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: format.width > format.height ? `landscape` : `portrait`, unit: `px`, format: [format.width, format.height], hotfixes: [`px_scaling`] });
    for (let index = 0; index < project.slides.length; index += 1) {
      if (index) pdf.addPage([format.width, format.height], format.width > format.height ? `landscape` : `portrait`);
      const image = await dataUrlFromBlob(await pngBlob(project, project.slides[index], quality));
      pdf.addImage(image, `PNG`, 0, 0, format.width, format.height);
      onProgress((index + 1) / project.slides.length);
    }
    pdf.save(`${slug(project.title)}.pdf`);
  },
  async pptx(project, onProgress = () => {}) {
    ensure(`PptxGenJS`);
    const format = slideFormats[project.format] || slideFormats.linkedin;
    const width = 10;
    const height = width * format.height / format.width;
    const pptx = new PptxGenJS();
    pptx.defineLayout({ name: `CAROUSELY`, width, height });
    pptx.layout = `CAROUSELY`;
    pptx.author = `Carousely`;
    pptx.subject = project.title;
    const scaleX = width / format.width;
    const scaleY = height / format.height;
    const clean = color => (color || `#000000`).replace(`#`, ``);
    for (let index = 0; index < project.slides.length; index += 1) {
      const model = project.slides[index];
      const slide = pptx.addSlide();
      slide.background = { color: clean(model.background.color || project.theme.background) };
      for (const element of model.elements.filter(item => item.visible)) {
        const options = { x: element.x * scaleX, y: element.y * scaleY, w: element.width * scaleX, h: element.height * scaleY, rotate: element.rotation || 0, transparency: Math.round((1 - (element.opacity ?? 1)) * 100) };
        if (element.type === `text`) slide.addText(element.content.text, { ...options, fontFace: element.style.fontFamily, fontSize: Math.max(8, element.style.fontSize * .75), bold: Number(element.style.fontWeight) >= 700, color: clean(element.style.color), align: element.style.align, margin: 0, fit: `shrink`, rtlMode: element.style.direction === `rtl`, valign: `mid` });
        else if (element.type === `shape`) slide.addShape(pptx.ShapeType.rect, { ...options, fill: { color: clean(element.style.fill), transparency: options.transparency }, line: { color: clean(element.style.fill) } });
        else if ([`image`, `logo`].includes(element.type)) slide.addImage({ ...options, data: element.content.src });
        else if (element.type === `chart`) slide.addChart(pptx.ChartType.bar, [{ name: `Series 1`, labels: element.content.data.labels, values: element.content.data.values }], { ...options, catAxisLabelFontSize: 10, valAxisLabelFontSize: 10, showLegend: false, showTitle: false, chartColors: [clean(element.style.color || project.theme.primary)] });
      }
      if (project.master.showPageNumbers) slide.addText(String(index + 1).padStart(2, `0`), { x: width - .9, y: height - .45, w: .45, h: .25, fontSize: 10, bold: true, color: clean(project.theme.muted) });
      onProgress((index + 1) / project.slides.length);
    }
    await pptx.writeFile({ fileName: `${slug(project.title)}.pptx` });
  }
};
