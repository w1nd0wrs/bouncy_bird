const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startScreen = document.getElementById('start-screen');

canvas.width = 480;
canvas.height = 640;

let gameState = 'start';
let score = 0;
let frames = 0;

const bird = {
  x: 100,
  y: 300,
  width: 34,
  height: 26,
  velocity: 0,
  gravity: 0.5,
  jump: -8,
  
  draw() {
    ctx.fillStyle = '#f8e052';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.x + 24, this.y + 4, 10, 10);
    ctx.fillStyle = '#000';
    ctx.fillRect(this.x + 28, this.y + 6, 4, 4);
    
    ctx.fillStyle = '#ff6b00';
    ctx.fillRect(this.x + 28, this.y + 16, 12, 8);
  },
  
  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
  },
  
  flap() {
    this.velocity = this.jump;
  }
};

const pipes = [];
const pipeWidth = 52;
const pipeGap = 150;
const pipeSpacing = 180;

function drawPipes() {
  ctx.fillStyle = '#73bf2e';
  ctx.strokeStyle = '#558c22';
  ctx.lineWidth = 3;
  
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
    ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.topHeight);
    
    ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);
    ctx.strokeRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);
    
    ctx.fillStyle = '#8ed63e';
    ctx.fillRect(pipe.x - 3, pipe.topHeight - 24, pipeWidth + 6, 24);
    ctx.fillRect(pipe.x - 3, canvas.height - pipe.bottomHeight, pipeWidth + 6, 24);
    ctx.fillStyle = '#73bf2e';
  });
}

function updatePipes() {
  if (frames % pipeSpacing === 0) {
    const minPipeHeight = 80;
    const maxPipeHeight = canvas.height - pipeGap - minPipeHeight;
    const topHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
    
    pipes.push({
      x: canvas.width,
      topHeight: topHeight,
      bottomHeight: canvas.height - pipeGap - topHeight,
      passed: false
    });
  }
  
  pipes.forEach(pipe => {
    pipe.x -= 3;
  });
  
  while (pipes.length > 0 && pipes[0].x < -pipeWidth) {
    pipes.shift();
  }
}

function checkCollision() {
  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    return true;
  }
  
  for (let pipe of pipes) {
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.topHeight || bird.y + bird.height > canvas.height - pipe.bottomHeight)
    ) {
      return true;
    }
  }
  
  return false;
}

function resetGame() {
  bird.y = 300;
  bird.velocity = 0;
  pipes.length = 0;
  score = 0;
  frames = 0;
  scoreDisplay.textContent = 'Score: 0';
}

function gameOver() {
  gameState = 'gameover';
  startScreen.innerHTML = `Game Over!<br>Final Score: ${score}<br><br>Click or Press Space to Restart`;
  startScreen.classList.remove('hidden');
}

function update() {
  if (gameState !== 'playing') return;
  
  bird.update();
  updatePipes();
  
  pipes.forEach(pipe => {
    if (!pipe.passed && bird.x > pipe.x + pipeWidth) {
      score++;
      scoreDisplay.textContent = 'Score: ' + score;
      pipe.passed = true;
    }
  });
  
  if (checkCollision()) {
    gameOver();
  }
  
  frames++;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#70c5ce');
  gradient.addColorStop(1, '#ffffff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#ded895';
  ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
  ctx.strokeStyle = '#cbb968';
  ctx.strokeRect(0, canvas.height - 20, canvas.width, 20);
  
  drawPipes();
  bird.draw();
  
  requestAnimationFrame(() => {
    update();
    draw();
  });
}

function handleInput() {
  if (gameState === 'start') {
    gameState = 'playing';
    startScreen.classList.add('hidden');
    bird.flap();
  } else if (gameState === 'playing') {
    bird.flap();
  } else if (gameState === 'gameover') {
    resetGame();
    startScreen.classList.add('hidden');
    gameState = 'playing';
    bird.flap();
  }
}

canvas.addEventListener('mousedown', handleInput);

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'KeyW') {
    e.preventDefault();
    handleInput();
  }
});

draw();