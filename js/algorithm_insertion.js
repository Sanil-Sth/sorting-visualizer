/* ── ALGORITHM MODULE: INSERTION SORT ── */
// recordSort() — zero DOM access, pure computation only

// Named constants
const INSERTION_PASS_LABEL = 'Insert';

// Build a step object capturing full algorithm state
const makeInsStep = (type, indices, pivotIndex, description, callStack, arr, sortedIndices, activeWindow) => ({
  type,
  indices,
  pivotIndex,
  description,
  callStack: [...callStack.map(f => ({ ...f }))],
  arraySnapshot: [...arr],
  sortedIndices: [...sortedIndices],
  activeWindow: [...activeWindow],
});

// Entry point — runs full insertion sort on a copy, returns steps[] array
function recordSort(inputArray) {
  const arr = [...inputArray];
  const steps = [];
  const sortedIndices = [0]; // index 0 is trivially sorted
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    const callStack = [{ low: 0, high: i, depth: i - 1, label: `${INSERTION_PASS_LABEL} ${i}` }];

    steps.push(makeInsStep(
      'pivot_set', [i], i,
      `${INSERTION_PASS_LABEL} ${i}: Pick up arr[${i}]=${key} to insert into sorted portion [0..${i - 1}]`,
      callStack, arr, sortedIndices, [0, i]
    ));

    // Shift elements right to make room for key
    while (j >= 0 && arr[j] > key) {
      steps.push(makeInsStep(
        'compare', [j, j + 1], i,
        `Compare ${arr[j]} > key ${key}: shift arr[${j}]=${arr[j]} right to index ${j + 1}`,
        callStack, arr, sortedIndices, [0, i]
      ));

      arr[j + 1] = arr[j];
      steps.push(makeInsStep(
        'shift', [j, j + 1], i,
        `Shift: move ${arr[j + 1]} from index ${j} to ${j + 1}`,
        callStack, arr, sortedIndices, [0, i]
      ));

      j--;
    }

    // If no shift, still show the final compare
    if (j >= 0 && arr[j] <= key) {
      steps.push(makeInsStep(
        'compare', [j, j + 1], i,
        `Compare ${arr[j]} ≤ key ${key}: insertion point found at index ${j + 1}`,
        callStack, arr, sortedIndices, [0, i]
      ));
    }

    arr[j + 1] = key;
    sortedIndices.push(i);
    steps.push(makeInsStep(
      'swap', [j + 1], j + 1,
      `Insert key ${key} at index ${j + 1} — sorted portion now [0..${i}]`,
      callStack, arr, sortedIndices, [0, i]
    ));
  }

  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push(makeInsStep(
    'sorted', [], -1,
    `Array fully sorted! ${arr.join(', ')}`,
    [], arr, allSorted, [0, n - 1]
  ));

  return steps;
}
