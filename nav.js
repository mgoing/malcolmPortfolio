(function() {
  const canvas = document.getElementById('navCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // --- CONFIG ---
  const groundY = canvas.height * 0.8;
  const playerW = 64, playerH = 64;
  const moveSpeed = 5;
  const worldWidth = 3000;
  const doorXs = [800, 1200, 1800];
  const doorW = 96, doorH = 144;
  const doorURLs = ['/area1.html','/area2.html','/area3.html'];

  // --- SPRITE MANAGEMENT ---
  const spriteStanding = document.getElementById('sprite-standing');
  const spriteWalking = document.getElementById('sprite-walking');
  const allSprites = [spriteStanding, spriteWalking];

  let facing = 'R';      // 'R' or 'L'
  let moving = false;
  let atDoor = null;
  let worldOffset = 0;

  // Flash animation state
  let flash = {
    active: false,
    doorIndex: null,
    t: 0,
    fillDur: 300,
    circleDur: 400,
    totalDur: 700
  };

  // --- INPUT ---
  window.addEventListener('keydown', e => {
    if (flash.active) return;
    if (e.code === 'KeyA') { facing = 'L'; moving = true; }
    if (e.code === 'KeyD') { facing = 'R'; moving = true; }
    if ((e.code === 'Enter' || e.code === 'Space') && atDoor !== null) {
      flash.active = true;
      flash.doorIndex = atDoor;
      flash.t = 0;
    }
  });

  window.addEventListener('keyup', e => {
    if (e.code === 'KeyA' || e.code === 'KeyD') {
      moving = false;
    }
  });

  // --- SPRITE DISPLAY ---
  function updateSprite() {
    // Hide all
    allSprites.forEach(s => {
      s.style.display = 'none';
      s.classList.remove('left');
    });

    const sprite = moving ? spriteWalking : spriteStanding;
    sprite.style.display = 'block';

    if (facing === 'L') {
      sprite.classList.add('left');
    }
  }

  function loop(ts) {
    const dt = ts - (loop.lastTS || ts);
    loop.lastTS = ts;

    // movement
    if (!flash.active) {
      if (facing === 'R' && moving) worldOffset = Math.min(worldOffset + moveSpeed, worldWidth - canvas.width);
      if (facing === 'L' && moving) worldOffset = Math.max(worldOffset - moveSpeed, 0);
    }

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ground
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(canvas.width, groundY);
    ctx.stroke();

    // doors
    atDoor = null;
    doorXs.forEach((dx, i) => {
      const sx = dx - worldOffset;
      if (sx + doorW < 0 || sx > canvas.width) return;

      ctx.fillStyle = '#444';
      ctx.fillRect(sx, groundY - doorH, doorW, doorH);

      const playerSX = (canvas.width - playerW) / 2;
      if (Math.abs(sx - playerSX) < doorW / 2) {
        atDoor = i;
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(sx, groundY - doorH, doorW, doorH);
      }
    });

    // flash
    if (flash.active) {
      flash.t += dt;
      const doorX = doorXs[flash.doorIndex] - worldOffset;
      const doorY = groundY - doorH;
      if (flash.t <= flash.fillDur) {
        const p = flash.t / flash.fillDur;
        ctx.fillStyle = `rgba(255,255,255,${p})`;
        ctx.fillRect(doorX, doorY, doorW, doorH);
      } else if (flash.t <= flash.totalDur) {
        const t2 = flash.t - flash.fillDur;
        const p2 = t2 / flash.circleDur;
        const cx = doorX + doorW / 2;
        const cy = doorY + doorH / 2;
        const maxR = Math.hypot(canvas.width, canvas.height);
        const r = p2 * maxR;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.fill();
      } else {
        window.location.href = doorURLs[flash.doorIndex];
        return;
      }
    }

    updateSprite();
    requestAnimationFrame(loop);
  }

  // Entry point
  window.startNavigation = function() {
    document.getElementById('matrixCanvas').style.display = 'none';
    canvas.style.display = 'block';
    loop.lastTS = performance.now();
    requestAnimationFrame(loop);
  };
})();
