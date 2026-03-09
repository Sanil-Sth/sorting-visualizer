/* ── ALGORITHM MODULE: SHELL SORT ── */
// recordSort() — zero DOM access, pure computation only

// Named constants
const SHELL_GAP_LABEL = 'Gap';

// Build a step object capturing full algorithm state
const makeShellStep = (type, indices, pivotIndex, description, callStack, arr, sortedIndices, activeWindow) => ({
  type,
  indices,
  pivotIndex,
  description,
  callStack: [...callStack.map(f => ({ ...f }))],
  arraySnapshot: [...arr],
  sortedIndices: [...sortedIndices],
  activeWindow: [...activeWindow],
});

// Compute Knuth gap sequence: 1, 4, 13, 40, 121...
function computeGaps(n) {
  const gaps = [];
  let gap = 1;
  while (gap < n) {
    gaps.push(gap);
    gap = gap * 3 + 1;
  }
  return gaps.reverse();
}

// Entry point — runs full shell sort on a copy, returns steps[] array
function recordSort(inputArray) {
  const arr = [...inputArray];
  const steps = [];
  const sortedIndices = [];
  const n = arr.length;
  const gaps = computeGaps(n);
  let gapPhase = 0;

  for (const gap of gaps) {
    gapPhase++;
    const callStack = [{ low: 0, high: n - 1, depth: gapPhase - 1, label: `${SHELL_GAP_LABEL}=${gap}` }];

    steps.push(makeShellStep(
      'partition_start', [0, n - 1], -1,
      `${SHELL_GAP_LABEL} phase ${gapPhase}: gap=${gap} — comparing elements ${gap} apart`,
      callStack, arr, sortedIndices, [0, n - 1]
    ));

    for (let i = gap; i < n; i++) {
      const key = arr[i];
      let j = i;

      while (j >= gap) {
        steps.push(makeShellStep(
          'compare', [j - gap, j], -1,
          `${SHELL_GAP_LABEL}=${gap}: Compare arr[${j - gap}]=${arr[j - gap]} and arr[${j}]=${arr[j]}`,
          callStack, arr, sortedIndices, [Math.max(0, j - gap * 3), Math.min(n - 1, j + gap)]
        ));

        if (arr[j - gap] <= key) break;

        arr[j] = arr[j - gap];
        steps.push(makeShellStep(
          'swap', [j - gap, j], -1,
          `${SHELL_GAP_LABEL}=${gap}: Shift ${arr[j]} from index ${j - gap} to ${j}`,
          callStack, arr, sortedIndices, [Math.max(0, j - gap * 3), Math.min(n - 1, j + gap)]
        ));

        j -= gap;
      }

      arr[j] = key;
    }
  }

  // All elements are sorted after shell sort completes
  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push(makeShellStep(
    'sorted', [], -1,
    `Array fully sorted! ${arr.join(', ')}`,
    [], arr, allSorted, [0, n - 1]
  ));

  return steps;
}
