//Simple TODO: 
//Make treasure chests. Save amount found in local cookies

import { useEffect, useRef, useCallback, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const FOV_PLANE = 0.66;
const MOVE_SPEED = 3.0;
const ROTATE_SPEED = 2.0;
const TEXTURE_SIZE = 64;
const MAP_WIDTH = 40;
const MAP_HEIGHT = 40;
const MINIMAP_SIZE = 150;
const MINIMAP_MARGIN = 10;
const COLLISION_DISPLAY_DURATION = 0.5;

// ─── Texture Generation ───────────────────────────────────────────────────────
function createWallTextures() {
  const textures = [];

  // Texture 0: Red Brick
  const brick = new Uint8ClampedArray(TEXTURE_SIZE * TEXTURE_SIZE * 4);
  for (let y = 0; y < TEXTURE_SIZE; y++) {
    for (let x = 0; x < TEXTURE_SIZE; x++) {
      const i = (y * TEXTURE_SIZE + x) * 4;
      const isHMortar = y % 16 === 0;
      const isVMortar = (x + Math.floor(y / 16) * 8) % 16 === 0;
      if (isHMortar || isVMortar) {
        brick[i] = 80; brick[i+1] = 80; brick[i+2] = 80;
      } else {
        const v = (x + y) % 20 - 10;
        brick[i] = 150 + v; brick[i+1] = 50; brick[i+2] = 50;
      }
      brick[i+3] = 255;
    }
  }
  textures.push(brick);

  // Texture 1: Blue Stone
  const stone = new Uint8ClampedArray(TEXTURE_SIZE * TEXTURE_SIZE * 4);
  // Seeded pseudo-random
  let seed = 42;
  const rng = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return ((seed >>> 0) / 0xffffffff); };
  for (let i = 0; i < TEXTURE_SIZE * TEXTURE_SIZE; i++) {
    const n = Math.floor(rng() * 40) - 20;
    stone[i*4]   = 50 + n;
    stone[i*4+1] = 50 + n;
    stone[i*4+2] = 120 + n;
    stone[i*4+3] = 255;
  }
  textures.push(stone);

  // Texture 2: Green Metal
  const metal = new Uint8ClampedArray(TEXTURE_SIZE * TEXTURE_SIZE * 4);
  for (let y = 0; y < TEXTURE_SIZE; y++) {
    for (let x = 0; x < TEXTURE_SIZE; x++) {
      const i = (y * TEXTURE_SIZE + x) * 4;
      const isPanel = (Math.floor(x / 20) + Math.floor(y / 20)) % 2 === 0;
      const isRivet = (x % 20 === 0 || x % 20 === 19) && (y % 20 === 0 || y % 20 === 19);
      if (isRivet)       { metal[i] = 40;  metal[i+1] = 40;  metal[i+2] = 40; }
      else if (isPanel)  { metal[i] = 40;  metal[i+1] = 100; metal[i+2] = 40; }
      else               { metal[i] = 50;  metal[i+1] = 120; metal[i+2] = 50; }
      metal[i+3] = 255;
    }
  }
  textures.push(metal);

  return textures;
}

// ─── Map Generation ───────────────────────────────────────────────────────────
function generateMap() {
  const map = new Int32Array(MAP_HEIGHT * MAP_WIDTH).fill(1);
  const get = (y, x) => map[y * MAP_WIDTH + x];
  const set = (y, x, v) => { map[y * MAP_WIDTH + x] = v; };

  // Borders already = 1
  const rand = () => Math.random();
  const rooms = [];
  let attempts = 0;

  while (rooms.length < 8 && attempts < 50) {
    attempts++;
    const rw = Math.floor(rand() * 4) + 4;
    const rh = Math.floor(rand() * 4) + 4;
    const rx = Math.floor(rand() * (MAP_WIDTH - rw - 4)) + 2;
    const ry = Math.floor(rand() * (MAP_HEIGHT - rh - 4)) + 2;
    const newRoom = { x: rx, y: ry, w: rw, h: rh };

    let overlaps = false;
    for (const room of rooms) {
      if (
        newRoom.x < room.x + room.w + 2 && newRoom.x + newRoom.w + 2 > room.x &&
        newRoom.y < room.y + room.h + 2 && newRoom.y + newRoom.h + 2 > room.y
      ) { overlaps = true; break; }
    }

    if (!overlaps) {
      for (let y = ry; y < ry + rh; y++)
        for (let x = rx; x < rx + rw; x++)
          if (x > 0 && x < MAP_WIDTH - 1 && y > 0 && y < MAP_HEIGHT - 1)
            set(y, x, 0);

      if (rooms.length > 0) {
        const prev = rooms[rooms.length - 1];
        const px = prev.x + Math.floor(prev.w / 2), py = prev.y + Math.floor(prev.h / 2);
        const nx = newRoom.x + Math.floor(newRoom.w / 2), ny = newRoom.y + Math.floor(newRoom.h / 2);

        const carveH = (x1, x2, y) => {
          for (let x = Math.min(x1,x2); x <= Math.max(x1,x2); x++)
            if (x>0&&x<MAP_WIDTH-1&&y>0&&y<MAP_HEIGHT-1) set(y,x,0);
        };
        const carveV = (y1, y2, x) => {
          for (let y = Math.min(y1,y2); y <= Math.max(y1,y2); y++)
            if (x>0&&x<MAP_WIDTH-1&&y>0&&y<MAP_HEIGHT-1) set(y,x,0);
        };

        if (Math.random() < 0.5) { carveH(px, nx, py); carveV(py, ny, nx); }
        else                      { carveV(py, ny, px); carveH(px, nx, ny); }
      }
      rooms.push(newRoom);
    }
  }

  // Wall variety
  for (let y = 1; y < MAP_HEIGHT - 1; y++)
    for (let x = 1; x < MAP_WIDTH - 1; x++)
      if (get(y,x) > 0 && Math.random() < 0.3)
        set(y, x, Math.floor(Math.random() * 3) + 1);

  let spawnX = 2.5, spawnY = 2.5;
  if (rooms.length > 0) {
    const fr = rooms[0];
    spawnX = fr.x + fr.w / 2;
    spawnY = fr.y + fr.h / 2;
  } else {
    for (let y = 1; y < 4; y++) for (let x = 1; x < 4; x++) set(y,x,0);
  }

  return { map, spawnX, spawnY };
}

// ─── Vector helpers ───────────────────────────────────────────────────────────
function rotate(vx, vy, angle) {
  const cos = Math.cos(angle), sin = Math.sin(angle);
  return [vx * cos - vy * sin, vx * sin + vy * cos];
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DungeonRaycaster() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const keysRef = useRef({});
  const animRef = useRef(null);
  const lastTimeRef = useRef(null);
  const [regen, setRegen] = useState(0);

  // Init / regen
  useEffect(() => {
    const textures = createWallTextures();
    const { map, spawnX, spawnY } = generateMap();
    stateRef.current = {
      map, textures,
      playerX: spawnX, playerY: spawnY,
      dirX: 1, dirY: 0,
      planeX: 0, planeY: FOV_PLANE,
      isColliding: false,
      collisionTimer: 0,
    };
  }, [regen]);

  // Key listeners
  useEffect(() => {
    const down = (e) => { keysRef.current[e.key] = true; };
    const up = (e) => { keysRef.current[e.key] = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Offscreen buffer for pixel-level drawing
    const offscreen = document.createElement("canvas");
    offscreen.width = SCREEN_WIDTH;
    offscreen.height = SCREEN_HEIGHT;
    const octx = offscreen.getContext("2d");
    const imageData = octx.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);
    const pixels = imageData.data;

    function setPixel(x, y, r, g, b) {
      const i = (y * SCREEN_WIDTH + x) * 4;
      pixels[i] = r; pixels[i+1] = g; pixels[i+2] = b; pixels[i+3] = 255;
    }

    function loop(timestamp) {
      animRef.current = requestAnimationFrame(loop);
      if (!stateRef.current) return;

      const dt = lastTimeRef.current ? Math.min((timestamp - lastTimeRef.current) / 1000, 0.05) : 0.016;
      lastTimeRef.current = timestamp;

      const s = stateRef.current;
      const keys = keysRef.current;

      // ── Update ──────────────────────────────────────────────────────────────
      if (keys["a"] || keys["ArrowLeft"]) {
        const angle = -ROTATE_SPEED * dt;
        [s.dirX, s.dirY] = rotate(s.dirX, s.dirY, angle);
        [s.planeX, s.planeY] = rotate(s.planeX, s.planeY, angle);
      }
      if (keys["d"] || keys["ArrowRight"]) {
        const angle = ROTATE_SPEED * dt;
        [s.dirX, s.dirY] = rotate(s.dirX, s.dirY, angle);
        [s.planeX, s.planeY] = rotate(s.planeX, s.planeY, angle);
      }

      let nx = s.playerX, ny = s.playerY;
      const dist = MOVE_SPEED * dt;
      if (keys["w"] || keys["ArrowUp"])   { nx += s.dirX * dist; ny += s.dirY * dist; }
      if (keys["s"] || keys["ArrowDown"]) { nx -= s.dirX * dist; ny -= s.dirY * dist; }

      const valid = (px, py) => {
        const mx = px | 0, my = py | 0;
        if (mx < 0 || mx >= MAP_WIDTH || my < 0 || my >= MAP_HEIGHT) return false;
        return s.map[my * MAP_WIDTH + mx] === 0;
      };

      if (valid(nx, ny)) {
        s.playerX = nx; s.playerY = ny;
      } else {
        s.isColliding = true;
        s.collisionTimer = COLLISION_DISPLAY_DURATION;
      }

      if (s.isColliding) {
        s.collisionTimer -= dt;
        if (s.collisionTimer <= 0) s.isColliding = false;
      }

      if (keys["r"] || keys["R"]) {
        setRegen(n => n + 1);
        keys["r"] = false; keys["R"] = false;
        return;
      }

      // ── Draw ────────────────────────────────────────────────────────────────

      // Ceiling
      for (let y = 0; y < SCREEN_HEIGHT / 2; y++)
        for (let x = 0; x < SCREEN_WIDTH; x++)
          setPixel(x, y, 79, 79, 79);  // dark slate gray

      // Floor
      for (let y = SCREEN_HEIGHT / 2; y < SCREEN_HEIGHT; y++)
        for (let x = 0; x < SCREEN_WIDTH; x++)
          setPixel(x, y, 170, 170, 170); // dim gray

      // ── Raycasting ──────────────────────────────────────────────────────────
      for (let x = 0; x < SCREEN_WIDTH; x++) {
        const cameraX = 2 * x / SCREEN_WIDTH - 1;
        const rayDirX = s.dirX + s.planeX * cameraX;
        const rayDirY = s.dirY + s.planeY * cameraX;

        let mapX = s.playerX | 0, mapY = s.playerY | 0;
        const ddx = rayDirX === 0 ? 1e30 : Math.abs(1 / rayDirX);
        const ddy = rayDirY === 0 ? 1e30 : Math.abs(1 / rayDirY);

        let stepX, stepY, sdx, sdy;
        if (rayDirX < 0) { stepX = -1; sdx = (s.playerX - mapX) * ddx; }
        else             { stepX =  1; sdx = (mapX + 1 - s.playerX) * ddx; }
        if (rayDirY < 0) { stepY = -1; sdy = (s.playerY - mapY) * ddy; }
        else             { stepY =  1; sdy = (mapY + 1 - s.playerY) * ddy; }

        let hit = false, side = 0, hitType = 1;
        const maxSteps = Math.max(MAP_WIDTH, MAP_HEIGHT) * 2;

        for (let step = 0; step < maxSteps && !hit; step++) {
          if (sdx < sdy) { sdx += ddx; mapX += stepX; side = 0; }
          else           { sdy += ddy; mapY += stepY; side = 1; }
          if (mapX < 0 || mapX >= MAP_WIDTH || mapY < 0 || mapY >= MAP_HEIGHT) { hit = true; hitType = 1; break; }
          if (s.map[mapY * MAP_WIDTH + mapX] > 0) { hit = true; hitType = s.map[mapY * MAP_WIDTH + mapX]; }
        }

        if (hit) {
          let perpDist, wallX;
          if (side === 0) {
            perpDist = (mapX - s.playerX + (1 - stepX) / 2) / rayDirX;
            wallX = s.playerY + perpDist * rayDirY;
          } else {
            perpDist = (mapY - s.playerY + (1 - stepY) / 2) / rayDirY;
            wallX = s.playerX + perpDist * rayDirX;
          }
          wallX -= Math.floor(wallX);
          perpDist = Math.max(perpDist, 0.1);

          const lineH = (SCREEN_HEIGHT / perpDist) | 0;
          const drawStart = Math.max(0, (-lineH / 2 + SCREEN_HEIGHT / 2) | 0);
          const drawEnd   = Math.min(SCREEN_HEIGHT - 1, (lineH / 2 + SCREEN_HEIGHT / 2) | 0);

          const texIdx = Math.min(Math.max(hitType - 1, 0), s.textures.length - 1);
          let texX = (wallX * TEXTURE_SIZE) | 0;
          texX = Math.max(0, Math.min(TEXTURE_SIZE - 1, texX));
          if ((side === 0 && rayDirX > 0) || (side === 1 && rayDirY < 0))
            texX = TEXTURE_SIZE - texX - 1;

          const tex = s.textures[texIdx];
          const brightness = Math.max(0.3, 1.0 - perpDist * 0.1) * (side === 1 ? 0.8 : 1.0);

          for (let y = drawStart; y < drawEnd; y++) {
            const d = y * 256 - SCREEN_HEIGHT * 128 + lineH * 128;
            let texY = ((d * TEXTURE_SIZE) / lineH / 256) | 0;
            texY = Math.max(0, Math.min(TEXTURE_SIZE - 1, texY));
            const ti = (texY * TEXTURE_SIZE + texX) * 4;
            setPixel(x, y,
              (tex[ti]   * brightness) | 0,
              (tex[ti+1] * brightness) | 0,
              (tex[ti+2] * brightness) | 0
            );
          }
        }
      }

      // ── Collision flash ─────────────────────────────────────────────────────
      if (s.isColliding) {
        const alpha = s.collisionTimer / COLLISION_DISPLAY_DURATION;
        const br = (255 * alpha) | 0, bg = (255 * alpha) | 0;
        for (let x = 0; x < SCREEN_WIDTH; x++)
          for (let y = 0; y < 10; y++)
            setPixel(x, y, br, bg, 0);
      }

      // Push pixel buffer
      octx.putImageData(imageData, 0, 0);

      // ── Draw to main canvas ─────────────────────────────────────────────────
      ctx.drawImage(offscreen, 0, 0);

      // ── Minimap (canvas 2D) ─────────────────────────────────────────────────
      const mmX = SCREEN_WIDTH - MINIMAP_SIZE - MINIMAP_MARGIN;
      const mmY = MINIMAP_MARGIN;
      const tileW = MINIMAP_SIZE / MAP_WIDTH;
      const tileH = MINIMAP_SIZE / MAP_HEIGHT;

      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(mmX - 2, mmY - 2, MINIMAP_SIZE + 4, MINIMAP_SIZE + 4);

      for (let my = 0; my < MAP_HEIGHT; my++) {
        for (let mx = 0; mx < MAP_WIDTH; mx++) {
          const v = s.map[my * MAP_WIDTH + mx];
          if (v === 0) ctx.fillStyle = "rgba(255,255,255,0.3)";
          else if (v === 1) ctx.fillStyle = "rgba(255,0,0,0.6)";
          else if (v === 2) ctx.fillStyle = "rgba(0,0,255,0.6)";
          else ctx.fillStyle = "rgba(0,200,0,0.6)";
          ctx.fillRect(mmX + mx * tileW, mmY + my * tileH, Math.max(1, tileW), Math.max(1, tileH));
        }
      }

      // Player dot
      const pdx = mmX + s.playerX * tileW;
      const pdy = mmY + s.playerY * tileH;
      ctx.fillStyle = "#ffff00";
      ctx.fillRect(pdx - 2, pdy - 2, 4, 4);

      // Direction line
      ctx.strokeStyle = "#ffff00";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pdx, pdy);
      ctx.lineTo(pdx + s.dirX * 8, pdy + s.dirY * 8);
      ctx.stroke();
    }

    animRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(animRef.current); lastTimeRef.current = null; };
  }, [regen]);

  return (
    <canvas
      ref={canvasRef}
      width={SCREEN_WIDTH}
      height={SCREEN_HEIGHT}
      style={{ display: "block" }}
      tabIndex={0}
    />
  );
}