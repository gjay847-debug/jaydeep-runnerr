const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;

let state = 'menu';
let score = 0, coins = 0, level = 1, highScore = 0;
let player, obstacles, pickups, groundY;
let lastTimer = 0;
let gameSpeed = 3, spawnTimer = 0, spawnInterval = 90;
let soundOn = true;

const KEY = 'jaydeep_runner_data';
function loadState(){
  try{
    const saved = JSON.parse(localStorage.getItem(KEY));
    if(saved){
      coins = saved.coins || 0;
      highScore = saved.highScore || 0;
    }
  }catch(e){}
  document.getElementById('coinCount').innerText = coins;
  document.getElementById('highScore').innerText = highScore;
}

function saveState(){
  localStorage.setItem(KEY, JSON.stringify({
    coins,
    highScore
  }));
}

function createPlayer(){
  return {
    x: 40,
    y: H - 160,
    w: 32,
    h: 48,
    vy: 0,
    jumping: false,
  };
}
function spawnObstacle(){
  let h = 30 + Math.random()*40;
  obstacles.push({ x: W+20, y: groundY - h, w: 25, h: h });
}

function spawnCoin(){
  pickups.push({
    x: W + 20,
    y: groundY - 140 - Math.random()*100,
    w: 18,
    h: 18
  });
}

function rectsOverlap(a, b){
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}
function update(){
  if(state !== 'playing') return;

  level = Math.floor(score / 120) + 1;
  gameSpeed = 3 + (level - 1) * 0.6;
  spawnInterval = Math.max(40, 90 - (level-1)*7);

  spawnTimer++;
  if(spawnTimer % spawnInterval === 0){
    Math.random() < 0.7 ? spawnObstacle() : spawnCoin();
  }

  player.vy += 0.9;
  player.y += player.vy;
  if(player.y > groundY - player.h){
    player.y = groundY - player.h;
    player.vy = 0;
    player.jumping = false;
  }

  obstacles.forEach(o => o.x -= gameSpeed);
  pickups.forEach(p => p.x -= gameSpeed);

  obstacles = obstacles.filter(o => o.x + o.w > 0);
  pickups = pickups.filter(p => p.x + p.w > 0);

  for(let o of obstacles){
    if(rectsOverlap(player, o)){
      gameOver();
      return;
    }
  }

  for(let i = pickups.length - 1; i >= 0; i--){
    if(rectsOverlap(player, pickups[i])){
      coins += 5;
      score += 5;
      pickups.splice(i, 1);
      document.getElementById('coinCount').innerText = coins;
      saveState();
    }
  }

  score += 0.25;
  document.getElementById('level').innerText = level;
}

function gameOver(){
  state = 'gameover';
  document.getElementById('overlay').classList.remove('hidden');
  document.getElementById('game-over').classList.remove('hidden');

  document.getElementById('finalScore').innerText = Math.floor(score);
  document.getElementById('finalCoins').innerText = coins;

  if(score > highScore){
    highScore = Math.floor(score);
    document.getElementById('highScore').innerText = highScore;
    saveState();
  }
}
function draw(){
  ctx.fillStyle = '#7dd3fc';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#065f46';
  ctx.fillRect(0, H-100, W, 100);

  ctx.fillStyle = '#fff';
  ctx.fillText('Score: ' + Math.floor(score), 10, 20);

  ctx.fillStyle = '#0ea5e9';
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = '#7c2d12';
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.w, o.h));

  ctx.fillStyle = '#ffd166';
  pickups.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x + p.w/2, p.y + p.h/2, p.w/2, 0, Math.PI*2);
    ctx.fill();
  });
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

document.getElementById('btn-play').onclick = () => {
  player = createPlayer();
  obstacles = [];
  pickups = [];
  score = 0;
  spawnTimer = 0;
  state = 'playing';
  document.getElementById('overlay').classList.add('hidden');
};

window.addEventListener('touchstart', () => {
  if(state === 'playing' && !player.jumping){
    player.jumping = true;
    player.vy = -14;
  }
});

groundY = H - 100;
loadState();
player = createPlayer();
loop();
