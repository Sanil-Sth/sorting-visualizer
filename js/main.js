/* ── MAIN MODULE ── */
// App entry point — init, array generation, wiring everything together

// Generate a random integer between min and max inclusive
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Shuffle an array in-place using Fisher-Yates
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Build a random array of given size
const buildRandom = (size) =>
  Array.from({ length: size }, () => randomInt(VALUE_MIN, VALUE_MAX));

// Build an already-sorted array
const buildSorted = (size) =>
  Array.from({ length: size }, (_, i) => Math.round(VALUE_MIN + (i / (size - 1)) * (VALUE_MAX - VALUE_MIN)));

// Build a reverse-sorted array
const buildReverse = (size) =>
  buildSorted(size).reverse();

// Build a nearly-sorted array with a few random swaps
function buildNearlySorted(size) {
  const arr = buildSorted(size);
  const swaps = Math.max(1, Math.floor(size * 0.15));
  for (let s = 0; s < swaps; s++) {
    const i = randomInt(0, size - 1);
    const j = randomInt(0, size - 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Dispatch to correct builder based on preset name
function buildPresetArray(preset, size) {
  switch (preset) {
    case PRESET_SORTED:  return buildSorted(size);
    case PRESET_REVERSE: return buildReverse(size);
    case PRESET_NEARLY:  return buildNearlySorted(size);
    default:             return buildRandom(size);
  }
}

// Initialize the speed slider display value
function initSpeedSlider() {
  const slider = document.getElementById('speed-slider');
  slider.value = SPEED_MAX_MS - SPEED_DEFAULT_MS + SPEED_MIN_MS;
  document.getElementById('speed-value').textContent = `${SPEED_DEFAULT_MS}ms`;
}

// Initialize the size slider display value
function initSizeSlider() {
  const slider = document.getElementById('size-slider');
  slider.min   = ARRAY_SIZE_MIN;
  slider.max   = ARRAY_SIZE_MAX;
  slider.value = ARRAY_SIZE_DEFAULT;
  document.getElementById('size-value').textContent = ARRAY_SIZE_DEFAULT;
}

// Bootstrap the entire application
function init() {
  initDOM();
  initControls();
  initResizer();
  initSpeedSlider();
  initSizeSlider();

  // Generate initial array and record steps
  state.array = buildPresetArray(PRESET_RANDOM, ARRAY_SIZE_DEFAULT);
  state.steps = recordSort(state.array);
  state.speedMs = SPEED_DEFAULT_MS;

  buildBars(state.array);
  renderIdle();
  updateBarTransitions(state.speedMs);

  // Highlight the default preset
  document.querySelector(`[data-preset="${PRESET_RANDOM}"]`)?.classList.add('active');
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
