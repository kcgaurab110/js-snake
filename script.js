const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highscoreDisplay = document.getElementById('highscore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

// Game variables
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 1;
let dy = 0;
let score = 0;
let highscore = localStorage.getItem('snakeHighscore') || 0;
let gameActive = false;
let gamePaused = false;
let gameLoop;

// Display high score
highscoreDisplay.textContent = highscore;

// Start game
startBtn.addEventListener('click', () => {
    if (!gameActive) {
        gameActive = true;
        gamePaused = false;
        snake = [{ x: 10, y: 10 }];
        food = generateFood();
        score = 0;
        dx = 1;
        dy = 0;
        scoreDisplay.textContent = score;
        pauseBtn.textContent = 'Pause';
        startBtn.textContent = 'Restart';
        clearInterval(gameLoop);
        gameLoop = setInterval(update, 100);
    }
});

// Pause game
pauseBtn.addEventListener('click', () => {
    if (gameActive) {
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
        if (!gamePaused) {
            gameLoop = setInterval(update, 100);
        } else {
            clearInterval(gameLoop);
        }
    }
});

// Generate random food
function generateFood() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

// Update game state
function update() {
    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame();
        return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        food = generateFood();
    } else {
        snake.pop();
    }

    draw();
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#00ff00';
        } else {
            ctx.fillStyle = '#00cc00';
        }
        ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
    });

    // Draw food
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw pause text
    if (gamePaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }
}

// End game
function endGame() {
    gameActive = false;
    clearInterval(gameLoop);
    
    if (score > highscore) {
        highscore = score;
        highscoreDisplay.textContent = highscore;
        localStorage.setItem('snakeHighscore', highscore);
    }
    
    alert(`Game Over! Score: ${score}\nHigh Score: ${highscore}`);
    startBtn.textContent = 'Start Game';
    pauseBtn.textContent = 'Pause';
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameActive) return;

    switch (e.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -1; }
            e.preventDefault();
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = 1; }
            e.preventDefault();
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -1; dy = 0; }
            e.preventDefault();
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = 1; dy = 0; }
            e.preventDefault();
            break;
    }
});

// Initial draw
draw();