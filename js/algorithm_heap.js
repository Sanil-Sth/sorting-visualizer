/* ── ALGORITHM MODULE: HEAP SORT ── */
// recordSort() — zero DOM access, pure computation only

// Named constants
const HEAP_PHASE_BUILD = 'Build Heap';
const HEAP_PHASE_EXTRACT = 'Extract';

// Build a step object capturing full algorithm state
const makeHeapStep = (type, indices, pivotIndex, description, callStack, arr, sortedIndices, activeWindow) => ({
  type,
  indices,
  pivotIndex,
  description,
  callStack: [...callStack.map(f => ({ ...f }))],
  arraySnapshot: [...arr],
  sortedIndices: [...sortedIndices],
  activeWindow: [...activeWindow],
});

// Swap two elements in place
const heapSwap = (arr, i, j) => {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
};

// Sift down to maintain max-heap property, records compare/swap steps
function heapify(arr, n, rootIdx, heapSize, steps, callStack, sortedIndices, phase) {
  let largest = rootIdx;
  const left = 2 * rootIdx + 1;
  const right = 2 * rootIdx + 2;

  if (left < heapSize) {
    steps.push(makeHeapStep('compare', [largest, left], rootIdx, `${phase}: Compare root arr[${largest}]=${arr[largest]} vs left child arr[${left}]=${arr[left]}`, callStack, arr, sortedIndices, [0, heapSize - 1]));
    if (arr[left] > arr[largest]) largest = left;
  }

  if (right < heapSize) {
    steps.push(makeHeapStep('compare', [largest, right], rootIdx, `${phase}: Compare largest arr[${largest}]=${arr[largest]} vs right child arr[${right}]=${arr[right]}`, callStack, arr, sortedIndices, [0, heapSize - 1]));
    if (arr[right] > arr[largest]) largest = right;
  }

  if (largest !== rootIdx) {
    heapSwap(arr, rootIdx, largest);
    steps.push(makeHeapStep('swap', [rootIdx, largest], rootIdx, `${phase}: Swap arr[${rootIdx}]=${arr[rootIdx]} with larger child arr[${largest}]=${arr[largest]}`, callStack, arr, sortedIndices, [0, heapSize - 1]));
    heapify(arr, n, largest, heapSize, steps, callStack, sortedIndices, phase);
  }
}

// Entry point — runs full heap sort on a copy, returns steps[] array
function recordSort(inputArray) {
  const arr = [...inputArray];
  const steps = [];
  const sortedIndices = [];
  const n = arr.length;
  const callStack = [{ low: 0, high: n - 1, depth: 0, label: HEAP_PHASE_BUILD }];

  // Phase 1: Build max-heap (heapify from last internal node up to root)
  steps.push(makeHeapStep('partition_start', [0, n - 1], -1, `${HEAP_PHASE_BUILD}: Building max-heap from array of ${n} elements`, callStack, arr, sortedIndices, [0, n - 1]));

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, n, steps, callStack, sortedIndices, HEAP_PHASE_BUILD);
  }

  steps.push(makeHeapStep('pivot_set', [0], 0, `${HEAP_PHASE_BUILD} complete — root arr[0]=${arr[0]} is the maximum`, callStack, arr, sortedIndices, [0, n - 1]));

  // Phase 2: Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    callStack[0] = { low: 0, high: i, depth: n - 1 - i, label: `${HEAP_PHASE_EXTRACT} ${n - i}` };

    steps.push(makeHeapStep('pivot_set', [0], 0, `${HEAP_PHASE_EXTRACT} ${n - i}: Move max ${arr[0]} from root to position ${i}`, callStack, arr, sortedIndices, [0, i]));

    heapSwap(arr, 0, i);
    steps.push(makeHeapStep('swap', [0, i], 0, `Swap root ${arr[i]} with last heap element ${arr[0]}, place ${arr[i]} at sorted position ${i}`, callStack, arr, sortedIndices, [0, i]));

    sortedIndices.push(i);
    steps.push(makeHeapStep('sorted', [i], -1, `Element ${arr[i]} is now sorted at index ${i} — heap size reduced to ${i}`, callStack, arr, sortedIndices, [0, i - 1]));

    heapify(arr, n, 0, i, steps, callStack, sortedIndices, `${HEAP_PHASE_EXTRACT} ${n - i}`);
  }

  sortedIndices.push(0);
  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push(makeHeapStep('sorted', [], -1, `Array fully sorted! ${arr.join(', ')}`, [], arr, allSorted, [0, n - 1]));

  return steps;
}
