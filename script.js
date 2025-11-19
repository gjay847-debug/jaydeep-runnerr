const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let player = { x: 40, y: 520, w: 40, h: 40, vy: 0 };
let obstacles = [];
let score = 0;
let coins = 0;
let gameRunning = false;

document.getElementById("btn-play").onclick = startGame;

function startGame() {
    gameRunning = true;
    obstacles = [];
    score = 0;
    loop();
}

function loop() {
    if (!gameRunning) return;

    // sky background
    ctx.fillStyle = "#7dd3fc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ground
    ctx.fillStyle = "#064e3b";
    ctx.fillRect(0, 600, 360, 40);

    // Player
    ctx.fillStyle = "#3498db";
    ctx.fillRect(player.x, player.y, player.w, player.h);

    // Gravity
    player.vy += 1;
    player.y += player.vy;

    if (player.y > 520) {
        player.y = 520;
        player.vy = 0;
    }

    // click to jump
    canvas.onclick = () => {
        if (player.y >= 520) player.vy = -18;
    };

    // Spawn obstacles
    if (Math.random() < 0.02) {
        obstacles.push({ x: 360, y: 560, w: 40, h: 40 });
    }

    // Move & draw obstacles
    obstacles.forEach((obs, i) => {
        obs.x -= 4;
        ctx.fillStyle = "red";
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

        if (obs.x < -50) obstacles.splice(i, 1);

        // Collision detection
        if (isCollide(player, obs)) {
            alert("Game Over! Score: " + score);
            gameRunning = false;
        }
    });

    // Score
    score++;
    document.getElementById("coinCount").innerText = score;

    requestAnimationFrame(loop);
}

function isCollide(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}
