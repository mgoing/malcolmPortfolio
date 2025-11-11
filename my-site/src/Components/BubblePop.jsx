//Original code from my first ever coding project: https://openprocessing.org/sketch/1917633
//Has been slightly modified from p5.JS to React requirements

let circles = [];
let startTime;
let xxx
let yyy
let scoree = 0
let elapsedTime = 0;
let particles = [];
let textFall = 110
let staat = 1
let slideSpeed
let soundFile



function preload() {
	soundFormats('mp3', 'ogg', 'wav');
  bubbleImg = loadImage("bubble pixel");
	soundFile = loadSound('mixkit-serene-moments-27.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
 // startTime = millis(); // record the start time
	startTime = round(millis()/1000)
	slideSpeed =createSlider(0, 5, 1, 0.5)
	slideSpeed.position(200,50)
	soundFile.play()
	soundFile.loop()
}

function draw() {
	elapsedTime = round(millis()/1000) - startTime
	let gradient = drawingContext.createLinearGradient(0, 0, windowWidth, windowHeight);
  gradient.addColorStop(0, '#E5F5FF');
  gradient.addColorStop(1, '#F9D9F9');

  // set the canvas background to the gradient
  drawingContext.fillStyle = gradient;
  drawingContext.fillRect(0, 0, windowWidth, windowHeight);
	
	
	push()
	noStroke()
	gradient.addColorStop(0, '#E8FFE5');
  gradient.addColorStop(1, '#53F436');

  
  drawingContext.fillStyle = gradient;
  drawingContext.fillRect(0,0, windowWidth, 110);
	gradient.addColorStop(0, '#E8FFE5');
  gradient.addColorStop(1, '#53F436');
	drawingContext.fillRect(windowWidth-125, 100, 125, windowHeight);
	

	pop()
	noStroke()
	fill("black")
	textSize(30)
text("Score", windowWidth-95,50 )
	text(scoree, windowWidth-95, 100)
		text(elapsedTime, windowWidth-100,200)
	textAlign(CENTER)
	text("Bubble POP!", windowWidth/2, 50)
		text("Pop the bubbles as fast as you can!", windowWidth/2, 75)
	textSize(15)
	text('Change Speed!', 253, 40)
	
	
	for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].areDone()) {
      particles.splice(i, 1);
    }
  }	
	
  // create a new circle 
	  if (millis() - startTime < 30000 && frameCount % 10 === 0) {
    circles.push({
      x: random(windowWidth-125),
      y: 110,
    size: random(20, 50),
    });
  }

  // actually draw circles and move them
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];
    circle.y += slideSpeed.value();
    image(bubbleImg, circle.x - circle.size/2, circle.y - circle.size/2, circle.size, circle.size);
		noFill()
		stroke('white')
		
		
    // remove circle when clicked on
    if (mouseIsPressed && dist(circle.x, circle.y, mouseX, mouseY) < circle.size/2) {
      circles.splice(i, 1);
			scoree = scoree + 1
			createParticles(mouseX, mouseY)
    }
  } 
    
  

	if (mouseX > 0 && mouseX < windowWidth-125 && mouseY > 110){
		noCursor()
		strokeWeight(2)
	line(mouseX, 0, mouseX, windowWidth);
	line(0, mouseY, windowWidth, mouseY);

	circle(mouseX, mouseY, 50)
	}
	else{
		cursor()
	

}
	//your score at the end
	if (circles.length > 0 && circles[circles.length-1].y > windowHeight) {
  textFall = textFall + 1;
  stroke('rgb(97,48,48)');
  textSize(40);
  text('Your Score: ' + scoree, windowWidth/2, textFall);
}
	
}


class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-5, 5), random(-5, 5));
    this.acc = createVector(0, 0.1);
    this.lifespan = 255;
    this.color = color('rgb(184, 219, 255)');
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 5;
    this.color.setAlpha(this.lifespan);
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, 10, 10);
  }

  areDone() {
    return this.lifespan <= 0;
  }
}

function createParticles(x, y) {
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(x, y));
  }
}
