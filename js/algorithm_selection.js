/* ── ALGORITHM MODULE: SELECTION SORT ── */
// recordSort() — zero DOM access, pure computation only

// Named constants
const SELECTION_PASS_LABEL = 'Pass';

// Build a step object capturing full algorithm state
const makeSelStep = (type, indices, pivotIndex, description, callStack, arr, sortedIndices, activeWindow) => ({
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
const selSwap = (arr, i, j) => {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
};

// Entry point — runs full selection sort on a copy, returns steps[] array
function recordSort(inputArray) {
  const arr = [...inputArray];
  const steps = [];
  const sortedIndices = [];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    const callStack = [{ low: i, high: n - 1, depth: i, label: `${SELECTION_PASS_LABEL} ${i + 1}` }];

    steps.push(makeSelStep(
      'partition_start', [i, n - 1], -1,
      `${SELECTION_PASS_LABEL} ${i + 1}: Searching for minimum in [${i}..${n - 1}]`,
      callStack, arr, sortedIndices, [i, n - 1]
    ));

    for (let j = i + 1; j < n; j++) {
      steps.push(makeSelStep(
        'compare', [minIdx, j], minIdx,
        `Compare arr[${j}]=${arr[j]} with current min arr[${minIdx}]=${arr[minIdx]}`,
        callStack, arr, sortedIndices, [i, n - 1]
      ));

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push(makeSelStep(
          'select', [minIdx], minIdx,
          `New minimum found: arr[${minIdx}]=${arr[minIdx]}`,
          callStack, arr, sortedIndices, [i, n - 1]
        ));
      }
    }

    // Swap the found minimum to its correct position
    if (minIdx !== i) {
      selSwap(arr, i, minIdx);
      steps.push(makeSelStep(
        'swap', [i, minIdx], -1,
        `Swap minimum ${arr[i]} into position ${i} (was at index ${minIdx})`,
        callStack, arr, sortedIndices, [i, n - 1]
      ));
    }

    sortedIndices.push(i);
    steps.push(makeSelStep(
      'sorted', [i], -1,
      `${SELECTION_PASS_LABEL} ${i + 1} complete — value ${arr[i]} sorted at index ${i}`,
      callStack, arr, sortedIndices, [i, n - 1]
    ));
  }

  // Final element is automatically sorted
  if (!sortedIndices.includes(n - 1)) sortedIndices.push(n - 1);
  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push(makeSelStep(
    'sorted', [], -1,
    `Array fully sorted! ${arr.join(', ')}`,
    [], arr, allSorted, [0, n - 1]
  ));

  return steps;
}
