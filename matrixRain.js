const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

// Fullscreen canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Characters - random ASCII
const characters = "アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチッヂヅテデトドナニヌネノハバパヒビピフブプヘベペホボポABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const fontSize = 16;
const columns = canvas.width / fontSize;

// Array of drops - one per column
const drops = Array.from({ length: columns }, () => Math.random() * -20);

// Draw the characters
function drawMatrixRain() {
  // Black BG with slight opacity to fade characters
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const char = characters.charAt(Math.floor(Math.random() * characters.length));
    const x = i * fontSize;
    const y = drops[i] * fontSize;

    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fillText(char, x, y);

    // Reset drop randomly or let it keep falling
    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    } else {
      drops[i] += 0.9 + Math.random() * 0.5;
    }
  }
}

let interval = setInterval(drawMatrixRain, 50);

// Fade out after 5 seconds
setTimeout(() => {
  const fadeOut = setInterval(() => {
    canvas.style.opacity -= 0.05;
    if (canvas.style.opacity <= 0) {
      clearInterval(fadeOut);
clearInterval(interval);
canvas.style.display = "none";      // hide matrix
document.getElementById("mainContent").style.display = "none"; // keep main hidden
// start the navigation
window.startNavigation();
    }
  }, 50);
}, 7000);


