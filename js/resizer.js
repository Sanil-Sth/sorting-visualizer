/* ── RESIZER MODULE ── */
// Drag handle between controls and chart panels — updates grid-template-columns live

// Default controls width in px — matches layout.css starting value
const RESIZER_DEFAULT_WIDTH      = 460;

// Hard pixel bounds — controls can never go outside this range
const RESIZER_CONTROLS_MIN       = 280;
const RESIZER_CONTROLS_MAX_RATIO = 0.50; // never more than 50% of viewport

// Chart can never collapse below this
const RESIZER_CHART_MIN          = 340;

// Keyboard shortcut key to reset layout
const RESIZER_RESET_KEY          = 'r';

let resizerGrid   = null;
let resizerHandle = null;
let isDragging    = false;
let startX        = 0;
let startWidth    = 0;

// Compute the left offset of the grid container (accounts for page margins)
const getGridLeft = () => resizerGrid.getBoundingClientRect().left;

// Apply a new controls width — clamp strictly to both min and max
function applyWidth(newWidth) {
  const totalWidth  = resizerGrid.offsetWidth;
  const resizerPx   = 6;
  const maxByChart  = totalWidth - RESIZER_CHART_MIN - resizerPx;
  const maxByRatio  = Math.floor(totalWidth * RESIZER_CONTROLS_MAX_RATIO);
  const maxAllowed  = Math.min(maxByChart, maxByRatio);
  const clamped     = Math.max(RESIZER_CONTROLS_MIN, Math.min(newWidth, maxAllowed));
  resizerGrid.style.gridTemplateColumns = `${clamped}px 6px 1fr`;
}

// Snap back to the default width
const resetWidth = () => applyWidth(RESIZER_DEFAULT_WIDTH);

// Derive desired width directly from mouse X position relative to grid
const onMouseMove = (e) => {
  if (!isDragging) return;
  applyWidth(e.clientX - getGridLeft());
};

// Clean up drag state on mouse release
const onMouseUp = () => {
  if (!isDragging) return;
  isDragging = false;
  resizerHandle.classList.remove('dragging');
  document.body.classList.remove('is-resizing');
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
};

// Begin drag on mousedown on the handle
const onMouseDown = (e) => {
  e.preventDefault();
  isDragging = true;
  startX     = e.clientX;
  startWidth = parseFloat(getComputedStyle(resizerGrid).gridTemplateColumns.split(' ')[0]);
  resizerHandle.classList.add('dragging');
  document.body.classList.add('is-resizing');
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

// Keyboard fallback — press R anywhere to reset layout
const onKeyDown = (e) => {
  if (e.key.toLowerCase() === RESIZER_RESET_KEY && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    resetWidth();
  }
};

// Initialize resizer — skip entirely on mobile (≤ 600px), wire events on desktop
function initResizer() {
  if (window.innerWidth <= 600) return;
  resizerGrid   = document.querySelector('.body-split');
  resizerHandle = document.getElementById('resizer');
  if (!resizerGrid || !resizerHandle) return;
  resizerHandle.addEventListener('mousedown', onMouseDown);
  resizerHandle.addEventListener('dblclick', resetWidth);
  document.addEventListener('keydown', onKeyDown);
  // Defer so the browser has painted and offsetWidth is a real number
  requestAnimationFrame(() => applyWidth(RESIZER_DEFAULT_WIDTH));
}
