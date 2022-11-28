//the lines on the board were unintentional idk
//not good at styling lol
let message = document.querySelector('#message')
const preGame = {
    countDownTimer(timer){  
        if (timer >= 0) {
            message.textContent = 'Rendering ' + timer;
           timer--  
        }
        return timer;
    },
    startGame(){
            let timer = 5
            let countDown = setInterval(function(){
                if(timer === 0){
                    clearInterval(countDown)
                    startSnake();

                    popUp.style.display = 'none'
                }
                timer = preGame.countDownTimer(timer)
            }, 1000)
        
    },
   
}
let snakeTable = document.querySelector(".snakeTable");
let squares = document.getElementsByClassName("square");
let popUp = document.querySelector(".popUp");
let start = document.querySelector(".start");
let points = document.querySelector('.pointsContainer')
let table = {
  rowsCols: 21,
  squares: 21*21
};

let snake = {
  direction: "right",
  position: [[6,10], [7,10], [8,10], [9,10], [10,10]],
  interval: 200,
  food: 0,
  score: 0,
  final: 0,
  time: 0,
  canTurn: 0,
  init: function() {
    snake.direction = "right";
    snake.position = [[6,10], [7,10], [8,10], [9,10], [10,10]];
    snake.interval = 200;
    snake.food = 0;
    snake.score = 0;
    snake.time = 0;
    snake.canTurn = 0;
    snakeTable.innerHTML = "";
    points.innerHTML = "";
    tableCreation();
  }
};

// init game
snake.init();
// start game
function startSnake() {
  popUp.style.display = 'none';
  snake.time = 1;
  renderSnake();
  randomFood();
  setInt = setInterval(function() {
    move();
  }, snake.interval);
}

//called after hitting snake or border
function gameOver() {
  clearInterval(setInt);
  snake.final = snake.score;
  start.querySelector("span").innerHTML = snake.final + " Points!";
  setTimeout(function() {
    start.querySelector("span").innerHTML = "Play Snake";
  }, 1500);
  snake.init();
  popUp.style.display = 'flex'
}

// checks if a move is even possible if is
//then the snake is updated and rendered
function move() {
  
  hitFood();
  hitBorder();
  hitSnake();
  
  updatePositions();
  renderSnake();
  document.addEventListener("keydown", turn);
  snake.canTurn = 1;
}

function updatePositions() {
  // remove last snake part (first snake pos)
  squares[snake.position[0][0] + snake.position[0][1] * table.rowsCols].classList.remove("snake");
  snake.position.shift();
  //we did not learn switch conditions in class i dont think
  //but i implemented something i saw online
  let head = snake.position[snake.position.length - 1];
  switch (snake.direction) {
    case "left":
      snake.position.push([head[0] - 1, head[1]]);
      break;
    case "up":
      snake.position.push([head[0], head[1] - 1]);
      break;
    case "right":
      snake.position.push([head[0] + 1, head[1]]);
      break;
    case "down":
      snake.position.push([head[0], head[1] + 1]);
      break;
    default:
      console.log("no direction !");
  }
}

// checks border contact
function hitBorder() {
  let headPos = snake.position.length-1;
  // goes of limits
  if (((snake.position[headPos][0] === table.rowsCols-1) && (snake.direction === "right")) || ((snake.position[headPos][0] === 0) && (snake.direction === "left")) || ((snake.position[headPos][1] === table.rowsCols-1) && (snake.direction === "down")) ||  ((snake.position[headPos][1] === 0) && (snake.direction === "up"))) {
    console.log("border hit");
    gameOver();
  }
}
//checks if snake hits itself
function hitSnake() {
    let headPos = snake.position.length-1;
    for (let i=0; i<headPos; i++) {
        console.log(snake.position[headPos].toString(),snake.position[i].toString())
      if (snake.position[headPos].toString() === snake.position[i].toString()) {
        console.log("snake hit");
        gameOver();
        console.log('hello')
        return true
      }
    } 
  }

// checks to see if head position and food position
//is equal and removes the food class generating new food and adding point
function hitFood() {
  let head = snake.position[snake.position.length-1];
  let tail = snake.position[0];
  console.log(head,foodPos)
  if (head.toString() === foodPos.toString()) {
    console.log('food')
    squares[random].classList.remove("food");
    snake.position.unshift(tail);
    console.log(snake.position)
    randomFood();
    snake.food++;
    snake.score += snake.food;
    scoreElt.innerHTML = snake.score + " pts";
    clearInterval(setInt);
    snake.interval = snake.interval - snake.interval/40;
    setInt = setInterval(function() {
      move();
    }, snake.interval);
  }
}
//generates random food position and checks to see if snake is there to rerender
function randomFood() {
  let randomX = Math.floor(Math.random() * table.rowsCols);
  let randomY = Math.floor(Math.random() * table.rowsCols);
  random = randomX + randomY * table.rowsCols;
  // picks another foodPos if food pops on snake
  while (squares[random].classList.contains("snake")) {
    randomX = Math.floor(Math.random() * table.rowsCols);
    randomY = Math.floor(Math.random() * table.rowsCols);
    random = randomX + randomY * table.rowsCols;
  }  
  squares[random].classList.add("food");
  foodPos = [randomX, randomY];
}

// adds the snake class as it updates position
function renderSnake() {
  for (let i=0; i<snake.position.length; i++) {
    squares[snake.position[i][0] + snake.position[i][1] * table.rowsCols].classList.add("snake");
  }
}
function turn(e) {
  if (snake.canTurn) {
    switch (e.keyCode) {
      case 13:
        break;
      case 37:// left
        if (snake.direction === "right") return;
        snake.direction = "left";
        break;
      case 38:// up
        if (snake.direction === "down") return;
        snake.direction = "up";
        break;
      case 39:// right
        if (snake.direction === "left") return;
        snake.direction = "right";
        break;
      case 40:// down
        if (snake.direction === "up") return;
        snake.direction = "down";
        break;
      default:
        console.log("wrong key");
    }
    snake.canTurn = 0;
  }
}
start.addEventListener("click", preGame.startGame);
// table creation
function tableCreation() {
    
  if (snakeTable.innerHTML === "") {
    // main table
    for (let i = 0; i<table.squares; i++) {
      let divElt = document.createElement("div");
      divElt.classList.add("square");
      snakeTable.appendChild(divElt);
    }
    if(points.innerHTML === ''){
        let statusElt = document.createElement("div");
        statusElt.classList.add("pts");
        points.appendChild(statusElt);
        scoreElt = document.createElement("span");
        scoreElt.classList.add("score");
        scoreElt.innerHTML = snake.score + " pts";
        statusElt.appendChild(scoreElt);
    }
    
  }
  
}