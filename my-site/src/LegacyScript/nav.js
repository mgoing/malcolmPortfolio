//TODO add labels to the doors
//TODO increase size of figure
//TODO add floating orbs
// TODO add actual link to new pages
// TODO slow down speed of user
//TODO text needs to be stylized better in a way that doesnt create lag. css keyframes and glowtext is too laggy
//reactBits to add: decrypted text, ASCII text, Target Cursor, Magnet lines, Click Spark, Shape blur, Splash cursor, blob cursor, faulty terminal or dither or pixel blast

(function() {
  const canvas = document.getElementById('navCanvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // --- CONFIG ---
  const groundY = canvas.height * 0.8;
  const playerW = 64, playerH = 64;
  const moveSpeed = 5;
  const worldWidth = 3000;
  const doorXs = [800, 1200, 1800];
  const doorW = 96, doorH = 144;
  const doorURLs = ['underConstruction.html','underConstruction.html','underConstruction.html'];
  

  // --- SPRITE MANAGEMENT ---
  const spriteStanding = document.getElementById('sprite-standing');
  const spriteWalking = document.getElementById('sprite-walking');
  const allSprites = [spriteStanding, spriteWalking];

  let facing = 'R';      // 'R' or 'L'
  let moving = false;
  let atDoor = null;
  let worldOffset = 0;

let glowStartTs;

 const TIP_DELAY = 3000; // ms until tip appears 
 const TIP_FADE = 1000; // fade in/out duration 
 let tipState = 'waiting'; // 'waiting'|'fadeIn'|'show'|'fadeOut'|'done'

  // Flash animation state
  let flash = {
    active: false,
    doorIndex: null,
    t: 0,
    fillDur: 300,
    circleDur: 400,
    totalDur: 700
  };

  // --- IDLE / DECRYPT logic (NEW) ---
  let lastMoveTs = performance.now();
  const DECRYPT_DELAY = 4000; // ms of idle before it tells React to show DecryptedText (adjust X here)
  let decryptedShown = false; // whether we've already told React to show the decrypted text

let mx = 0, my = 0;
 window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  // --- INPUT ---
  window.addEventListener('keydown', e => {
    if (flash.active) return;

    if (e.code === 'KeyA') { facing = 'L'; moving = true;  }
    if (e.code === 'KeyD') { facing = 'R'; moving = true; }
    if ((e.code === 'Enter' || e.code === 'Space') && atDoor !== null) {
      flash.active = true;
      flash.doorIndex = atDoor;
      flash.t = 0;
    }

    if (e.code === 'KeyA' || e.code === 'KeyD') {
      // user moved -> reset idle timer and hide decrypted text if it was showing
      lastMoveTs = performance.now();
      // reset state flags
      decryptedShown = false;
      // notify React to hide decrypted text
      window.dispatchEvent(new CustomEvent('nav-decrypted', { detail: { visible: false } }));

      // you still have tipState logic; keep it consistent
      tipState = 'waiting';
      afterTimer = false;
    }
  });

  window.addEventListener('keyup', e => {
    if (e.code === 'KeyA' || e.code === 'KeyD') {
      moving = false;
    }
  });

  // --- SPRITE DISPLAY ---
  function updateSprite() {
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

  // NOTE: removed displayGlowText() entirely. React will handle the text.

  function loop(ts) {
    const dt = ts - (loop.lastTS || ts);
    loop.lastTS = ts;

    const since = ts - lastMoveTs;

    // existing tipState logic (kept as-is)
   
    if (!moving) {
      if (since > TIP_DELAY + TIP_FADE*2 && tipState !== 'done') {
        tipState = 'done';
      } else if (since > TIP_DELAY + TIP_FADE && tipState === 'fadeIn') {
        tipState = 'show';
      } else if (since > TIP_DELAY && tipState === 'waiting') {
        tipState = 'fadeIn';
      } else if (since > TIP_DELAY + TIP_FADE && tipState === 'show') {
        tipState = 'fadeOut';
      }
    } 

    // --- NEW: dispatch decrypted-visible event once after DECRYPT_DELAY ms of idle ---
    if (!decryptedShown && since >= DECRYPT_DELAY) {
      decryptedShown = true;
      window.dispatchEvent(new CustomEvent('nav-decrypted', { detail: { visible: true } }));
    }

    //new logic
    // movement
    if (!flash.active) {
      if (facing === 'R' && moving) worldOffset = Math.min(worldOffset + moveSpeed, worldWidth - canvas.width);
      if (facing === 'L' && moving) worldOffset = Math.max(worldOffset - moveSpeed, 0);
    }

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    const glowR = 30;
    const grad = ctx.createRadialGradient(mx, my, 0, mx, my, glowR);
    grad.addColorStop(0, 'rgba(255,255,255,0.4)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(mx, my, glowR, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

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

    // tip alpha logic still present but does not draw canvas-based text anymore
    if (tipState !== 'waiting' && tipState !== 'done') {
      let alpha = 1;
      const t = since - TIP_DELAY;
      if (tipState === 'fadeIn')      alpha = Math.min(t / TIP_FADE, 1);
      else if (tipState === 'fadeOut') alpha = 1 - Math.min((t - (TIP_FADE+1000)) / TIP_FADE, 1);
      else if (tipState === 'show')    alpha = 1;
    }

    updateSprite();
    requestAnimationFrame(loop);
  } //function loop end



  // Entry point
  window.startNavigation = function() {
    const navCanvas = document.getElementById('navCanvas');
    document.getElementById('matrixCanvas').style.display = 'none';

    
    //const mainContent = document.getElementById('mainContent');
    //mainContent.style.display = 'none'; //debugging <- ^^

    navCanvas.style.display = 'block';
    loop.lastTS = performance.now();
    glowStartTs = performance.now();
    requestAnimationFrame(loop);
  };
})();

