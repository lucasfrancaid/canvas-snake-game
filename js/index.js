// Variables for use
let dx, dy, snake, score, foodX, foodY, changingSnakeDirection;

// Screen colors
const screenColor = 'black';
const screenBorderColor = 'black';

// Snake colors
const snakeColor = 'limegreen';
const snakeBorderColor = 'green';

// Snake Food colors
const snakeFoodColor = 'red';
const snakeFoodBorderColor = 'orangered';

// Snake directions
const leftKey = {arrowleft: 'arrowleft', a: 'a'} 
const rightKey = {arrowright: 'arrowright', d: 'd'} 
const upKey = {arrowup: 'arrowup', w: 'w'} 
const downKey = {arrowdown: 'arrowdown', s: 's'} 

// Screen game and props
const snakeScreen = document.getElementById('snakeScreen');
const snakeScreenContext = snakeScreen.getContext('2d');
clearSnakeScreen();

// Snake Game
function startGame(){
  // Snake directions
  dx = 10;
  dy = 0;

  // Snake score
  score = 0;

  // Snake food position
  foodX = 0;
  foodY = 0;

  // Snake changing direction
  changingSnakeDirection = false;

  // Snake body
  snake = [
    {x: 200, y: 200},
    {x: 190, y: 200},
    {x: 180, y: 200},
    {x: 170, y: 200},
    {x: 160, y: 200},
  ];

  // Hide start and game over screen
  document.getElementById('startGame').style.display = 'none';
  document.getElementById('gameOver').style.display = 'none';
  document.getElementById('score').innerHTML = score;

  // Create new game
  main();
  createSnakeFood();
  changeSnakeDirection(rightKey['arrowright']);

};

function main() {
  if (gameOver()) {
    document.getElementById('gameOver').style.display = 'block';
    return;
  };

  changingSnakeDirection = false;

  setTimeout(function () {
    clearSnakeScreen();
    setSnakeFood();
    moveSnake();
    setSnake();
    main();
  }, 100);
};

function clearSnakeScreen() {
  snakeScreenContext.fillStyle = screenColor;
  snakeScreenContext.strokeStyle = screenBorderColor;
  snakeScreenContext.fillRect(0, 0, snakeScreen.width, snakeScreen.height);
  snakeScreenContext.strokeRect(0, 0, snakeScreen.width, snakeScreen.height);
};

function setSnake() {
  snake.forEach(setSnakePart)
};

function setSnakePart(snakePart) {
  snakeScreenContext.lineJoin = 'round'
  snakeScreenContext.fillStyle = snakeColor;
  snakeScreenContext.strokeStyle = snakeBorderColor;
  snakeScreenContext.fillRect(snakePart.x, snakePart.y, 10, 10);
  snakeScreenContext.strokeRect(snakePart.x, snakePart.y, 10, 10);
};

function setSnakeFood() {
  snakeScreenContext.lineJoin = 'round'
  snakeScreenContext.fillStyle = snakeFoodColor;
  snakeScreenContext.strokeStyle = snakeFoodBorderColor;
  snakeScreenContext.fillRect(foodX, foodY, 10, 10);
  snakeScreenContext.strokeRect(foodX, foodY, 10, 10);
};

// Snake movement
function moveSnake() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);

  if(ateSnakeFood(snake[0])) {
    score += 10;
    document.getElementById('score').innerHTML = score;
  } else {
    snake.pop();
  }
};

// Snake direction change
document.addEventListener('keydown', (e) => changeSnakeDirection(e.key));

function changeSnakeDirection(direction) {
  if (changingSnakeDirection) return;
  changingSnakeDirection = true;

  const goingLeft = dx === -10;
  const goingRight = dx === 10;
  const goingUp = dy === -10;
  const goingDown = dy === 10;

  direction = direction.toLowerCase();

  if (direction === leftKey[direction] && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (direction === rightKey[direction] && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (direction === upKey[direction] && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (direction === downKey[direction] && !goingUp) {
    dx = 0;
    dy = 10;
  }
};

// Snake food
function ateSnakeFood(part) {
  const ate = part.x === foodX && part.y === foodY;
  if (ate) {
    createSnakeFood();
    return true;
  }
  return false;
};

function createSnakeFood() {
  foodX = randomSnakeFood(0, snakeScreen.width - 10);
  foodY = randomSnakeFood(0, snakeScreen.height - 10);
  snake.forEach((part) => ateSnakeFood(part))
};

function randomSnakeFood(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
};

// Snake game over
function hitHisOwnBody() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x &&
      snake[i].y === snake[0].y
    ) return true;
    return false;
  };
};

function hitTheWall() {
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeScreen.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeScreen.height - 10;

  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
};

function gameOver() {
  return hitHisOwnBody() || hitTheWall();
};
