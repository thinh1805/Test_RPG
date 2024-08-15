import './App.css';
import { useState, useEffect, useRef } from "react";

function App() {
  const [input, setInput] = useState({ point: "" });
  const [randomizedArray, setRandomizedArray] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0); 
  const [isWin, setIsWin] = useState(false); 
  const [nextNumber, setNextNumber] = useState(1);
  const [gameOver, setGameOver] = useState(false); 
  const timerRef = useRef(null); 
  const [fadingOut, setFadingOut] = useState(null);
  
  // Function to handle input changes
  const handleInput = (e) => {
    const nameInput = e.target.name;
    const value = e.target.value;
    
    setInput(state => ({ ...state, [nameInput]: value }));
  };
  // Function to start or reset the game
  const initializeGame = () => {
    if (input.point === "") {
      alert("Please enter a number");
      return;
    }
    var value = parseInt(input.point);
    if(value === 0){
      alert("Please enter a number greater than 0");
      return;
    }
    let circles = [];
    for (var i = value; i > 0; i--) {
      const randomPosition = {
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`,
      };
      circles.push({ number: i, position: randomPosition });
    }
    
    setRandomizedArray(circles);
    setFadingOut(null);
    setTimeElapsed(0); 
    setIsWin(false); 
    setNextNumber(1); 
    setGameOver(false); 

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Start a new timer with 100ms interval
    timerRef.current = setInterval(() => {
      setTimeElapsed((prevTime) => prevTime + 0.1);
    }, 100);
  };
  // Function to conditionally render the reset or start button
  const showReset = () => {
    if (randomizedArray.length > 0) {
      return (
        <button onClick={initializeGame} className="btn">reset</button>
      );
    } else {
      return (
        <button onClick={initializeGame} className="btn">start</button>
      );
    }
  };
  // Function to handle removing a circle
   const removeItem = async (number) => {
    if (gameOver) return; // Do nothing if the game is over
    
    if (number === nextNumber) { 
      setFadingOut(number); 

      // Delay the removal of the item to allow the fade-out animation to play
      setTimeout(() => {
          const new_arr = randomizedArray.filter(item => item.number !== number);
          setRandomizedArray(new_arr);
          setNextNumber(nextNumber + 1); // Update the next number to click

          // Stop the timer if all items are removed and set win state
          if (new_arr.length === 0 && timerRef.current) {
              clearInterval(timerRef.current);
              setIsWin(true); 
          }
      }, 500); 
  } else { // Game over if the wrong number is clicked
      setGameOver(true);
      if (timerRef.current) {
          clearInterval(timerRef.current);
      }
  }
  };
  // Clean up timer when the component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current); // Clear the timer when the component unmounts
      }
    };
  }, []);
  console.log(nextNumber)
  return (
    <div className="container">
      <h3>{isWin ? "ALL CLEARED" : gameOver ? "GAME OVER" : "LET'S PLAY" }</h3> {/* Display WIN or GAME OVER */}
      <p className="point">Points:</p>
      <input
        type="text"
        className="input-point"
        name="point"
        onChange={handleInput}
        onKeyPress={(e) => {
          const isNumeric = /^[0-9]*$/;
          if (!isNumeric.test(e.key)) {
            e.preventDefault();
          }
        }}
      /><br />
      <p>Time: <span className="time">{timeElapsed.toFixed(1)}s</span></p><br />

      {showReset()}
      <div className="game">
        {randomizedArray.map((circle, i) => (
          <div
            key={i}
            className={`circle ${fadingOut === circle.number ? 'fade-out' : ''}`}
            style={{ top: circle.position.top, left: circle.position.left }}
            onClick={() => {
              removeItem(circle.number, circle.position);
            }}
          >
            {circle.number}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;