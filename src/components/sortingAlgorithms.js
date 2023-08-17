export function bubbleSortAnimations(array) {
    let animations = [];
    let totalSwaps = 0; // track swaps for this sort
    let tempArray = [...array];
    

    for (let i = 0; i < tempArray.length; i++) {
        for (let j = 0; j < tempArray.length - i - 1; j++) {
            if (tempArray[j] > tempArray[j + 1]) {
                animations.push([j, j + 1]);

                // Perform the swap on tempArray
                let temp = tempArray[j];
                tempArray[j] = tempArray[j + 1];
                tempArray[j + 1] = temp;
                totalSwaps++;
            }
        }
    }

    return { animations, totalSwaps };
}

export function selectionSortAnimations(array) {
    let animations = [];
    let totalSwaps = 0; 
    let tempArray = [...array];

    for (let i = 0; i < tempArray.length; i++) {
        let minIdx = i;

        for (let j = i + 1; j < tempArray.length; j++) {
            if (tempArray[j] < tempArray[minIdx]) {
                minIdx = j;
            }
        }

        if (minIdx !== i) {
            animations.push([i, minIdx]);

            // Perform the swap on tempArray
            let temp = tempArray[i];
            tempArray[i] = tempArray[minIdx];
            tempArray[minIdx] = temp;
            totalSwaps++;
        }
    }

    return  { animations, totalSwaps };
}

export function insertionSortAnimations(arr) { // technically these are shifts
    const animations = [];
    let totalSwaps = 0;
    let tempArray = [...arr];

    for (let i = 1; i < tempArray.length; i++) {
        let key = tempArray[i];
        let j = i - 1;

        while (j >= 0 && tempArray[j] > key) {
            animations.push([j, j + 1]); // highlight and shift
            tempArray[j + 1] = tempArray[j];
            j--;
            totalSwaps++;  // Increment the swap count for every shift
        }

        tempArray[j + 1] = key;
    }

    return { animations, totalSwaps};
}

function merge(left, right, animations) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;
    let totalSwaps = 0;
    
    while (leftIndex < left.length && rightIndex < right.length) {
        animations.push([leftIndex, rightIndex]);
        totalSwaps++;

        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return { mergedArray: result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex)), totalSwaps };
}

export function mergeSortAnimations(array) {
    let animations = [];
    let totalSwaps = 0;

    function mergeSort(array) {
        if (array.length <= 1) return array;

        const middle = Math.floor(array.length / 2);
        const left = mergeSort(array.slice(0, middle));
        const right = mergeSort(array.slice(middle));

        const { mergedArray, totalSwaps: mergeSwaps } = merge(left, right, animations);
        totalSwaps += mergeSwaps;

        return mergedArray;
    }

    mergeSort(array);
    return { animations, totalSwaps };
}

export function quickSortAnimations(array) {
    const animations = [];
    let totalSwaps = 0;

    function partition(low, high) {
        let pivot = array[high];
        let i = low - 1;

        for (let j = low; j <= high - 1; j++) {
            if (array[j] < pivot) {
                i++;
                animations.push([i, j]);
                [array[i], array[j]] = [array[j], array[i]];
                totalSwaps++;
            }
        }
        animations.push([i + 1, high]);
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        totalSwaps++;
        return i + 1;
    }

    function quickSort(low, high) {
        if (low < high) {
            let pi = partition(low, high);

            quickSort(low, pi - 1);
            quickSort(pi + 1, high);
        }
    }

    quickSort(0, array.length - 1);
    return { animations, totalSwaps };
}

export function heapSortAnimations(array) {
    const animations = [];
    let totalSwaps = 0;

    function heapify(n, i) {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;

        if (left < n && array[left] > array[largest]) {
            largest = left;
        }

        if (right < n && array[right] > array[largest]) {
            largest = right;
        }

        if (largest !== i) {
            animations.push([i, largest]);
            [array[i], array[largest]] = [array[largest], array[i]];
            totalSwaps++;

            heapify(n, largest);
        }
    }

    function heapSort() {
        let n = array.length;

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(n, i);
        }

        for (let i = n - 1; i > 0; i--) {
            animations.push([0, i]);
            [array[0], array[i]] = [array[i], array[0]];
            totalSwaps++;

            heapify(i, 0);
        }
    }

    heapSort();
    return { animations, totalSwaps };
}






