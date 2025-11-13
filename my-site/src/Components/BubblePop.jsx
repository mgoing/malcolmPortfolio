//Original code from my first ever coding project: https://openprocessing.org/sketch/1917633
//Has been slightly modified from p5.JS to React requirements

//TODO change the on-screen text to show uninterrupted
//TODO Add footer where the bottom text is so the bubbles dont cover the on screen text

import React, {useEffect, useRef, useState} from 'react';
import bubbleImgSrc from '../assets/bubblePNG.png';


export default function BubblePopGame() {
  const containerRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const mod = await import("p5");
        const p5 = mod.default || mod;

        const sketch = (p) => {
          let circles = [];
          let startTime;
          let scoree = 0;
          let elapsedTime = 0;
          let particles = [];
          let textFall = 110;
          let slideSpeed;
          let bubbleImg;

          p.setup = async () => {
            // create canvas inside the container (new p5(..., container) already attaches it,
            // but we still call createCanvas here)
            p.createCanvas(500, 400);
            startTime = Math.round(p.millis() / 1000);

            // loadImage uses callbacks in p5; wrap in Promise so we can await
            bubbleImg = await new Promise((resolve, reject) => {
              p.loadImage(
                bubbleImgSrc,
                (img) => resolve(img),
                (err) => reject(err)
              );
            });

            // Create slider and parent to the canvas container (use DOM parentNode)
            slideSpeed = p.createSlider(0, 5, 1, 0.5);

            // p.canvas is a DOM element in p5 v2 — use parentNode / parentElement
            const canvasParent = p.canvas?.parentNode || p.canvas?.parentElement || (p.canvas && p.canvas.parent);
            // If canvasParent is valid, parent the slider to it. Otherwise, fallback to document body.
            if (canvasParent && typeof slideSpeed.parent === "function") {
              slideSpeed.parent(canvasParent);
            } else if (typeof slideSpeed.parent === "function") {
              // fallback: parent to the containerRef DOM node if available
              if (containerRef.current) slideSpeed.parent(containerRef.current);
              else slideSpeed.parent(document.body);
            }

            // position the slider within that parent
            try {
              slideSpeed.position(10, 10);
            } catch (e) {
              // some environments don't allow position; ignore if it fails
            }

            sliderRef.current = slideSpeed;

            // now the sketch is ready to draw
            if (mounted) setLoading(false);
          };

          p.draw = () => {
            // if image hasn't loaded yet, skip until setup finishes
            if (!bubbleImg) return;

            elapsedTime = Math.round(p.millis() / 1000) - startTime;
            const w = p.width;
            const h = p.height;

            // background gradient
            const gradient = p.drawingContext.createLinearGradient(0, 0, w, h);
            gradient.addColorStop(0, "#6e6e6fff");
            gradient.addColorStop(1, "#F9D9F9");
            p.drawingContext.fillStyle = gradient;
            p.drawingContext.fillRect(0, 0, w, h);

            // header
            p.noStroke();
            p.fill("black");
            p.textSize(20);
            p.textAlign(p.CENTER);
            p.text("Bubble POP!", w / 2, 30);
            p.textSize(14);
            p.text("Pop bubbles as fast as you can!", w / 2, 50);

            // HUD
            p.textAlign(p.LEFT);
            p.text(`Score: ${scoree}`, 10, h - 30);
            p.text(`Time: ${elapsedTime}s`, 120, h - 30);

            // particles
            for (let i = particles.length - 1; i >= 0; i--) {
              particles[i].update();
              particles[i].display(p);
              if (particles[i].done()) particles.splice(i, 1);
            }

            // spawn bubbles for 30 seconds
            if (p.millis() - startTime < 30000 && p.frameCount % 10 === 0) {
              circles.push({
                x: p.random(Math.max(1, w - 50)),
                y: 70,
                size: p.random(20, 50),
              });
            }

            // draw & interact (iterate backwards because we may splice)
            for (let i = circles.length - 1; i >= 0; i--) {
              const c = circles[i];
              c.y += slideSpeed.value();
              if (bubbleImg) p.image(bubbleImg, c.x - c.size / 2, c.y - c.size / 2, c.size, c.size);

              if (p.mouseIsPressed && p.dist(c.x, c.y, p.mouseX, p.mouseY) < c.size / 2) {
                circles.splice(i, 1);
                scoree++;
                createParticles(p.mouseX, p.mouseY);
              }
            }

            // falling text when bubbles reach bottom
            if (circles.length > 0 && circles[circles.length - 1].y > h) {
              textFall += 1;
              p.textAlign(p.CENTER);
              p.textSize(24);
              p.fill("rgb(97,48,48)");
              p.text(`Your Score: ${scoree}`, w / 2, textFall);
            }
          };

          function createParticles(x, y) {
            for (let i = 0; i < 10; i++) particles.push(new Particle(x, y));
          }

          class Particle {
            constructor(x, y) {
              this.pos = p.createVector(x, y);
              this.vel = p.createVector(p.random(-5, 5), p.random(-5, 5));
              this.acc = p.createVector(0, 0.1);
              this.lifespan = 255;
              this.color = p.color("rgb(184, 219, 255)");
            }
            update() {
              this.vel.add(this.acc);
              this.pos.add(this.vel);
              this.lifespan -= 5;
              this.color.setAlpha(this.lifespan);
            }
            display(pLocal) {
              pLocal.noStroke();
              pLocal.fill(this.color);
              pLocal.ellipse(this.pos.x, this.pos.y, 10, 10);
            }
            done() {
              return this.lifespan <= 0;
            }
          }
        }; // end sketch

        // instantiate p5 with the container element (containerRef.current)
        if (mounted) {
          p5InstanceRef.current = new p5(sketch, containerRef.current);
        }
      } catch (err) {
        console.error("Failed to load p5 or run sketch:", err);
        if (mounted) setLoading(false); // stop loading indicator
      }
    })();

    return () => {
      mounted = false;
      try {
        if (p5InstanceRef.current && typeof p5InstanceRef.current.remove === "function") {
          p5InstanceRef.current.remove();
          p5InstanceRef.current = null;
        }
        if (sliderRef.current && typeof sliderRef.current.remove === "function") {
          sliderRef.current.remove();
          sliderRef.current = null;
        }
      } catch (e) {
        console.warn("Error during p5 cleanup", e);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-transparent flex items-center justify-center overflow-hidden"
      style={{ minWidth: 500, minHeight: 400, position: "relative" }}
    >
      {loading && (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none" }}>
          <div style={{ color: "#cbd5e1", fontFamily: "monospace" }}>Loading game…</div>
        </div>
      )}
    </div>
  );
}