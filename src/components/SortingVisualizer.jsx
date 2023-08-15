import React, { useState, useRef } from "react";
import "./SortingVisualizer.css";
import { bubbleSortAnimations, selectionSortAnimations, insertionSortAnimations } from './sortingAlgorithms';  // Importing sorting functions

const SortingVisualizer = () => {
    const [speed, setSpeed] = useState(300);  // 300ms as the initial speed
    const [isAnimating, setIsAnimating] = useState(false);
    const timeouts = useRef([]);  // use useRef for timeouts
    const initialArray = useRef(generateRandomArray());
    const [array, setArray] = useState([...initialArray.current]);
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const animationActive = useRef(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubbleSort');
    const [numSwaps, setNumSwaps] = useState(0);
    const currentSortSwaps = useRef(0);
    
    function restart() {
        setArray([...initialArray.current]);  // Reset to the initial state of the array
        setNumSwaps(0);  // Reset the swap counter
        setIsAnimating(false);  // Stop any ongoing animations
        timeouts.current.forEach(timeout => clearTimeout(timeout));  // Clear any pending timeouts
        animationActive.current = false;  // Ensure animations are stopped
    }

    function generateRandomArray() {
        return Array.from({ length: 50 }, () => Math.floor(Math.random() * 140) + 10);
    }

    function animateSort(animations) {
        setIsAnimating(true);
        animations.forEach(([firstIdx, secondIdx], idx) => {
            const timeout = setTimeout(() => {
                if (!animationActive.current) return;
    
                setArray(prevArray => {
                    const newArray = [...prevArray];
                    let temp = newArray[firstIdx];
                    newArray[firstIdx] = newArray[secondIdx];
                    newArray[secondIdx] = temp;
                    return newArray;
                });
    
                // Update the swap count for each animation
                setNumSwaps(prevNumSwaps => prevNumSwaps + 1);
    
                if (idx === animations.length - 1) {
                    setIsAnimating(false);
                }
            }, idx * speed);
    
            timeouts.current.push(timeout);
        });
    }
    

    function handleSort() {
        animationActive.current = true;
        const sortAlgorithms = {
            bubbleSort: bubbleSortAnimations,
            selectionSort: selectionSortAnimations,
            insertionSort: insertionSortAnimations
        };

        const { animations, totalSwaps } = sortAlgorithms[selectedAlgorithm](array);
        currentSortSwaps.current = totalSwaps;
        animateSort(animations);
    }

    function finishSorting() {
        timeouts.current.forEach(timeout => clearTimeout(timeout));
        animationActive.current = false;
        setArray(prevArray => [...prevArray].sort((a, b) => a - b));
        setIsAnimating(false);
        setNumSwaps(currentSortSwaps.current);
    }

    return (
    <div className="SortingVisualizer">
        <div className="controlGroup topControl">
        <select value={selectedAlgorithm} onChange={(e) => setSelectedAlgorithm(e.target.value)}>
            <option value="bubbleSort">Bubble Sort</option>
            <option value="selectionSort">Selection Sort</option>
            <option value="insertionSort">Insertion Sort</option>
        </select>

        <div className="speedControl">
            <button onClick={() => setSpeed(prevSpeed => Math.max(50, prevSpeed - 50))}>Speed Up</button>
            <button onClick={() => setSpeed(prevSpeed => prevSpeed + 50)}>Slow Down</button>
            <p>Current Speed: {speed}ms</p>
        </div>
    </div>


        <div className="arrayContainer">
      {/* Y-Axis Labels */}
      <div
        style={{
          position: "absolute",
          left: "-50px",
          top: "0",
          fontSize: "12px",
        }}
      >
        150
      </div>
      <div
        style={{
          position: "absolute",
          left: "-50px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "12px",
        }}
      >
        75
      </div>
      <div
        style={{
          position: "absolute",
          left: "-50px",
          bottom: "0",
          fontSize: "12px",
        }}
      >
        10
      </div>

      {array.map((value, idx) => (
        <div
          key={idx}
          onMouseEnter={() => setHoveredIdx(idx)}
          onMouseLeave={() => setHoveredIdx(null)}
          style={{
            height: `${value}px`,
            width: "10px",
            margin: "0 2px",
            background: `rgba(0,123,255, ${value / 150})`,
            display: "inline-block",
            position: "relative",
          }}
        >
          {" "}
          {hoveredIdx === idx && <span>{value}</span>}
          {/* <span style={{ position: 'absolute', bottom: '-20px', fontSize: '10px' }}>{value}</span> */}
        </div>
      ))}
      </div>

    <div className="controlGroup bottomControl">
        <button onClick={handleSort}>Sort</button>
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
