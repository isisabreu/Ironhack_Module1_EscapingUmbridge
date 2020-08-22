const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

class Board {
  constructor() {
    canvas.width = 700
    canvas.height = 500
    this.img = new Image();
    this.img.src = './Images/576.jpg';
    this.y = 0;
    this.x = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.speed = 2;
    this.interval = undefined;
    this.frames = 100;
    this.img.onload = () => {
      this.draw();
      this.loadScreen();
    };
  }
  clean() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  draw() {
    this.x--;
    if (this.x < -this.width) this.x = 0;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.drawImage(this.img, this.x + this.width, this.y, this.width, this.height);
  }
  loadScreen() {
    const logo = new Image();
    logo.src = './Images/Harry.png';
    ctx.drawImage(logo, 10, 20, 200, 200);
    ctx.font = '30px Arial';
    ctx.fillText('Press Start Game', 100, 200);
    ctx.font = '30px Arial';
    ctx.fillText('And use x to hold youself in the air!', 100, 300);
  }
  gameOver() {
    clearInterval(this.interval);
    location.href = "./loserpage.html";
  }
  
  Win() {
    clearInterval(this.interval);
    location.href = "./winnerpage.html";
  }
}

class Harry {
  constructor() {
    this.x = 40;
    this.y = 40;
    this.img = new Image();
    this.img.src = './Images/Harry.png';
    this.height = 90;
    this.width = 120;
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    this.y + this.height >= canvas.height ? (this.y = canvas.height - this.height) : (this.y += 3);
  }
  fly() {
    this.y -= 50;
  }
  crash(obstacle) {
    if (
      obstacle.x < this.x + this.width &&
      obstacle.x + obstacle.width > this.x &&
      obstacle.lowerY < this.y + this.height &&
      obstacle.height + obstacle.lowerY > this.y
    )
      return true;
    else if (
      obstacle.x < this.x + this.width &&
      obstacle.x + obstacle.width > this.x &&
      obstacle.upperY < this.y + this.height &&
      obstacle.height + obstacle.upperY > this.y
    )
      return true;
      else if (
        obstacle.x < this.x + this.width &&
        obstacle.x + obstacle.width > this.x &&
        obstacle.champY < this.y + this.height &&
        obstacle.height + obstacle.champY > this.y
      )
        return true;
  }
}

class Obstacle {
  constructor() {
    this.width = 140;
    this.height = 120;
    this.upperimg = new Image();
    this.upperimg.src = './Images/Umbridge.png';
    this.lowerimg = new Image();
    this.lowerimg.src = './Images/Dementor.png';
    this.score = 0;
    this.obstacleOnScreen = [{}];
    this.x = canvas.width;
    this.lowerY = undefined;
    this.upperY = undefined;

  }

  draw() {
    this.x--;
    ctx.drawImage(this.lowerimg, this.x, this.lowerY, this.width, this.height);
    ctx.drawImage(this.upperimg, this.x, this.upperY, this.width, this.height);
  }

  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  randomWindow() {
    this.lowerY = this.randomNumber(20,50);
    this.upperY = this.randomNumber(400,440)
  }
}

class ChampionObstacle {
  constructor() {
    this.width = 60;
    this.height = 45;
    this.championimg= new Image();
    this.championimg.src = "./Images/Hogwarts.png";
    this.x = canvas.width;
    this.champY = 250;
  }

  draw() {
    this.x--;
    ctx.drawImage(this.championimg, this.x, this.champY, this.width, this.height);
  }
}
// Instances
const board = new Board(canvas);
const harry = new Harry();

// Aux variables
let obstacleOnScreen = [];
let frames = 0;
let points = 0;

// Listeners
document.addEventListener('keydown', ({ keyCode }) => {
  if (keyCode === 88) harry.fly();
});
window.onload = () => {
  document.getElementById('start-button').onclick = () => startGame();
};

// main functions
const startGame = () => {
  if (board.interval) {
    window.location.reload();
    return;
  }
  document.getElementById('start-button').innerText='Restart';
  board.interval = setInterval(updategame, 1000 / 60);
};

let hasCastle = false;
const updategame = () => {
  frames++;
  board.clean();
  board.draw();
  harry.draw();
  if (harry.y + harry.height >= canvas.height) board.gameOver();
  if (frames % 250 === 0) {
    const obstacle = new Obstacle();
    obstacle.randomWindow();
    obstacleOnScreen.push(obstacle);
  }
  let rand = Math.random();
  
  if (frames > 1100 && rand > 0.999 && !hasCastle) {
    hasCastle = true;
    const champObstacle = new ChampionObstacle();
    obstacleOnScreen.push(champObstacle);
  }

  obstacleOnScreen.forEach((obs) => {
    if (obs.x + obs.width <= 0) {
      obstacleOnScreen.shift();
      points++;
    }
    obs.draw();
    if (harry.crash(obs)) {
      if (obs instanceof ChampionObstacle) {
        board.Win();
      } else {
        board.gameOver(); 
      }
    }
  });

  ctx.font = '9px Arial';
  ctx.fillText(`Score: ${points}`, 20, 20);
};