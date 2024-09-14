const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const unit = 20;
const row = canvas.height / unit; // 320 ÷ 20 = 16
const column = canvas.width / unit; // 320 ÷ 20 = 16

let snake = [];
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    // The snake cannot overlap with itself
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

// Initial setting
createSnake();
let myFruit = new Fruit();
window.addEventListener("keydown", changeDirection);
let d = "Right";
function changeDirection(e) {
  console.log(e);
  if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  }

  // Prevent continuous key presses from causing the game to end
  window.removeEventListener("keydown", changeDirection);
}
let score = 0;
document.getElementById("myScore").innerHTML = "Score：" + score;
let highestScore;
loadHighestScore();
document.getElementById("myScore2").innerHTML =
  "Highest Score：" + highestScore;

function draw() {
  // Check if the game is over by verifying if the snake overlaps with itself
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("Game Over");
      return;
    }
  }

  // Update the canvas to refresh the game screen
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // call function
  myFruit.drawFruit();

  // Style of the snake
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";

    // Implement the snake's ability to pass through walls
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  // Determine the next frame's coordinates (snake's head) based on the current direction 'd'
  let snakeX = snake[0].x; // *snake[0]: object, snake[0].x: number
  let snakeY = snake[0].y;

  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // Check if the snake has eaten the fruit
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.pickALocation(); // Select a new position for the fruit
    score++;
    document.getElementById("myScore").innerHTML = "Score：" + score; // Update the score
    setHighestScore(score);
    document.getElementById("myScore2").innerHTML =
      "Highest Score：" + highestScore; // Update the high score
  } else {
    snake.pop(); // Remove the last item from the array
  }
  snake.unshift(newHead); // Add an item to the beginning of the array 'arr' -> Update the snake's head
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
