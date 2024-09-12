const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Define game states
let gameState = 'start'; // start, playing, paused, gameOver

// Add event listeners for starting, pausing, and leaving the game
document.addEventListener('keydown', async  function(event) {
    if (gameState === 'start' && event.key === 'Enter') {
        gameState = 'playing'; // Start the game
        await Tone.start();

        // Start the background music
        startBackgroundMusic();
    } else if (gameState === 'playing' && event.key === 'Escape') {
        gameState = 'paused'; // Pause the game
    } else if (gameState === 'paused' && event.key === ' ') {
        gameState = 'playing'; // Resume the game
    } else if (gameState === 'paused' && event.key === 'Escape') {
        gameState = 'gameOver'; // Leave the game
    } else if (gameState === 'gameOver' && event.key === 'Escape') {
        gameState = 'start'; // reset the game
    }
});

// // Initialize Tone.js sounds
// const backgroundMusic = new Tone.Loop((time) => {
//     const synth = new Tone.Synth().toDestination();
//     synth.triggerAttackRelease('C2', '8n', time);
//     synth.triggerAttackRelease('E5', '8n', time + 0.5);
//     synth.triggerAttackRelease('G3', '8n', time + 1);
//     synth.triggerAttackRelease('C4', '8n', time + 1.5);
// }, '2n').start(0);

const synth = new Tone.Synth().toDestination();
const melody = new Tone.Sequence(
  (time, note) => {
    synth.triggerAttackRelease(note, '8n', time);
  },
  ['C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'C4', 'E4', 'G4', 'E4', 'C4', 'G3'], // Example sequence
  '4n'
);

const shootSound = new Tone.Synth().toDestination();
const enemyHitSound = new Tone.MembraneSynth().toDestination();
const playerHitSound = new Tone.NoiseSynth({ volume: -10 }).toDestination();
const gameOverSound = new Tone.AMSynth().toDestination();

// Function to start background music
function startBackgroundMusic() {
    if (Tone.Transport.state !== 'started') {
        Tone.Transport.start();
    }
    melody.start(0); // Start the melody when the game starts
}

// Function to stop background music
function stopBackgroundMusic() {
    melody.stop();
}


function drawStartScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Press Enter to Start', canvas.width / 2, canvas.height / 2);
}

function drawPauseScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Paused', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press Space to Resume', canvas.width / 2, canvas.height / 2 + 40);
    ctx.fillText('Press Escape to Leave', canvas.width / 2, canvas.height / 2 + 80);
}

function drawGameOverScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Thanks for Playing!', canvas.width / 2, canvas.height / 2 + 40);
    ctx.fillText('Press Escape to Leave', canvas.width / 2, canvas.height / 2 + 80);
}

// Player object
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 10,
    height: 10,
    speed: 5,
    slowSpeed: 2, // Slower speed when shift is held
    bullets: [],
    moveLeft: false,
    moveRight: false,
    moveUp: false,
    moveDown: false,
    isSlow: false, // Track whether the player is moving slowly
    canShoot: true,
    lives: 3, // Player starts with 3 lives
    points: 0 // Player's points start at 0
};

const enemyPatterns = [
    {
        type: 'straight', // 直线运动
        speed: 1, // 速度
        direction: 90 // 方向（以角度表示，90度表示向下）
    },
    {
        type: 'wave', // 波浪形运动
        speed: 1,
        amplitude: 20, // 振幅
        frequency: 0.05 // 频率
    },
    {
        type: 'curve', // 曲线运动
        speed: 1,
        controlPoints: [{ x: 100, y: 200 }, { x: 200, y: 300 }] // 曲线控制点
    }
];

// Enemy and boss variables
let enemiesDefeated = 0;
let bossActive = false;
const enemies = [];
const enemyBullets = [];
let boss = null;

// Function to draw the player
function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw red point at the center of the player if moving slowly
    if (player.isSlow) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(player.x + player.width / 2, player.y + player.height / 2, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Function to draw player bullets
function drawPlayerBullets() {
    ctx.fillStyle = 'red';
    player.bullets.forEach((bullet, index) => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= 7; // Move bullet up

        // Remove bullets that go off screen
        if (bullet.y < 0) {
            player.bullets.splice(index, 1);
        }
    });
}

// Function to draw enemy bullets
function drawEnemyBullets() {
    ctx.fillStyle = 'yellow';
    enemyBullets.forEach((bullet, index) => {
        bullet.x += bullet.dx; // Move bullet along x-axis
        bullet.y += bullet.dy; // Move bullet along y-axis
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Remove bullets that go off screen
        if (bullet.y > canvas.height || bullet.x < 0 || bullet.x > canvas.width) {
            enemyBullets.splice(index, 1);
        }
    });
}

// Function to spawn enemies
function spawnEnemy() {
    const enemy = {
        x: Math.random() * (canvas.width - 20),
        y: 0,
        width: 20,
        height: 20,
        patternIndex: Math.floor(Math.random() * enemyPatterns.length) // 随机选择一个模式
    };
    enemies.push(enemy);
}

// Function to draw enemies
function drawEnemies() {
    ctx.fillStyle = 'green';
    enemies.forEach((enemy, index) => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.y += 1; // Move enemy down

        // Remove enemies that go off screen
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }

        // Make enemies shoot bullets
        if (Math.random() < 0.03) {
            shootEnemyBullets(enemy);
        }
    });
}

function updateEnemies() {
    enemies.forEach(enemy => {
        const pattern = enemyPatterns[enemy.patternIndex];

        switch (pattern.type) {
            case 'straight':
                enemy.y += pattern.speed; // 直线下移
                break;
            case 'wave':
                enemy.y += pattern.speed; // 下移
                enemy.x += Math.sin(enemy.y * pattern.frequency) * pattern.amplitude; // 波浪形移动
                break;
            case 'curve':
                // 在这里实现曲线运动的逻辑
                break;
            default:
                break;
        }

        // 移除超出画布的敌人
        if (enemy.y > canvas.height) {
            enemies.splice(enemies.indexOf(enemy), 1);
        }
    });
}

// Function to shoot enemy bullets in a pattern
function shootEnemyBullets(enemy) {
    const pattern = Math.floor(Math.random() * 3); // Randomly select one of three patterns
    switch (pattern) {
        case 0:
            shootCircularPattern(enemy);
            break;
        case 1:
            shootWavePattern(enemy);
            break;
        case 2:
            shootDirectedPattern(enemy);
            break;
    }
}

// Pattern 1: Circular pattern (same as before)
function shootCircularPattern(enemy) {
    const bulletSpeed = 2;
    const bulletCount = 12; // Number of bullets to shoot in a circular pattern

    for (let i = 0; i < bulletCount; i++) {
        const angle = (Math.PI * 2 / bulletCount) * i;
        const dx = Math.cos(angle) * bulletSpeed;
        const dy = Math.sin(angle) * bulletSpeed;
        enemyBullets.push({ x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height / 2, width: 5, height: 5, dx, dy });
    }
}

// Pattern 2: Wave pattern
function shootWavePattern(enemy) {
    const bulletSpeed = 2;
    const bulletCount = 6; // Number of bullets to shoot in a wave pattern

    for (let i = -bulletCount / 2; i < bulletCount / 2; i++) {
        const angle = Math.PI / 12 * i; // Spread bullets in a wave
        const dx = Math.sin(angle) * bulletSpeed;
        const dy = bulletSpeed; // All bullets move downward
        enemyBullets.push({ x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height / 2, width: 5, height: 5, dx, dy });
    }
}

// Pattern 3: Directed pattern towards player
function shootDirectedPattern(enemy) {
    const bulletSpeed = 3;
    const bulletCount = 3; // Number of bullets to shoot directly at the player

    for (let i = 0; i < bulletCount; i++) {
        const dx = (player.x + player.width / 2 - enemy.x - enemy.width / 2) * bulletSpeed / canvas.height;
        const dy = bulletSpeed;
        enemyBullets.push({ x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height / 2, width: 5, height: 5, dx, dy });
    }
}

// Function to handle boss behavior
function spawnBoss() {
    boss = {
        x: canvas.width / 2 - 75,
        y: 50,
        width: 150,
        height: 150,
        health: 50,
        speed: 2
    };
    bossActive = true;
}

function drawBoss() {
    if (boss) {
        ctx.fillStyle = 'purple';
        ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
        boss.x += boss.speed;

        // Reverse direction if boss hits screen edges
        if (boss.x <= 0 || boss.x + boss.width >= canvas.width) {
            boss.speed = -boss.speed;
        }

        // Boss shoots bullets in more complex patterns
        if (Math.random() < 0.1) {
            shootBossBullets(boss);
        }
    }
}

function shootBossBullets(boss) {
    const bulletSpeed = 3;
    const bulletCount = 24; // More bullets for the boss

    for (let i = 0; i < bulletCount; i++) {
        const angle = (Math.PI * 2 / bulletCount) * i;
        const dx = Math.cos(angle) * bulletSpeed;
        const dy = Math.sin(angle) * bulletSpeed;
        enemyBullets.push({ x: boss.x + boss.width / 2, y: boss.y + boss.height / 2, width: 5, height: 5, dx, dy });
    }
}

// Function to check for collisions
function checkCollisions() {
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    const hitboxRadius = 3; // Radius of the red point

    // Check collision between player bullets and enemies
    player.bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                // Remove enemy and bullet upon collision
                enemies.splice(enemyIndex, 1);
                player.bullets.splice(bulletIndex, 1);
                enemiesDefeated++;

                player.points += 100; // Add points for defeating an enemy

                // Spawn boss if enough enemies are defeated
                if (enemiesDefeated >= 10 && !bossActive) {
                    spawnBoss();
                    enemiesDefeated = 0; // Reset enemy count for next boss
                }
            }
        });

        if (boss) {
            if (
                bullet.x < boss.x + boss.width &&
                bullet.x + bullet.width > boss.x &&
                bullet.y < boss.y + boss.height &&
                bullet.y + bullet.height > boss.y
            ) {
                // Damage the boss
                boss.health--;
                player.bullets.splice(bulletIndex, 1);

                player.points += 500; // Add points for hitting the boss

                // Check if the boss is defeated
                if (boss.health <= 0) {
                    boss = null;
                    bossActive = false;
                    console.log("Boss defeated!");
                    player.points += 1000;// Add bonus points for defeating the boss
                }
            }
        }
    });

    // Check collision between enemy bullets and the player's center point (red dot)
    enemyBullets.forEach((bullet, bulletIndex) => {
        const distX = bullet.x + bullet.width / 2 - playerCenterX;
        const distY = bullet.y + bullet.height / 2 - playerCenterY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < hitboxRadius) {
            // Player hit by enemy bullet at the red point
            console.log("Player hit!");
            player.lives -= 1; // Subtract a life
            enemyBullets.splice(bulletIndex, 1);

            // Check if the player is out of lives
            if (player.lives <= 0) {
                console.log("Game Over");
                // Implement game over logic here, e.g., reset the game or end the game loop
                resetGame();
            }
        }
    });
}

// Function to handle player movement and shooting
function updatePlayer() {
    const speed = player.isSlow ? player.slowSpeed : player.speed;

    if (player.moveLeft && player.x > 0) player.x -= speed;
    if (player.moveRight && player.x < canvas.width - player.width) player.x += speed;
    if (player.moveUp && player.y > 0) player.y -= speed;
    if (player.moveDown && player.y < canvas.height - player.height) player.y += speed;

    if (player.canShoot) {
        player.shoot();
        player.canShoot = false;
        setTimeout(() => player.canShoot = true, 300); // Control shooting rate
    }
}

// Shooting method added to player object
player.shoot = function() {
    this.bullets.push({ x: this.x + this.width / 2 - 2.5, y: this.y, width: 5, height: 10 });
    // shootSound.triggerAttackRelease('E5', '8n');
};


// Function to update the HUD display
function updateHUD() {
    document.getElementById('lives').textContent = `Lives: ${player.lives}`;
    document.getElementById('points').textContent = `Points: ${player.points}`;
}

// Function to reset the game (you can customize this as needed)
function resetGame() {
    player.lives = 3;
    player.points = 0;
    enemiesDefeated = 0;
    bossActive = false;
    enemies.length = 0;
    enemyBullets.length = 0;
    boss = null;
    updateHUD();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameState === 'start') {
        drawStartScreen();
        startBackgroundMusic();  // Start music when the game is started
    } else if (gameState === 'playing') {
        updatePlayer();
        updateEnemies();
        drawPlayer();
        drawPlayerBullets();
        drawEnemyBullets();
        drawEnemies();
        checkCollisions();

        if (bossActive) {
            drawBoss();
        }

        updateHUD();
    } else if (gameState === 'paused') {
        drawPauseScreen();
        stopBackgroundMusic();  // Pause music when the game is paused
    } else if (gameState === 'gameOver') {
        drawGameOverScreen();
        stopBackgroundMusic();  // Stop music when the game is over
        gameOverSound.triggerAttackRelease('C3', '1n');
    }

    if (gameState !== 'gameOver') {
        requestAnimationFrame(gameLoop);
    }
}

// Handle player input
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') player.moveLeft = true;
    if (event.key === 'ArrowRight') player.moveRight = true;
    if (event.key === 'ArrowUp') player.moveUp = true;
    if (event.key === 'ArrowDown') player.moveDown = true;
    if (event.key === 'Shift') player.isSlow = true; // Enable slow mode
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowLeft') player.moveLeft = false;
    if (event.key === 'ArrowRight') player.moveRight = false;
    if (event.key === 'ArrowUp') player.moveUp = false;
    if (event.key === 'ArrowDown') player.moveDown = false;
    if (event.key === 'Shift') player.isSlow = false; // Disable slow mode
});

// Start the game
setInterval(spawnEnemy, 2000); // Spawn an enemy every 2 seconds
gameLoop();