/* ── ALGORITHM MODULE: MERGE SORT ── */
// recordSort() — zero DOM access, pure computation only

// Named constants
const MERGE_DEPTH_LABEL = 'Merge';

// Build a step object capturing full algorithm state
const makeMergeStep = (type, indices, pivotIndex, description, callStack, arr, sortedIndices, activeWindow) => ({
  type,
  indices,
  pivotIndex,
  description,
  callStack: [...callStack.map(f => ({ ...f }))],
  arraySnapshot: [...arr],
  sortedIndices: [...sortedIndices],
  activeWindow: [...activeWindow],
});

// Merge two sorted halves back into arr[low..high]
function merge(arr, low, mid, high, steps, callStack, sortedIndices) {
  const left = arr.slice(low, mid + 1);
  const right = arr.slice(mid + 1, high + 1);
  let i = 0, j = 0, k = low;

  while (i < left.length && j < right.length) {
    steps.push(makeMergeStep(
      'compare', [low + i, mid + 1 + j], -1,
      `${MERGE_DEPTH_LABEL}: Compare left[${i}]=${left[i]} vs right[${j}]=${right[j]}`,
      callStack, arr, sortedIndices, [low, high]
    ));

    if (left[i] <= right[j]) {
      arr[k] = left[i++];
    } else {
      arr[k] = right[j++];
    }
    steps.push(makeMergeStep(
      'swap', [k], -1,
      `${MERGE_DEPTH_LABEL}: Place ${arr[k]} at index ${k}`,
      callStack, arr, sortedIndices, [low, high]
    ));
    k++;
  }

  // Copy remaining left elements
  while (i < left.length) {
    arr[k] = left[i++];
    steps.push(makeMergeStep('swap', [k], -1, `${MERGE_DEPTH_LABEL}: Copy remaining left ${arr[k]} to index ${k}`, callStack, arr, sortedIndices, [low, high]));
    k++;
  }

  // Copy remaining right elements
  while (j < right.length) {
    arr[k] = right[j++];
    steps.push(makeMergeStep('swap', [k], -1, `${MERGE_DEPTH_LABEL}: Copy remaining right ${arr[k]} to index ${k}`, callStack, arr, sortedIndices, [low, high]));
    k++;
  }
}

// Recursive merge sort — splits then merges with step recording
function mergeSortRecursive(arr, low, high, steps, callStack, sortedIndices) {
  if (low >= high) {
    if (low === high) sortedIndices.push(low);
    return;
  }

  const mid = Math.floor((low + high) / 2);
  callStack.push({ low, high, depth: callStack.length, label: `mergeSort(${low}, ${high})` });

  steps.push(makeMergeStep(
    'partition_start', [low, high], -1,
    `Split [${low}..${high}] into [${low}..${mid}] and [${mid + 1}..${high}]`,
    callStack, arr, sortedIndices, [low, high]
  ));

  mergeSortRecursive(arr, low, mid, steps, callStack, sortedIndices);
  mergeSortRecursive(arr, mid + 1, high, steps, callStack, sortedIndices);

  merge(arr, low, mid, high, steps, callStack, sortedIndices);

  // Mark subarray as sorted after merge
  for (let i = low; i <= high; i++) {
    if (!sortedIndices.includes(i)) sortedIndices.push(i);
  }

  callStack.pop();
  steps.push(makeMergeStep(
    'partition_end', [low, high], -1,
    `${MERGE_DEPTH_LABEL} complete: [${low}..${high}] is now sorted`,
    callStack, arr, sortedIndices, [low, high]
  ));
}

// Entry point — runs full merge sort on a copy, returns steps[] array
function recordSort(inputArray) {
  const arr = [...inputArray];
  const steps = [];
  const callStack = [];
  const sortedIndices = [];
  const n = arr.length;

  mergeSortRecursive(arr, 0, n - 1, steps, callStack, sortedIndices);

  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push(makeMergeStep(
    'sorted', [], -1,
    `Array fully sorted! ${arr.join(', ')}`,
    [], arr, allSorted, [0, n - 1]
  ));

  return steps;
}
