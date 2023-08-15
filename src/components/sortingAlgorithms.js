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

export function insertionSortAnimations(arr) {
    const animations = [];
    let totalShifts = 0;
    let totalSwaps = 0;
    let tempArray = [...arr];

    for (let i = 1; i < tempArray.length; i++) {
        let key = tempArray[i];
        let j = i - 1;

        // Find the position where the key should be inserted
        while (j >= 0 && tempArray[j] > key) {
            animations.push([j, j + 1]); // highlight and shift
            j = j - 1;
            totalShifts++;
        }

        // If j+1 is not the original position of the key, then a swap is required
        if (j+1 !== i) {
            animations.push([j + 1, i]); // highlight the swap
            let temp = tempArray[j + 1];
            tempArray[j + 1] = key;
            tempArray[i] = temp;
            totalSwaps++;
        }
    }

    return  { animations, totalSwaps, totalShifts };
}


