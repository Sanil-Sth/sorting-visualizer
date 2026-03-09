/* ── ALGORITHM MODULE: BUBBLE SORT ── */
// recordSort() — zero DOM access, pure computation only

// Named constants for this algorithm
const BUBBLE_PASS_LABEL = 'Pass';

// Build a step object capturing full algorithm state
const makeBubbleStep = (type, indices, pivotIndex, description, callStack, arr, sortedIndices, activeWindow) => ({
  type,
  indices,
  pivotIndex,
  description,
  callStack: [...callStack.map(f => ({ ...f }))],
  arraySnapshot: [...arr],
  sortedIndices: [...sortedIndices],
  activeWindow: [...activeWindow],
});

// Swap two elements in an array in place
const bubbleSwap = (arr, i, j) => {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
};

// Entry point — runs full bubble sort on a copy, returns steps[] array
function recordSort(inputArray) {
  const arr = [...inputArray];
  const steps = [];
  const sortedIndices = [];
  const n = arr.length;

  for (let pass = 0; pass < n - 1; pass++) {
    // Build a call stack frame showing current pass info
    const callStack = [{ low: 0, high: n - 1 - pass, depth: pass, label: `${BUBBLE_PASS_LABEL} ${pass + 1}` }];
    let swapped = false;

    steps.push(makeBubbleStep(
      'partition_start', [0, n - 1 - pass], -1,
      `${BUBBLE_PASS_LABEL} ${pass + 1}: Bubbling largest unsorted element to position ${n - 1 - pass}`,
      callStack, arr, sortedIndices, [0, n - 1 - pass]
    ));

    for (let j = 0; j < n - 1 - pass; j++) {
      steps.push(makeBubbleStep(
        'compare', [j, j + 1], -1,
        `${BUBBLE_PASS_LABEL} ${pass + 1}: Compare arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]}`,
        callStack, arr, sortedIndices, [0, n - 1 - pass]
      ));

      if (arr[j] > arr[j + 1]) {
        bubbleSwap(arr, j, j + 1);
        swapped = true;
        steps.push(makeBubbleStep(
          'swap', [j, j + 1], -1,
          `${BUBBLE_PASS_LABEL} ${pass + 1}: Swap ${arr[j + 1]} and ${arr[j]} — ${arr[j]} bubbles up`,
          callStack, arr, sortedIndices, [0, n - 1 - pass]
        ));
      }
    }

    // Lock the last unsorted element as sorted
    sortedIndices.push(n - 1 - pass);
    steps.push(makeBubbleStep(
      'sorted', [n - 1 - pass], -1,
      `${BUBBLE_PASS_LABEL} ${pass + 1} complete — value ${arr[n - 1 - pass]} is now sorted at index ${n - 1 - pass}`,
      callStack, arr, sortedIndices, [0, n - 1 - pass]
    ));

    // Early exit if no swaps occurred — array is already sorted
    if (!swapped) break;
  }

  // Mark index 0 as sorted (last remaining element)
  if (!sortedIndices.includes(0)) sortedIndices.push(0);
  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push(makeBubbleStep(
    'sorted', [], -1,
    `Array fully sorted! ${arr.join(', ')}`,
    [], arr, allSorted, [0, n - 1]
  ));

  return steps;
}
