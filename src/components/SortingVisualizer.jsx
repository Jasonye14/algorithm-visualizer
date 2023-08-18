import React, { useState, useRef } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "./SortingVisualizer.css";
import {
  bubbleSortAnimations,
  selectionSortAnimations,
  insertionSortAnimations,
  mergeSortAnimations,
  quickSortAnimations,
  heapSortAnimations,
} from "./sortingAlgorithms"; // Importing sorting functions

const SortingVisualizer = () => {
  const [speed, setSpeed] = useState(300); // 300ms as the initial speed
  const [isAnimating, setIsAnimating] = useState(false);
  const timeouts = useRef([]); // use useRef for timeouts
  const initialArray = useRef(generateRandomArray());
  const [array, setArray] = useState([...initialArray.current]);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const animationActive = useRef(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubbleSort");
  const [numSwaps, setNumSwaps] = useState(0);
  const currentSortSwaps = useRef(0);

  const sortAlgorithms = {
    bubbleSort: bubbleSortAnimations,
    selectionSort: selectionSortAnimations,
    insertionSort: insertionSortAnimations,
    mergeSort: mergeSortAnimations,
    quickSort: quickSortAnimations,
    heapSort: heapSortAnimations,
  };

  function restart() {
    setArray([...initialArray.current]); // Reset to the initial state of the array
    setNumSwaps(0); // Reset the swap counter
    setIsAnimating(false); // Stop any ongoing animations
    timeouts.current.forEach((timeout) => clearTimeout(timeout)); // Clear any pending timeouts
    animationActive.current = false; // Ensure animations are stopped
  }

  function generateRandomArray() {
    return Array.from(
      { length: 80 },
      () => Math.floor(Math.random() * 140) + 10
    );
  }

  function animateSortMerge(animations) {
    console.log(animations);
    setIsAnimating(true);

    animations.forEach((animation, idx) => {
      const timeout = setTimeout(() => {
        if (!animationActive.current) return;

        const [type, ...params] = animation;

        if (type === "split") {
          // For now, we'll just console log the splitting
          console.log("Splitting", ...params);
        } else if (type === "merge") {
          const [index, newValue] = params;
          setArray((prevArray) => {
            const newArray = [...prevArray];
            newArray[index] = newValue;
            return newArray;
          });

          // Update the swap count for each animation
          setNumSwaps((prevNumSwaps) => prevNumSwaps + 1);
        }

        if (idx === animations.length - 1) {
          setIsAnimating(false);
        }
      }, idx * speed);

      timeouts.current.push(timeout);
    });
  }

  function animateSort(animations) {
    setIsAnimating(true);
    animations.forEach(([firstIdx, secondIdx], idx) => {
      const timeout = setTimeout(() => {
        if (!animationActive.current) return;

        setArray((prevArray) => {
          const newArray = [...prevArray];
          let temp = newArray[firstIdx];
          newArray[firstIdx] = newArray[secondIdx];
          newArray[secondIdx] = temp;
          return newArray;
        });

        // Update the swap count for each animation
        setNumSwaps((prevNumSwaps) => prevNumSwaps + 1);

        if (idx === animations.length - 1) {
          setIsAnimating(false);
        }
      }, idx * speed);

      timeouts.current.push(timeout);
    });
  }

  function animateQuickSort(animations) {
    setIsAnimating(true);

    animations.forEach((animation, idx) => {
      const timeout = setTimeout(() => {
        if (!animationActive.current) return;

        const [type, ...params] = animation;

        // This section handles bar coloring
        const colorBar = (idx, color) => {
          document.querySelector(
            `.arrayContainer div:nth-child(${idx + 1})`
          ).style.backgroundColor = color;
        };

        if (type === "compare") {
          // For now, we don't do anything with "compare" as the given function doesn't output this type
        } else if (type === "swap") {
          const [firstIdx, secondIdx] = params;

          // Highlight the bars being swapped
          colorBar(firstIdx, "yellow");
          colorBar(secondIdx, "yellow");

          setArray((prevArray) => {
            const newArray = [...prevArray];
            let temp = newArray[firstIdx];
            newArray[firstIdx] = newArray[secondIdx];
            newArray[secondIdx] = temp;
            return newArray;
          });

          // Reset the bar colors after the swap
          setTimeout(() => {
            colorBar(firstIdx, "");
            colorBar(secondIdx, "");
          }, speed);

          setNumSwaps((prevNumSwaps) => prevNumSwaps + 1);
        } else if (type === "pivot") {
          const [pivotIdx] = params;

          // Fade the pivot bar in and out with a red shade
          colorBar(pivotIdx, "rgba(255,0,0,0.5)"); // 50% transparent red
          setTimeout(() => {
            colorBar(pivotIdx, "rgba(255,0,0,1)"); // solid red
          }, speed / 2);
        } else if (type === "unpivot") {
          const [pivotIdx] = params;
          colorBar(pivotIdx, ""); // Reset to the original color
        }

        if (idx === animations.length - 1) {
          setIsAnimating(false);
        }
      }, idx * speed);

      timeouts.current.push(timeout);
    });
  }

  function animateHeapSort(animations) {
    setIsAnimating(true);

    animations.forEach((animation, idx) => {
      const timeout = setTimeout(() => {
        if (!animationActive.current) return;

        const [type, ...params] = animation;

        if (type === "swap") {
          const [firstIdx, secondIdx] = params;
          setArray((prevArray) => {
            const newArray = [...prevArray];
            let temp = newArray[firstIdx];
            newArray[firstIdx] = newArray[secondIdx];
            newArray[secondIdx] = temp;
            return newArray;
          });
          setNumSwaps((prevNumSwaps) => prevNumSwaps + 1);
        } // ... Handle other types of animations if needed ...

        if (idx === animations.length - 1) {
          setIsAnimating(false);
        }
      }, idx * speed);

      timeouts.current.push(timeout);
    });
  }

  function handleSort() {
    animationActive.current = true;

    // Create a deep copy of the array for generating animations
    const arrayCopy = [...array];
    const { animations, totalSwaps } =
      sortAlgorithms[selectedAlgorithm](arrayCopy);

    currentSortSwaps.current = totalSwaps;

    if (selectedAlgorithm === "mergeSort") {
      animateSortMerge(animations);
    } else if (selectedAlgorithm === "quickSort") {
      animateQuickSort(animations);
    } else if (selectedAlgorithm === "heapSort") {
      animateHeapSort(animations);
    } else {
      animateSort(animations);
    }
  }

  function finishSorting() {
    timeouts.current.forEach((timeout) => clearTimeout(timeout));
    animationActive.current = false;
    setArray((prevArray) => [...prevArray].sort((a, b) => a - b));
    //setIsAnimating(false);
    setNumSwaps(currentSortSwaps.current);
  }

  return (
    <div className="SortingVisualizer">
      <div className="arrayContainer">
        {/* Y-Axis Labels ... (no changes here) */}

        {array.map((value, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              height: `${value * 2}px`,
              width: "10px",
              margin: "0 2px",
              background: `rgba(0,123,255, ${value / 150})`,
              display: "inline-block",
              position: "relative",
            }}
          >
            {hoveredIdx === idx && <span>{value}</span>}
          </div>
        ))}
      </div>

      {/* Only display the settings box if the animation hasn't started */}
      {!isAnimating && (
        <div className="settingsBox controlGroup">
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
          >
            <option value="bubbleSort">Bubble Sort</option>
            <option value="selectionSort">Selection Sort</option>
            <option value="insertionSort">Insertion Sort</option>
            <option value="mergeSort">Merge Sort</option>
            <option value="quickSort">Quick Sort</option>
            <option value="heapSort">Heap Sort</option>
          </select>

          <div className="speedControl">
            <button
              onClick={() => {
                setSpeed((prevSpeed) => Math.max(50, prevSpeed - 50));
              }}
            >
              <FaArrowUp />
            </button>

            <p style={{marginBottom: 0}}>Speed: {speed}ms</p>

            <button
              onClick={() => {
                setSpeed((prevSpeed) => prevSpeed + 50);
              }}
            >
              <FaArrowDown />
            </button>

            
          </div>

          <button onClick={handleSort}>Start</button>
        </div>
      )}

      <div className="controlGroup bottomControl">
        {isAnimating && <button onClick={finishSorting}>Finish</button>}
        <button onClick={restart}>Restart</button>
      </div>

      <div className="infoDisplay">
        <p>Number of Swaps: {numSwaps}</p>
      </div>
    </div>
  );
};

export default SortingVisualizer;
