const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const gameUI = document.getElementById('gameUI');
const gameOverScreen = document.getElementById('gameOver');
const retryButton = document.getElementById('retryButton');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('finalScore');

const tileCount = 20;
const tileSize = canvas.width / tileCount;

let snake = [{ x: 10, y: 10 }];
// Default velocity so the snake moves right when a new game starts
let velocity = { x: 1, y: 0 };
let apple = { x: 5, y: 5 };
let growing = 0;
let score = 0;
let running = false;

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    // Start with a small movement to avoid immediate self-collision
    velocity = { x: 1, y: 0 };
    apple = randomApple();
    growing = 0;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    running = true;
    gameOverScreen.classList.add('hidden');
    requestAnimationFrame(gameLoop);
}

function randomApple() {
    let newApple;
    do {
        newApple = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (snake.some(segment => segment.x === newApple.x && segment.y === newApple.y));
    return newApple;
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * tileSize, apple.y * tileSize, tileSize, tileSize);

    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });
}

function update() {
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

    // Only treat moving onto the snake body as a collision if the snake has
    // actually moved before (length > 1). This prevents an immediate game over
    // when the velocity is {x: 0, y: 0}.
    const hitSelf = snake.length > 1 &&
        snake.some(segment => segment.x === head.x && segment.y === head.y);

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount ||
        hitSelf) {
        running = false;
        finalScoreDisplay.textContent = `Score: ${score}`;
        gameOverScreen.classList.remove('hidden');
        return;
    }

    snake.unshift(head);
    if (head.x === apple.x && head.y === apple.y) {
        growing += 1;
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
        apple = randomApple();
    }
    if (growing > 0) {
        growing -= 1;
    } else {
        snake.pop();
    }
}

function gameLoop() {
    if (!running) return;
    update();
    draw();
    setTimeout(() => requestAnimationFrame(gameLoop), 100);
}

function handleKey(e) {
    switch (e.key) {
        case 'ArrowUp':
            if (velocity.y === 1) break;
            velocity = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (velocity.y === -1) break;
            velocity = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (velocity.x === 1) break;
            velocity = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (velocity.x === -1) break;
            velocity = { x: 1, y: 0 };
            break;
    }
}

startButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameUI.classList.remove('hidden');
    resetGame();
});

retryButton.addEventListener('click', () => {
    resetGame();
});

window.addEventListener('keydown', handleKey);
