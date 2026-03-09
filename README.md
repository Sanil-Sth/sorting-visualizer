# Sorting Algorithm Visualizer

An interactive, step-by-step visualizer for 7 classic sorting algorithms — built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools, just drop it in a browser and go.

**Live Demo →** [sorting-visualizer-sanil.vercel.app](https://sorting-visualizer-sanil.vercel.app) 

![Sorting Visualizer Preview](https://quick-sort-visualizer-sanil.vercel.app/preview.png)

---

## Algorithms

| Algorithm | Category | Best | Average | Worst | Space |
|---|---|---|---|---|---|
| Bubble Sort | Comparison | O(n) | O(n²) | O(n²) | O(1) |
| Selection Sort | Comparison | O(n²) | O(n²) | O(n²) | O(1) |
| Insertion Sort | Comparison | O(n) | O(n²) | O(n²) | O(1) |
| Shell Sort | Comparison | O(n log n) | O(n log² n) | O(n²) | O(1) |
| Merge Sort | Divide & Conquer | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | Divide & Conquer | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Heap Sort | Divide & Conquer | O(n log n) | O(n log n) | O(n log n) | O(1) |

---

## Features

- **Step-by-step playback** — play, pause, go forward or backward through every operation
- **Color-coded bars** — distinct colors for comparisons, swaps, pivots, active window, and sorted elements
- **Call stack panel** — visualizes recursive frames (Merge, Quick, Heap) and pass/gap labels for iterative algorithms
- **Live descriptions** — each step shows a plain-English explanation of what's happening
- **4 presets** — Random, Sorted, Reverse, Nearly Sorted to explore best/worst cases
- **Custom array input** — type your own comma-separated values
- **Adjustable speed** — from 800ms (slow study) down to 20ms (fast demo)
- **Resizable panels** — drag the divider between controls and chart
- **Mobile responsive** — stacked layout on phones, adapted for tablets

---

## Getting Started

No install required. Clone the repo and open `index.html` in your browser.

```bash
git clone https://github.com/Sanil-Sth/sorting-visualizer.git
cd sorting-visualizer
# open index.html in your browser
```

Or with a local server (recommended to avoid any CORS issues):

```bash
npx serve .
# visit http://localhost:3000
```

---

## Project Structure

```
sorting-visualizer/
├── index.html               # Landing page — algorithm selector
├── bubble_sort.html
├── selection_sort.html
├── insertion_sort.html
├── shell_sort.html
├── merge_sort.html
├── quick_sort.html
├── heap_sort.html
├── css/
│   ├── tokens.css           # Design tokens (colors, spacing, typography)
│   ├── reset.css            # CSS reset
│   ├── layout.css           # App shell, header, panel split, responsive breakpoints
│   ├── components.css       # Buttons, sliders, inputs, legend
│   ├── bars.css             # Bar chart, bar colors, value labels
│   ├── animations.css       # Keyframe animations
│   └── landing.css          # Landing page styles
└── js/
    ├── state.js             # Global state (array, steps, playback)
    ├── renderer.js          # DOM rendering, bar colors, call stack display
    ├── controls.js          # UI event handlers (play, pause, speed, presets)
    ├── main.js              # Entry point
    ├── resizer.js           # Panel drag-to-resize
    ├── algorithm_bubble.js
    ├── algorithm_selection.js
    ├── algorithm_insertion.js
    ├── algorithm_shell.js
    ├── algorithm_merge.js
    ├── algorithm_quicksort.js
    └── algorithm_heap.js
```

---

## How It Works

Each algorithm file exposes a single `recordSort(array)` function that runs the full sort on a copy of the array and returns an array of **step objects** — one per operation. No actual DOM manipulation happens inside the algorithms.

The renderer then replays these steps, updating bar heights, colors, and labels purely from the recorded snapshots. This makes stepping forward *and* backward trivial — it's just array indexing.

Each step carries:
- `type` — the operation (`compare`, `swap`, `sorted`, `pivot_set`, `shift`, `select`, ...)
- `indices` — which bars are involved
- `arraySnapshot` — full array state at that moment
- `sortedIndices` — all permanently sorted positions so far
- `activeWindow` — the current working subarray range
- `callStack` — recursive frames or pass labels for the sidebar
- `description` — plain-English explanation

---

## Built By

**Sanil Sthapit** — [github.com/Sanil-Sth](https://github.com/Sanil-Sth)
