import { templates } from '../templates/templates.js';

const structureDetails = {
  Educational: [`Explain clearly`, `Hook → context → insights → takeaway`], Listicle: [`Make it saveable`, `Hook → numbered ideas → CTA`],
  [`Step-by-Step`]: [`Teach a process`, `Hook → steps → recap`], Storytelling: [`Create a narrative`, `Tension → moment → lesson`],
  [`Problem → Solution`]: [`Resolve a pain point`, `Problem → cause → solution`], [`Before → After`]: [`Show a contrast`, `Before → shift → after`],
  [`Myth vs Fact`]: [`Correct a belief`, `Myth → fact → action`], Framework: [`Give a reusable model`, `Hook → framework → application`],
  [`Case Study`]: [`Prove with evidence`, `Challenge → action → result`], Statistics: [`Lead with evidence`, `Number → meaning → action`],
  [`Personal Story`]: [`Make it human`, `Moment → insight → invitation`], [`Thought Leadership`]: [`Share a point of view`, `Claim → reasoning → CTA`],
  Checklist: [`Make it actionable`, `Hook → checklist → save`], Tutorial: [`Teach an outcome`, `Outcome → steps → result`],
  Mistakes: [`Prevent costly errors`, `Hook → mistakes → fix`], [`Best Practices`]: [`Set a higher bar`, `Hook → practices → next move`],
  Comparison: [`Help a decision`, `Option A ↔ Option B → choice`], [`Lessons Learned`]: [`Share earned insight`, `Context → lessons → reflection`],
  [`Contrarian Opinion`]: [`Challenge the default`, `Belief → counterpoint → proof`], [`Data Story`]: [`Turn data into a decision`, `Signal → interpretation → action`]
};

const paletteNames = [`Default`, `Dark`, `Monochrome`];
const setUp = () => {
  document.querySelectorAll(`[data-structure]`).forEach(card => {
    const data = structureDetails[card.dataset.structure];
    if (!data || card.dataset.enhanced) return;
    card.dataset.enhanced = `true`;
    const description = card.querySelector(`.muted`);
    if (description) description.textContent = data[0];
    const outcome = document.createElement(`small`);
    outcome.className = `choice-outcome`;
    outcome.textContent = data[1];
    card.append(outcome);
  });
  const structureGrid = document.querySelector(`.choice-grid`);
  if (structureGrid && !document.querySelector(`#structure-purpose`)) {
    const note = document.createElement(`p`);
    note.id = `structure-purpose`; note.className = `wizard-purpose-note`;
    note.textContent = `Your choice changes the slide roles, order, headlines and the layouts used in the finished carousel.`;
    structureGrid.before(note);
  }
  document.querySelectorAll(`[data-hook]`).forEach(hook => {
    hook.setAttribute(`aria-label`, `Click to edit this hook`);
    hook.classList.add(`hook-editable`);
    if (!hook.parentElement.querySelector(`.hook-edit-hint`)) {
      const hint = document.createElement(`small`); hint.className = `hook-edit-hint`; hint.textContent = `Click text to edit`;
      hook.after(hint);
    }
  });
  const templateGrid = document.querySelector(`.template-grid`);
  if (templateGrid && !document.querySelector(`#palette-chooser`)) {
    const chooser = document.createElement(`div`);
    chooser.id = `palette-chooser`; chooser.className = `palette-chooser`;
    const active = localStorage.getItem(`carousely.templatePalette`) || `Default`;
    chooser.innerHTML = `<span>2. Choose a color palette</span>${paletteNames.map(name => `<button class="palette-choice ${name === active ? `active` : ``}" type="button" data-palette="${name}"><i class="palette-swatch palette-${name.toLowerCase()}"></i>${name}</button>`).join(``)}`;
    templateGrid.after(chooser);
    chooser.addEventListener(`click`, event => {
      const button = event.target.closest(`[data-palette]`); if (!button) return;
      localStorage.setItem(`carousely.templatePalette`, button.dataset.palette);
      chooser.querySelectorAll(`[data-palette]`).forEach(item => item.classList.toggle(`active`, item === button));
      document.querySelectorAll(`[data-template]`).forEach(card => {
        const palette = templates[card.dataset.template]?.palettes?.[button.dataset.palette];
        const preview = card.querySelector(`.template-preview`);
        if (!palette || !preview) return;
        preview.style.background = palette.background;
        preview.style.color = palette.text;
        preview.style.borderLeftColor = palette.primary;
        preview.querySelector(`span`)?.style.setProperty(`color`, palette.primary);
      });
    });
  }
  const brandTitle = [...document.querySelectorAll(`h1`)].find(title => title.textContent.includes(`Apply your identity`));
  if (brandTitle && !document.querySelector(`#brand-purpose`)) {
    const note = document.createElement(`p`); note.id = `brand-purpose`; note.className = `wizard-purpose-note`;
    note.textContent = `A Brand Kit applies your colors, heading and body fonts, plus a recurring footer to every slide. Use it when consistency matters; otherwise choose No Brand Kit.`;
    brandTitle.after(note);
  }
  const canvas = document.querySelector(`#slide-canvas`);
  if (canvas && !document.querySelector(`#edit-direct-tip`)) {
    const tip = document.createElement(`div`); tip.id = `edit-direct-tip`; tip.className = `edit-direct-tip`; tip.textContent = `Tip: click text to edit it. Drag selected elements to move them.`;
    canvas.closest(`.canvas-area`)?.append(tip);
  }
};

export function initWizardExperience() {
  new MutationObserver(setUp).observe(document.querySelector(`#app`), { childList: true, subtree: true });
  document.addEventListener(`carousely:ready`, setUp);
}
