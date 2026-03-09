/* ── STATE MODULE ── */
// Single global state object and all constants — the only source of truth

/* ── CONSTANTS ── */
// Speed range in milliseconds: slow to fast
const SPEED_MIN_MS = 80;
const SPEED_MAX_MS = 1500;
const SPEED_DEFAULT_MS = 600;

// Array size bounds
const ARRAY_SIZE_MIN = 5;
const ARRAY_SIZE_MAX = 20;
const ARRAY_SIZE_DEFAULT = 12;

// Value bounds for elements
const VALUE_MIN = 1;
const VALUE_MAX = 100;

// Maximum custom array length
const CUSTOM_ARRAY_MAX = 20;

// Maximum call stack frames to display
const CALLSTACK_DISPLAY_MAX = 3;

// CSS transition buffer over animation delay
const TIMING_BUFFER_MS = 50;

// Default step description shown before any action
const DEFAULT_DESCRIPTION = 'Press Play or Next Step to begin';

// Preset names
const PRESET_RANDOM = 'random';
const PRESET_SORTED = 'sorted';
const PRESET_REVERSE = 'reverse';
const PRESET_NEARLY = 'nearly';

// App mode strings
const MODE_IDLE = 'idle';
const MODE_PLAYING = 'playing';
const MODE_STEPPING = 'stepping';

/* ── GLOBAL STATE ── */
// Central mutable state for the entire application
const state = {
  // Current array of integer values
  array: [],

  // All recorded algorithm steps
  steps: [],

  // Current step index into steps[]
  currentStep: 0,

  // All indices that are permanently sorted
  sortedIndices: [],

  // Current playback interval ID
  playIntervalId: null,

  // Current animation speed in milliseconds
  speedMs: SPEED_DEFAULT_MS,

  // Active preset name
  activePreset: PRESET_RANDOM,

  // Number of elements
  arraySize: ARRAY_SIZE_DEFAULT,

  // App mode: 'idle' | 'playing' | 'stepping'
  mode: MODE_IDLE,

  // Whether algorithm has finished
  finished: false,
};
