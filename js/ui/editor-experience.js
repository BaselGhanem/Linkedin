const isTyping = target => target?.isContentEditable || [`INPUT`, `TEXTAREA`, `SELECT`].includes(target?.tagName);

const items = () => [...document.querySelectorAll(`.slide-item[data-slide-index]`)];

const updateNavigator = () => {
  const navigator = document.querySelector(`#editor-slide-navigator`);
  const slides = items();
  if (!navigator || !slides.length) return;
  const current = Math.max(0, slides.findIndex(item => item.classList.contains(`active`)));
  navigator.querySelector(`[data-ux-slide-status]`).textContent = `Slide ${current + 1} of ${slides.length}`;
  navigator.querySelector(`[data-ux-slide-prev]`).disabled = current === 0;
  navigator.querySelector(`[data-ux-slide-next]`).disabled = current === slides.length - 1;
};

const move = direction => {
  const slides = items();
  const current = slides.findIndex(item => item.classList.contains(`active`));
  const target = slides[current + direction];
  if (!target) return;
  target.click();
  target.scrollIntoView({ block: `nearest`, behavior: `smooth` });
  requestAnimationFrame(updateNavigator);
};

const addNavigator = () => {
  const area = document.querySelector(`.canvas-area`);
  if (!area || document.querySelector(`#editor-slide-navigator`)) return;
  const navigator = document.createElement(`div`);
  navigator.id = `editor-slide-navigator`;
  navigator.className = `editor-slide-navigator`;
  navigator.innerHTML = `<button class="btn btn-sm" type="button" data-ux-slide-prev aria-label="Previous slide">←</button><span data-ux-slide-status></span><button class="btn btn-sm" type="button" data-ux-slide-next aria-label="Next slide">→</button>`;
  area.append(navigator);
  updateNavigator();
};

export function initEditorExperience() {
  const observer = new MutationObserver(() => {
    addNavigator();
    updateNavigator();
  });
  observer.observe(document.querySelector(`#app`), { childList: true, subtree: true });
  document.addEventListener(`click`, event => {
    if (event.target.closest(`[data-ux-slide-prev]`)) move(-1);
    if (event.target.closest(`[data-ux-slide-next]`)) move(1);
    if (event.target.closest(`.slide-item`)) requestAnimationFrame(updateNavigator);
  });
  document.addEventListener(`keydown`, event => {
    if (isTyping(event.target)) return;
    if (event.key === `PageDown` || (event.altKey && event.key === `ArrowRight`)) { event.preventDefault(); move(1); }
    if (event.key === `PageUp` || (event.altKey && event.key === `ArrowLeft`)) { event.preventDefault(); move(-1); }
  });
}
