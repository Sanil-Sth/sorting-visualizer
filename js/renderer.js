/* ── RENDERER MODULE ── */
// renderStep(n) and DOM helpers — reads state + steps[], writes to DOM only

// Determine bar display color from step context — priority order matters
const getBarColor = (index, step) => {
  if (step.sortedIndices.includes(index))                              return 'var(--bar-sorted)';
  if (step.type === 'swap'    && step.indices.includes(index))         return 'var(--bar-swapping)';
  if (step.type === 'compare' && step.indices.includes(index))         return 'var(--bar-comparing)';
  if (step.type === 'select'  && step.indices.includes(index))         return 'var(--bar-comparing)';
  if (step.type === 'shift'   && step.indices.includes(index))         return 'var(--bar-swapping)';
  if (index === step.pivotIndex)                                       return 'var(--bar-pivot)';
  if (index >= step.activeWindow[0] && index <= step.activeWindow[1]) return 'var(--bar-active)';
  return 'var(--bar-idle)';
};

// Cache DOM element references at startup
const DOM = {
  barChart: null,
  stepDescription: null,
  stepCounter: null,
  callstackFrames: null,
};

// Initialize DOM cache — call once at startup
function initDOM() {
  DOM.barChart        = document.getElementById('bar-chart');
  DOM.stepDescription = document.getElementById('step-description');
  DOM.stepCounter     = document.getElementById('step-counter');
  DOM.callstackFrames = document.getElementById('callstack-frames');
}

// Build the bar chart DOM from the initial array — called on reset
function buildBars(array) {
  DOM.barChart.innerHTML = '';
  const max = Math.max(...array);

  array.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.dataset.index = index;
    bar.style.height = `${(value / max) * 90}%`;
    bar.style.backgroundColor = 'var(--bar-idle)';
    bar.setAttribute('role', 'img');
    bar.setAttribute('aria-label', `Value ${value}`);

    const label = document.createElement('span');
    label.classList.add('bar-label');
    label.textContent = value;

    bar.appendChild(label);
    DOM.barChart.appendChild(bar);
  });

  // Show labels up to 16 bars — beyond that bars are too narrow to fit numbers
  if (array.length <= 16) {
    DOM.barChart.classList.add('bars-show-labels');
  } else {
    DOM.barChart.classList.remove('bars-show-labels');
  }
}

// Get the bar element at a given index
const getBar = (index) =>
  DOM.barChart.querySelector(`.bar[data-index="${index}"]`);

// Apply a color and animation state class to a single bar
function applyBarState(bar, color, stateClass, prevStateClasses) {
  prevStateClasses.forEach(cls => bar.classList.remove(cls));
  bar.style.backgroundColor = color;
  if (stateClass) {
    bar.classList.add(stateClass);
    // Remove animation class after it plays so it can re-trigger
    bar.addEventListener('animationend', () => bar.classList.remove(stateClass), { once: true });
  }
}

// Map step type to CSS animation state class
const stepTypeToStateClass = (type) => {
  const map = {
    swap: 'state-swapping', compare: 'state-comparing',
    sorted: 'state-sorted', pivot_set: 'state-pivot',
    select: 'state-comparing', shift: 'state-swapping',
  };
  return map[type] || null;
};

// Update the transition duration on all bars to match current speed
function updateBarTransitions(speedMs) {
  const colorMs  = Math.max(speedMs * 0.5, 80);
  const heightMs = Math.max(speedMs * 0.7, 100);
  DOM.barChart.querySelectorAll('.bar').forEach(bar => {
    bar.style.transition =
      `height ${heightMs}ms cubic-bezier(0.34,1.56,0.64,1), background-color ${colorMs}ms ease-in-out`;
  });
}

// Render the bar chart for a given step index
function renderBars(stepIndex) {
  const step = state.steps[stepIndex];
  const max  = Math.max(...step.arraySnapshot);
  const allStateClasses = ['state-swapping', 'state-comparing', 'state-sorted', 'state-pivot'];

  step.arraySnapshot.forEach((value, index) => {
    const bar = getBar(index);
    if (!bar) return;

    bar.style.height = `${(value / max) * 90}%`;
    bar.setAttribute('aria-label', `Value ${value}`);
    bar.querySelector('.bar-label').textContent = value;

    const color      = getBarColor(index, step);
    const stateClass = step.indices.includes(index) ? stepTypeToStateClass(step.type) : null;
    applyBarState(bar, color, stateClass, allStateClasses);
  });
}

// Update the step description text
function renderDescription(stepIndex) {
  const step = state.steps[stepIndex];
  DOM.stepDescription.innerHTML = step ? step.description : DEFAULT_DESCRIPTION;
}

// Update the step counter display with a brief tick animation
function renderCounter(stepIndex) {
  DOM.stepCounter.innerHTML =
    `Step <strong>${stepIndex + 1}</strong> of <strong>${state.steps.length}</strong>`;
  DOM.stepCounter.classList.remove('tick');
  void DOM.stepCounter.offsetWidth; // force reflow
  DOM.stepCounter.classList.add('tick');
}

// Build the call stack panel HTML from frame objects
function renderCallStack(stepIndex) {
  const step = state.steps[stepIndex];
  if (!step || !step.callStack || step.callStack.length === 0) {
    DOM.callstackFrames.innerHTML = `<span class="callstack-empty">No active frames</span>`;
    return;
  }

  const visible = step.callStack.slice(-CALLSTACK_DISPLAY_MAX);
  DOM.callstackFrames.innerHTML = visible
    .map((frame, i) => {
      const depthClass = `depth-${i}`;
      const label = frame.label
        ? frame.label
        : `sort(${frame.low}, ${frame.high})`;
      const meta = frame.label
        ? `<span style="opacity:0.5">depth=${frame.depth}</span>`
        : `<span style="opacity:0.5">depth=${frame.depth}</span>`;
      return `<div class="callstack-frame ${depthClass}">${label} ${meta}</div>`;
    })
    .join('');
}

// Main render entry point — updates all UI zones from steps[n]
function renderStep(n) {
  if (!state.steps.length) return;
  const clampedN = Math.max(0, Math.min(n, state.steps.length - 1));
  state.currentStep = clampedN;

  renderBars(clampedN);
  renderDescription(clampedN);
  renderCounter(clampedN);
  renderCallStack(clampedN);
}

// Reset the description and counter to initial state
function renderIdle() {
  DOM.stepDescription.textContent = DEFAULT_DESCRIPTION;
  DOM.stepCounter.innerHTML = `Step <strong>—</strong> of <strong>${state.steps.length}</strong>`;
  DOM.callstackFrames.innerHTML = `<span class="callstack-empty">No active frames</span>`;
}
