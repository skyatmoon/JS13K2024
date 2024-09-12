const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const rainContainer = document.querySelector('.rain');

// Function to create raindrops
function createRain() {
    // Select the container element to get its width
    const container = document.querySelector('.container');
    const containerWidth = container.clientWidth; // Get the width of the container

    for (let i = 0; i < 100; i++) {
        const raindrop = document.createElement('div');
        raindrop.classList.add('raindrop');
        
        // Randomly position the raindrop within the container's width
        raindrop.style.left = `${Math.random() * containerWidth}px`;
        
        // Randomize the animation duration for a more natural look
        raindrop.style.animationDuration = `${1 + Math.random()}s`;
        
        rainContainer.appendChild(raindrop);
    }
}

createRain();
// music
let audioContext;
let gainNode;
let isPlaying = false;

const musicnotes = [[0, 15], [1, 15], [3, 10], [4, 10], [6, 8], [7, 8], [9, 7], [10, 7], [11, 7], [12, 7], [13, 7], [14, 7], [15, 5], 
        [16, 5], [17, 8], [18, 8], [19, 8], [20, 8], [21, 8], [22, 8], [23, 7], [24, 7], [25, 10], [26, 10], [27, 10], 
        [28, 10], [29, 10], [30, 10], [31, 10], [32, 10], [34, 10], [35, 10], [36, 11], [37, 11], [38, 10], [39, 10], 
        [40, 8], [41, 8], [42, 7], [43, 7], [44, 8], [45, 8], [46, 7], [47, 7], [48, 5], [49, 5], [50, 3], [51, 3], [33, 10], 
        [54, 3], [55, 3], [58, 3], [59, 3], [60, 3], [61, 3], [62, 3], [63, 3], [64, 3], [65, 3], [66, 3], [67, 3], [68, 5], 
        [69, 5], [70, 3], [72, 2], [73, 2], [74, 2], [75, 2], [76, 2], [77, 2], [78, 2], [79, 2], [71, 3], [80, 8], [81, 8], 
        [82, 8], [83, 8], [84, 7], [85, 7], [87, 5], [89, 3], [90, 3], [91, 3], [92, 3], [93, 3], [94, 3], [95, 3], [96, 3], 
        [97, 10], [98, 10], [99, 10], [100, 10], [102, 10], [103, 10], [104, 8], [105, 8], [106, 7], [107, 7], [110, 7], 
        [111, 7], [112, 5], [113, 5], [114, 8], [115, 8], [118, 8], [119, 8], [120, 7], [121, 7], [122, 10], [123, 10], 
        [124, 10], [125, 10], [101, 10], [32, 8], [33, 8], [41, 5], [42, 5], [71, 5], [88, 7], [89, 5]];

const a = (notes, center, duration, decaystart, decayduration, interval, volume, waveform) => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        
        for (let i of notes) {
            const oscillator = audioContext.createOscillator();
            oscillator.frequency.setValueAtTime(center * 1.06 ** (13 - i[1]), audioContext.currentTime + i[0] * interval);
            oscillator.type = waveform;
            
            const noteGain = audioContext.createGain();
            noteGain.gain.setValueAtTime(volume, audioContext.currentTime + i[0] * interval);
            noteGain.gain.setTargetAtTime(1e-5, audioContext.currentTime + i[0] * interval + decaystart, decayduration);

            oscillator.connect(noteGain);
            noteGain.connect(gainNode);
            
            oscillator.start(audioContext.currentTime + i[0] * interval);
            oscillator.stop(audioContext.currentTime + i[0] * interval + duration);
        }
    };

function playMusic() {
    if (isPlaying) {
        return;
    } else{
        isPlaying = true;
        a(musicnotes, 220, .9, .1, .005, .2, .1, 'triangle');
        setTimeout(() => {
            isPlaying = false;
        }, 26000);}
    }
var music;

let // ZzFXMicro - Zuper Zmall Zound Zynth - v1.3.1 by Frank Force ~ 1000 bytes
zzfxV=.3,               // volume
zzfxX=new AudioContext, // audio context
zzfx=                   // play sound
(p=1,k=.05,b=220,e=0,r=0,t=.1,q=0,D=1,u=0,y=0,v=0,z=0,l=0,E=0,A=0,F=0,c=0,w=1,m=0,B=0
,N=0)=>{let M=Math,d=2*M.PI,R=44100,G=u*=500*d/R/R,C=b*=(1-k+2*k*M.random(k=[]))*d/R,
g=0,H=0,a=0,n=1,I=0,J=0,f=0,h=N<0?-1:1,x=d*h*N*2/R,L=M.cos(x),Z=M.sin,K=Z(x)/4,O=1+K,
X=-2*L/O,Y=(1-K)/O,P=(1+h*L)/2/O,Q=-(h+L)/O,S=P,T=0,U=0,V=0,W=0;e=R*e+9;m*=R;r*=R;t*=
R;c*=R;y*=500*d/R**3;A*=d/R;v*=d/R;z*=R;l=R*l|0;p*=zzfxV;for(h=e+m+r+t+c|0;a<h;k[a++]
=f*p)++J%(100*F|0)||(f=q?1<q?2<q?3<q?Z(g**3):M.max(M.min(M.tan(g),1),-1):1-(2*g/d%2+2
)%2:1-4*M.abs(M.round(g/d)-g/d):Z(g),f=(l?1-B+B*Z(d*a/l):1)*(f<0?-1:1)*M.abs(f)**D*(a
<e?a/e:a<e+m?1-(a-e)/m*(1-w):a<e+m+r?w:a<h-c?(h-a-c)/t*w:0),f=c?f/2+(c>a?0:(a<h-c?1:(
h-a)/c)*k[a-c|0]/2/p):f,N?f=W=S*T+Q*(T=U)+P*(U=f)-Y*V-X*(V=W):0),x=(b+=u+=y)*M.cos(A*
H++),g+=x+x*E*Z(a**5),n&&++n>z&&(b+=v,C+=v,n=0),!l||++I%l||(b=C,u=G,n=n||1);p=zzfxX.
createBuffer(1,h,R);p.getChannelData(0).set(k);b=zzfxX.createBufferSource();
b.buffer=p;b.connect(zzfxX.destination);b.start()}

// Define game states
let gameState = 'start';
let currentLevel = 1;
const totalLevels = 13;
let animationFrameId;
let godtime = false;
var fps = 60;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;
var time = 0;
var frame = 0;

// Player object
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 20,
    height: 20,
    speed: 5,
    slowSpeed: 2,
    bullets: [],
    moveLeft: false,
    moveRight: false,
    moveUp: false,
    moveDown: false,
    isSlow: false,
    canShoot: true,
    lives: 13,
    shoot: function() {
        this.bullets.push({ x: this.x + this.width / 2 - 2.5, y: this.y, width: 5, height: 10 });
    }
};

const explosions = [];

function createExplosion(x, y, size, maxSize) {
    explosions.push({
        x: x,
        y: y,
        size: size,
        maxSize: maxSize,
        duration: 30, // Number of frames the explosion will last
        opacity: 1.0
    });
}

// Boss variables
let bossActive = false;
let boss = null;
const enemyBullets = [];



// Function to draw the player
function drawPlayer() {
    if (godtime) {
        ctx.globalAlpha = 0.5; // Make the player semi-transparent during godtime
    } else {
        ctx.globalAlpha = 1; // Full opacity when not in godtime
    }
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    if (player.isSlow) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(player.x + player.width / 2, player.y + player.height / 2, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = 1;
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

// Player movement and shooting
function updatePlayer() {
    const speed = player.isSlow ? player.slowSpeed : player.speed;

    if (player.moveLeft && player.x > 0) player.x -= speed;
    if (player.moveRight && player.x < canvas.width - player.width) player.x += speed;
    if (player.moveUp && player.y > 0) player.y -= speed;
    if (player.moveDown && player.y < canvas.height - player.height) player.y += speed;

    if (player.canShoot) {
        player.shoot();
        player.canShoot = false;
        setTimeout(() => player.canShoot = true, 300);
    }
}

// Consolidated function to draw different game screens
function drawScreen(textLines, bgColor = 'white', textColor = 'black') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = textColor;
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    
    textLines.forEach((line, index) => {
        ctx.fillText(line.text, canvas.width / 2, canvas.height / 2 + index * 40);
    });
}

let bossHitFlash = false;
let bossHitTimer = 0;
let gamePhase = 'flyingToBoss'; // Add different phases: 'flyingToBoss', 'bossIntro', 'fightingBoss'
let preBossFlyTime = 2000; // Time for the player to fly before the boss appears
let bossIntroTime = 3000; // Time for the boss to say something before the fight
let bossReady = false;

function startFlyingToBoss() {
    gamePhase = 'flyingToBoss';
    setTimeout(() => {
        startBossIntro();
    }, preBossFlyTime); // After flying for a while, go to the boss intro
}

function updateFlyingToBoss() {
    // Move player up
    if (player.y > 100) { // Make the player fly to around the top part of the screen
        player.y -= 1;
    }
    drawPlayer(); // Continue drawing the player during the flying phase
}

function startBossIntro() {
    // console.log('Starting boss intro');
    gamePhase = 'bossIntro';
    setTimeout(() => {
        bossReady = true;
        gamePhase = 'fightingBoss';
    }, bossIntroTime); // After showing the message, start the boss fight
}

function drawBossIntro() {
    if (currentLevel === 1) {
        drawScreen([{ text: 'Hey!' }, { text: 'Bad Raining, Right?' }, { text: 'Oh! Clam Down!' }], 'black', 'white');
    } else if (currentLevel === 2) {
        drawScreen([{ text: 'Where I Am?' }, { text: 'The Elevator?' }, { text: 'Who Are You?' }], 'black', 'white');
    } else if (currentLevel === 3) {
        drawScreen([{ text: 'Help!' }, { text: 'Take Me Out!' }, { text: 'Let Me Back Home!' }], 'black', 'white');
    } else if (currentLevel === 4) {
        drawScreen([{ text: 'You come far!' }, { text: currentLevel + 'Level welcome.' }, { text: 'BUT NOT YOU!' }], 'black', 'white');
    } else if (currentLevel === 5) {
        drawScreen([{ text: 'You come far!' }, { text: currentLevel + 'Level welcome.' }, { text: 'BUT NOT YOU!' }], 'black', 'white');
    } else if (currentLevel === 6) {
        drawScreen([{ text: 'You come far!' }, { text: currentLevel + 'Level welcome.' }, { text: 'BUT NOT YOU!' }], 'black', 'white');
    } else if (currentLevel === 7) {
        drawScreen([{ text: 'You come far!' }, { text: currentLevel + 'Level welcome.' }, { text: 'BUT NOT YOU!' }], 'black', 'white');
    } else if (currentLevel === 8) {
        drawScreen([{ text: 'You come far!' }, { text: currentLevel + 'Level welcome.' }, { text: 'BUT NOT YOU!' }], 'black', 'white');
    } else if (currentLevel === 9) {
        drawScreen([{ text: 'You come far!' }, { text: currentLevel + 'Level welcome.' }, { text: 'BUT NOT YOU!' }], 'black', 'white');
    } else if (currentLevel === 10) {
        drawScreen([{ text: 'You come far!' }, { text: currentLevel + 'Level welcome.' }, { text: 'BUT NOT YOU!' }], 'black', 'white');
    } else if (currentLevel === 11) {
        drawScreen([{ text: 'You come far!' }, { text: currentLevel + 'Level welcome.' }, { text: 'BUT NOT YOU!' }], 'black', 'white');
    } else if (currentLevel === 12) {
        drawScreen([{ text: 'You come far!' }, { text: currentLevel + 'Level welcome.' }, { text: 'BUT NOT YOU!' }], 'black', 'white');
    } else if (currentLevel === 13) {
        drawScreen([{ text: 'You come far!' }, { text: currentLevel + 'Level welcome.' }, { text: 'BUT NOT YOU!' }], 'black', 'white');
    }                              
}

function drawBoss() {
    if (boss) {
        // Flashing logic
        if (bossHitFlash) {
            ctx.fillStyle = 'lightgray'; // Flash white when hit
            bossHitTimer--;
            if (bossHitTimer <= 0) {
                bossHitFlash = false; // Stop flashing after some time
            }
        } else {
            ctx.fillStyle = 'black'; // Default boss color
        }

        ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
        boss.x += boss.speed;

        if (boss.x <= 0 || boss.x + boss.width >= canvas.width) {
            boss.speed = -boss.speed;
        }

        if (frame % 5 === 0) {
            shootBossBullets(boss);
        }
    }
}

// Function to handle boss behavior
function spawnBoss(level) {
    // Bosses get progressively harder with each level
    boss = {
        x: canvas.width / 2 - 75,
        y: 50,
        width: 150,
        height: 150,
        maxHealth: 50 + (level - 1) * 10,  // Base health increases with level
        health: 50 + (level - 1) * 10, // The current health starts at the max value
        speed: 1,// Increase speed slightly each level
    };
    bossActive = true;
}

function drawBossHealthBar() {
    const barWidth = canvas.width - 40; // Full width minus some padding
    const barHeight = 20;
    const barX = 20; // Padding from the left edge
    const barY = 10; // Padding from the top edge

    // Calculate the current health percentage
    const healthPercentage = boss.health / boss.maxHealth;

    // Draw the health bar background (gray)
    ctx.fillStyle = '#444';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Draw the current health bar (red for health)
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);

    // Optional: Add a border for the health bar
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
}
let angleOffset = 0;
// Function to shoot boss bullets
function shootBossBullets(boss) {
    
    generateBulletsPattern(boss, 1, 16, butterflyCurvePattern, Math.PI / 90);
    
}

function generateBulletsPattern(boss, bulletSpeed, bulletCount, patternFunction, anglechange) {
    for (let i = 0; i < bulletCount; i++) {
        const { dx, dy } = patternFunction(i, bulletCount, boss, player); // Include player position
        enemyBullets.push({
            x: boss.x + boss.width / 2,
            y: boss.y + boss.height / 2,
            width: 5,
            height: 5,
            dx: (dx + 0.01) * bulletSpeed,
            dy: (dy + 0.01) * bulletSpeed
        });
    }
    angleOffset += anglechange;
   
}

// Function to draw enemy bullets
function drawEnemyBullets() {
    if (currentLevel === 13) {
        ctx.fillStyle = 'black';
    } else {ctx.fillStyle = 'yellow';}
    for (let index = enemyBullets.length - 1; index >= 0; index--) {
        const bullet = enemyBullets[index];

        // Update bullet position
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        // Draw the bullet at the updated position
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        // ctx.fillText('1 3', bullet.x, bullet.y, bullet.width, bullet.height);

        // Remove bullets that go off screen
        if (
            bullet.y > canvas.height || 
            bullet.y < 0 || 
            bullet.x < 0 || 
            bullet.x > canvas.width
        ) {
            enemyBullets.splice(index, 1); // Safely remove the bullet
        }
    }
}
//combine got new
//level 3: generateBulletsPattern(boss, 2, 8, circularPattern, Math.PI / 27); generateBulletsPattern(boss, 1, 8, subwayPattern, Math.PI / 60);
//leve;4 generateBulletsPattern(boss, 2, 6, decircularPattern, Math.PI / 180); generateBulletsPattern(boss, 2, 6, circularPattern, Math.PI / 180);

function circularPattern(i, bulletCount, boss, player) {
    boss.speed = 0;
    const angle = (Math.PI * 2 / bulletCount) * i + angleOffset;
    return {
        dx: Math.cos(angle),
        dy: Math.sin(angle)
    };//level 2 boss pattern, boss speed = 0, generateBulletsPattern(boss, 2, 8, circularPattern, Math.PI / 180);
    //level 1 boss pattern, boss speed = 0, generateBulletsPattern(boss, 2, 8, circularPattern, Math.PI / 27);
}

function lissajousCurvePattern(i, bulletCount, boss, player) {
    const a = 3; // Frequency along the x-axis
    const b = 2; // Frequency along the y-axis
    const angle = (Math.PI * 2 / bulletCount) * i + angleOffset;
    return {
        dx: Math.sin(a * angle),
        dy: Math.sin(b * angle)
    };
}

function butterflyCurvePattern(i, bulletCount, boss, player) {
    boss.speed = 0;
    const angle = (Math.PI * 2 / bulletCount) * i + angleOffset;
    const r = Math.exp(Math.sin(angle)) - 2 * Math.cos(4 * angle) + Math.pow(Math.sin((2 * angle - Math.PI) / 24), 5);
    return {
        dx: r * Math.cos(angle),
        dy: r * Math.sin(angle)
    };
}

function hypotrochoidPattern(i, bulletCount, boss, player) {
    const R = 6; // Radius of the larger circle
    const r = 2; // Radius of the smaller circle
    const d = 4; // Distance of the point from the smaller circle
    const angle = (Math.PI * 2 / bulletCount) * i + angleOffset;
    const x = (R - r) * Math.cos(angle) + d * Math.cos(((R - r) / r) * angle);
    const y = (R - r) * Math.sin(angle) - d * Math.sin(((R - r) / r) * angle);
    return {
        dx: x / R,
        dy: y / R
    };
}

function decircularPattern(i, bulletCount, boss, player) {
    boss.speed = 0;
    const angle = (Math.PI * 2 / bulletCount) * i + angleOffset;
    return {
        dx: Math.sin(angle),
        dy: Math.cos(angle)
    };
}//combine

function subwayPattern(i, bulletCount, boss, player) {
    const angle = (Math.PI * 2 / bulletCount) * i + angleOffset;
    return {
        dx: Math.cos(angle),
        dy: Math.sin(angle)
    };
    //level 7 boss pattern, boss speed = 1, generateBulletsPattern(boss, 3, 16, subwayPattern, Math.PI / 120);
    //level 13 boss pattern, boss speed = 1, generateBulletsPattern(boss, 1, 32, subwayPattern, Math.PI / 60);
}

function trochoidFlowerPattern(i, bulletCount, boss, player) {
    // boss.speed = 0;
    const k = 4; // Controls the number of petals
    const angle = (Math.PI * 2 / bulletCount) * i + angleOffset;
    return {
        dx: Math.cos(k * angle) * Math.cos(angle),
        dy: Math.sin(k * angle) * Math.sin(angle)
    };
}//level 5 generateBulletsPattern(boss, 3, 8, trochoidFlowerPattern, Math.PI / 60); 

function trochoidFlowerPattern2(i, bulletCount, boss, player) {
    // boss.speed = 0;
    const k = 2; // Controls the number of petals
    const angle = (Math.PI * 2 / bulletCount) * i + angleOffset;
    return {
        dx: Math.cos(k * angle) * Math.cos(angle),
        dy: Math.sin(k * angle) * Math.sin(angle)
    };
}//level 12 generateBulletsPattern(boss, 1, 16, trochoidFlowerPattern2, Math.PI / 72);


////////////////////////////////////////////////////////////////////////////////////////
function drawExplosions() {
    explosions.forEach((explosion, index) => {
        ctx.save();
        ctx.globalAlpha = explosion.opacity;
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (explosion.size < explosion.maxSize) {
            explosion.size += 1;
        }
        explosion.opacity -= 0.03;

        // Remove explosion when it finishes
        if (explosion.opacity <= 0) {
            explosions.splice(index, 1);
        }
    });
}

// Collision detection and game over logic
function checkCollisions() {
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    const hitboxRadius = 3;

    // Check collision between player bullets and boss
    player.bullets.forEach((bullet, bulletIndex) => {
        if (boss) {
            if (
                bullet.x < boss.x + boss.width &&
                bullet.x + bullet.width > boss.x &&
                bullet.y < boss.y + boss.height &&
                bullet.y + bullet.height > boss.y
            ) {
                boss.health--;
                player.bullets.splice(bulletIndex, 1);
                zzfx(...[,,129,.01,,.15,,,,,,,,5]);
                

                createExplosion(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2, 5, 10);

                bossHitFlash = true;
                bossHitTimer = 5; // Duration of the flash

                if (boss.health <= 0) {
                    boss = null;
                    bossActive = false;
                    zzfx(...[,,172,.8,,.8,1,.76,7.7,3.73,-482,.08,.15,,.14]);
                    advanceLevel();
                }
            }
        }
    });

    // Check collision between enemy bullets and player
    enemyBullets.forEach((bullet, bulletIndex) => {
        const distX = bullet.x + bullet.width / 2 - playerCenterX;
        const distY = bullet.y + bullet.height / 2 - playerCenterY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < hitboxRadius && !godtime) {
            player.lives -= 1;
            enemyBullets.splice(bulletIndex, 1);
            zzfx(...[,,333,.01,0,.9,4,1.9,,,,,,.5,,.6]);

            createExplosion(player.x + player.width / 2, player.y + player.height / 2, 10, 30);

            if (player.lives < 0) {
                resetGame();
            }

            setTimeout(() => {
                godtime = false;
            }, 1000);
            godtime = true;
        }
    });
}

function updateHUD() {
    document.getElementById('lives').textContent = `Lives: ${player.lives}`;
    document.getElementById('level').textContent = `Level: ${currentLevel}`; // Update level display
}

// Function to advance to the next level
function advanceLevel() {
    if (currentLevel < totalLevels) {
        currentLevel++;
        initializeGame(true); // Reset level with player and boss position reset
        spawnBoss(currentLevel); // Spawn a new boss for the next level
    } else {
        gameState = 'gameOver';
        drawScreen([{ text: 'You Win!' }, { text: 'Thanks for Playing!' }, { text: 'Press Enter to Restart' }]);
    }
}

// Function to reset the game
function resetGame() {
    gameState = 'gameOver';  // Set game state to 'gameOver'
    // initializeGame();  // Reset game elements
    drawScreen([
        {text: 'Game Over'},
        {text: 'Thanks for Playing!'},
        {text: 'Press Enter to Restart'}
    ]);  // Display game over screen
}

// Function to initialize the game
function initializeGame(resetLevel = false) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reset player position and stats
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - 60;
    player.lives = resetLevel ? player.lives : 13; // Reset lives only if not advancing a level
    player.bullets = [];
    player.moveLeft = false;
    player.moveRight = false;
    player.moveUp = false;
    player.moveDown = false;
    player.isSlow = false;
    player.canShoot = true;
    playing = false;
    
    
    // Reset boss and enemy bullets
    bossActive = false;
    boss = null;
    enemyBullets.length = 0;
    angleOffset = 0;
    // Reset or advance level
    if (!resetLevel) {
        currentLevel = 1;
        gameState = 'start';
    } else {
        gameState = 'levelComplete';
    }
}

function drawElevatorPanel() {
    const buttonSize = 40; // Size of the buttons
    const spacing = 10; // Spacing between the buttons

    // Calculate the center position
    const panelWidth = 3 * buttonSize + 2 * spacing; // Total width of the panel (three columns of buttons)
    const panelHeight = 6 * buttonSize + 5 * spacing; // Total height (six rows of buttons)
    const panelX = (canvas.width - panelWidth) / 2; // X-axis start (centered)
    const panelY = (canvas.height - panelHeight) / 2; // Y-axis start (centered)

    ctx.globalAlpha = 0.4; // Set transparency

    // Draw the panel border (black board outline only, no fill)
    ctx.strokeStyle = '#000'; // Black outline
    ctx.lineWidth = 2; // Border thickness
    ctx.strokeRect(panelX - 10, panelY - 20, panelWidth + 20, panelHeight + 40);

    // Button layout
    const columns = [
        [1, 2, 3, 4, 5, 6], // First column: 1 to 6
        [13, 13, 13, 13, 13, 13], // Second column: 13
        [7, 8, 9, 10, 11, 12] // Third column: 7 to 12
    ];

    // Draw each button in black and white
    columns.forEach((column, colIndex) => {
        column.forEach((floor, rowIndex) => {
            // Calculate button position
            const buttonX = panelX + colIndex * (buttonSize + spacing);
            const buttonY = panelY + rowIndex * (buttonSize + spacing);

            // Draw button in grayscale
            ctx.fillStyle = '#000'; // Default button color (black)
            if (floor === currentLevel) {
                ctx.fillStyle = '#FF0000'; // Highlight current level button (white)
            }
            ctx.beginPath();
            ctx.arc(buttonX + buttonSize / 2, buttonY + buttonSize / 2, buttonSize / 2, 0, Math.PI * 2);
            ctx.fill();

            // Draw floor numbers in white (if button is black) or black (if button is white)
            ctx.fillStyle = (floor === currentLevel) ? '#000' : '#fff'; // Inverse text color
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(floor, buttonX + buttonSize / 2, buttonY + buttonSize / 2);
        });
    });

    ctx.globalAlpha = 1; // Reset transparency
}

function startGameLoop() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId); // Cancel the previous animation frame
    }
    animationFrameId = requestAnimationFrame(gameLoop); // Start a new game loop
}

var S = Math.sin;
var C = Math.cos;
var T = Math.tan;
function R(r,g,b,a) {
    a = a === undefined ? 1 : a;
    return 'rgba(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ',' + a + ')';
  }

function animateBackground(t, level) {
    let x = ctx;
    let c = canvas;
    var w = 400;
    var h = 600;

    // each level has a different background
    if (level === 1) {
        //nothing
    } else if (level === 2) {
        x.shadowColor=`hsl(${t*400},99%,50%)`
        x.shadowBlur=30 //cyberpunk style, you are in dream
    } else if (level === 3) {
      c.width|=0;for(let i=0;i<14;i++){x.font='20px monospace';x.fillStyle=R(255*S(T(t)),0,0);x.fillText('WARING!',0,(i*99+t*333)%600);x.fillText('WARING!',320,(i*99+t*333)%600)}
      // waring!
    } else if (level === 4) {
        l=(v,y,w,z)=>{x.beginPath(x.lineWidth=9);x.moveTo(v,y);x.lineTo(w,z);x.stroke()}
        c.width|=0
        for(i=8;i--;)l(600,-2e3,i*404,h=1000);for(i=40;i--;)l(0,y=3**((t+i/3)%9%h),2e3,y) 
    } else if (level === 5) {
        for(s=k=38;k--;s/=.97)for(i=50;i--;)for(j=28;j--;30-k<(i+t^j)**3%33&&x.fillRect(400+(j-14)*s,600+(i-22-t%1)*s,s,s))x.fillStyle=R(v=90-(k*2),v*Math.sin(t*.2),v*Math.cos(t*.01))
    } else if (level === 6) {
        x.shadowColor=`hsl(${t*400},99%,50%)`
        x.shadowBlur=30
        for(s=k=38;k--;s/=.97)for(i=50;i--;)for(j=28;j--;30-k<(i+t^j)**3%33&&x.fillRect(400+(j-14)*s,600+(i-22-t%1)*s,s,s))x.fillStyle=R(v=90-(k*2),v*Math.sin(t*.2),v*Math.cos(t*.01))
    } else if (level === 7) {
        x.shadowBlur=0
        for(s=k=29;k--;s/=.81)for(j=25;i=--j>>2;e%5<i&&j-18&&x.fillRect(300+j%4*s-s/.4-k*9,400+i*s-4.8*s,s,s))e=j^k/8+t*6,x.fillStyle=R(v=e%7*k,v,v)
    } else if (level === 8) {
        for(s=i=w=c.width|=0;i--;s*=.98)j=i-t*30|0,x.fillRect(200-(j%9?j%2?-.5:.5:.6)*s+(w-i)*S(j/199),200+s,j%9?s/9+9:s*1.3,s/9+2)
    } else if (level === 9) {
        x.shadowColor=`hsl(${t*400},99%,50%)`
        x.shadowBlur=30
        c.width|=0;for(let i=0;i<14;i++){x.font='20px monospace';x.fillStyle=R(255*S(T(t)),0,0);x.fillText('13!',0,(i*99+t*333)%600);x.fillText('13!',320,(i*99+t*333)%600)}
    } else if (level === 10) {
        x.shadowColor=`hsl(${t*400},99%,50%)`
        x.shadowBlur=30
        for(s=k=29;k--;s/=.81)for(j=25;i=--j>>2;e%5<i&&j-18&&x.fillRect(300+j%4*s-s/.4-k*9,400+i*s-4.8*s,s,s))e=j^k/8+t*6,x.fillStyle=R(v=e%7*k,v,v)
    } else if (level === 11) {
        x.shadowBlur=0
        x.fillStyle = 'black';
        x.fillRect(0, 0, c.width, c.height);
    } else if (level === 12) {
        c.width|=0
        for(i=360;i--;)x.lineTo((S(t-i)*i+t*S(t+i))*3,(S(t+(i&i/2))*(2e3*S((i&(256*t))|i)*t-i))/(t+t))
        x.fill`evenodd`
    } else if (level === 13) {
        for(i=100;i--;)for(j=60;j--;x.fillStyle=`hsl(${180*(C(i/10+t/2)**3+S(j/10+t/2))+60*t},99%,50%)`)x.fillRect(10*i,10*j,10,10)
    }
}

function gameLoop() {

    now = Date.now();
    delta = now - then;
    time = frame / 60;

    if (time * 60 | 0 == frame - 1) {
      time += 0.000001;
    }

    frame++;

    if (delta > interval) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animateBackground(time, currentLevel);
        drawElevatorPanel();
        

        if (gameState === 'start') {
            drawScreen([{ text: 'Press Enter to Start' }]);
        } else if (gameState === 'playing') {
            if (gamePhase === 'flyingToBoss') {
                updateFlyingToBoss(); // Fly the player to the boss
            } else if (gamePhase === 'bossIntro') {
                drawBossIntro(); // Show the boss message
            } else if (gamePhase === 'fightingBoss') {
                updatePlayer();
                drawPlayer();
                if (bossReady) {
                    drawBoss();
                    drawBossHealthBar();
                }
                checkCollisions();
                drawPlayerBullets();
                drawEnemyBullets();
                drawExplosions();
                updateHUD();
            }
        } else if (gameState === 'paused') {
            drawScreen([
                { text: 'Paused' },
                { text: 'Press Space to Resume' },
                { text: 'Press Escape to Leave' }
            ]);
        } else if (gameState === 'levelComplete') { // New state for level complete
            drawScreen([{ text: `Level ${currentLevel - 1} Complete!` }, { text: 'Press Enter to Continue' }]);
            // playing = false;
        } else if (gameState === 'gameOver') {
            resetGame();
            // playing = false;
        }
        then = now - (delta % interval);
    }

    if (gameState !== 'gameOver') {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

// Initialize game
initializeGame();

// Event listeners for starting, pausing, and restarting the game
document.addEventListener('keydown', function(event) {
    if (gameState === 'start' && event.key === 'Enter') {
        gameState = 'playing';
        music = setInterval(playMusic, 1000);
        spawnBoss(currentLevel); // Start with the first boss
        startFlyingToBoss();
    } else if (gameState === 'playing' && event.key === 'Escape') {
        gameState = 'paused';
    } else if (gameState === 'paused' && event.key === ' ') {
        gameState = 'playing';
    } else if (gameState === 'paused' && event.key === 'Escape') {
        gameState = 'gameOver';
    } else if (gameState === 'gameOver' && event.key === 'Enter') {
        clearInterval(music);
        initializeGame();
        startGameLoop();
    } else if (gameState === 'levelComplete' && event.key === 'Enter') { // New condition for 'levelComplete'
        gameState = 'playing';
        gamePhase = 'flyingToBoss';
        spawnBoss(currentLevel);
        startFlyingToBoss();
        startGameLoop();
    }
});

// Event listeners for player movement and shooting
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') player.moveLeft = true;
    if (event.key === 'ArrowRight') player.moveRight = true;
    if (event.key === 'ArrowUp') player.moveUp = true;
    if (event.key === 'ArrowDown') player.moveDown = true;
    if (event.key === 'Shift') player.isSlow = true;
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowLeft') player.moveLeft = false;
    if (event.key === 'ArrowRight') player.moveRight = false;
    if (event.key === 'ArrowUp') player.moveUp = false;
    if (event.key === 'ArrowDown') player.moveDown = false;
    if (event.key === 'Shift') player.isSlow = false;
});

gameLoop();
