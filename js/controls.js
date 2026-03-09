/* ── CONTROLS MODULE ── */
// All event listeners and UI wiring — calls algorithm + renderer, no logic itself

// Cache interactive control elements
const CTRL = {
  btnPlayPause:  null,
  btnNext:       null,
  btnPrev:       null,
  btnReset:      null,
  speedSlider:   null,
  speedValue:    null,
  sizeSlider:    null,
  sizeValue:     null,
  customInput:   null,
  btnApply:      null,
  errorMsg:      null,
  presetBtns:    null,
};

// Initialize control element cache
function initControls() {
  CTRL.btnPlayPause = document.getElementById('btn-play-pause');
  CTRL.btnNext      = document.getElementById('btn-next');
  CTRL.btnPrev      = document.getElementById('btn-prev');
  CTRL.btnReset     = document.getElementById('btn-reset');
  CTRL.speedSlider  = document.getElementById('speed-slider');
  CTRL.speedValue   = document.getElementById('speed-value');
  CTRL.sizeSlider   = document.getElementById('size-slider');
  CTRL.sizeValue    = document.getElementById('size-value');
  CTRL.customInput  = document.getElementById('custom-input');
  CTRL.btnApply     = document.getElementById('btn-apply-custom');
  CTRL.errorMsg     = document.getElementById('custom-error');
  CTRL.presetBtns   = document.querySelectorAll('.btn-preset');
  wireListeners();
}

// Set disabled state on all non-speed controls when playing
function setPlayingMode(playing) {
  const disableList = [CTRL.btnNext, CTRL.btnPrev, CTRL.btnReset, CTRL.sizeSlider, CTRL.customInput, CTRL.btnApply, ...CTRL.presetBtns];
  disableList.forEach(el => { if (el) el.disabled = playing; });
}

// Update the play/pause button label and style
function syncPlayPauseBtn() {
  const isPlaying = state.mode === MODE_PLAYING;
  CTRL.btnPlayPause.textContent = isPlaying ? '⏸ Pause' : '▶ Play';
  CTRL.btnPlayPause.classList.toggle('playing', isPlaying);
}

// Advance one step forward during playback
function tickForward() {
  if (state.currentStep >= state.steps.length - 1) {
    stopPlayback();
    state.finished = true;
    return;
  }
  renderStep(state.currentStep + 1);
}

// Start the auto-play interval
function startPlayback() {
  if (state.steps.length === 0) return;
  if (state.currentStep >= state.steps.length - 1) resetToStart();
  state.mode = MODE_PLAYING;
  setPlayingMode(true);
  syncPlayPauseBtn();
  state.playIntervalId = setInterval(tickForward, state.speedMs);
  updateBarTransitions(state.speedMs);
}

// Stop the auto-play interval
function stopPlayback() {
  clearInterval(state.playIntervalId);
  state.playIntervalId = null;
  state.mode = MODE_STEPPING;
  setPlayingMode(false);
  syncPlayPauseBtn();
}

// Toggle play/pause state
function handlePlayPause() {
  if (state.mode === MODE_PLAYING) {
    stopPlayback();
  } else {
    startPlayback();
  }
}

// Step forward by one
function handleNext() {
  if (state.currentStep < state.steps.length - 1) {
    state.mode = MODE_STEPPING;
    renderStep(state.currentStep + 1);
  }
}

// Step backward one — restores from arraySnapshot
function handlePrev() {
  if (state.currentStep > 0) {
    state.mode = MODE_STEPPING;
    renderStep(state.currentStep - 1);
  }
}

// Re-record and reset to step 0
function resetToStart() {
  state.currentStep = 0;
  buildBars(state.array);
  renderIdle();
}

// Full reset — regenerate array + re-record
function handleReset() {
  stopPlayback();
  state.mode = MODE_IDLE;
  generatePreset(state.activePreset);
  syncPlayPauseBtn();
  setPlayingMode(false);
}

// Generate a new array from preset name and re-record steps
function generatePreset(preset) {
  state.activePreset = preset;
  state.array = buildPresetArray(preset, state.arraySize);
  state.steps = recordSort(state.array);
  state.currentStep = 0;
  state.finished = false;
  buildBars(state.array);
  renderIdle();
  updateBarTransitions(state.speedMs);
  highlightActivePreset(preset);
}

// Highlight the active preset button
function highlightActivePreset(preset) {
  CTRL.presetBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === preset);
  });
}

// Handle speed slider change — restart interval if playing
function handleSpeedChange() {
  const raw = parseInt(CTRL.speedSlider.value, 10);
  // Invert: slider left = slow, right = fast
  state.speedMs = SPEED_MAX_MS - raw + SPEED_MIN_MS;
  CTRL.speedValue.textContent = `${state.speedMs}ms`;
  updateBarTransitions(state.speedMs);
  if (state.mode === MODE_PLAYING) {
    clearInterval(state.playIntervalId);
    state.playIntervalId = setInterval(tickForward, state.speedMs);
  }
}

// Handle array size slider change
function handleSizeChange() {
  state.arraySize = parseInt(CTRL.sizeSlider.value, 10);
  CTRL.sizeValue.textContent = state.arraySize;
  generatePreset(state.activePreset);
}

// Parse and validate the custom array input
function parseCustomInput(raw) {
  const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length < 2 || parts.length > CUSTOM_ARRAY_MAX) return null;
  const nums = parts.map(Number);
  if (nums.some(n => isNaN(n) || n < VALUE_MIN || n > VALUE_MAX || !Number.isInteger(n))) return null;
  return nums;
}

// Apply custom array input — falls back to random on error
function handleApplyCustom() {
  const raw = CTRL.customInput.value.trim();
  const parsed = parseCustomInput(raw);
  if (!parsed) {
    CTRL.customInput.classList.add('error', 'shake');
    CTRL.errorMsg.textContent = `Invalid input. Use 2–${CUSTOM_ARRAY_MAX} integers (${VALUE_MIN}–${VALUE_MAX}), comma-separated.`;
    CTRL.customInput.addEventListener('animationend', () => {
      CTRL.customInput.classList.remove('shake');
    }, { once: true });
    return;
  }
  CTRL.customInput.classList.remove('error');
  CTRL.errorMsg.textContent = '';
  state.array = parsed;
  state.arraySize = parsed.length;
  state.steps = recordSort(state.array);
  state.currentStep = 0;
  state.finished = false;
  buildBars(state.array);
  renderIdle();
  updateBarTransitions(state.speedMs);
}

// Wire all event listeners to DOM elements
function wireListeners() {
  CTRL.btnPlayPause.addEventListener('click', handlePlayPause);
  CTRL.btnNext.addEventListener('click', handleNext);
  CTRL.btnPrev.addEventListener('click', handlePrev);
  CTRL.btnReset.addEventListener('click', handleReset);
  CTRL.speedSlider.addEventListener('input', handleSpeedChange);
  CTRL.sizeSlider.addEventListener('input', handleSizeChange);
  CTRL.btnApply.addEventListener('click', handleApplyCustom);

  CTRL.customInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleApplyCustom();
  });

  CTRL.presetBtns.forEach(btn => {
    btn.addEventListener('click', () => generatePreset(btn.dataset.preset));
  });
}
