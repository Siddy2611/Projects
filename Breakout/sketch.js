let canvas;
let paddle;
let ball;
let bricks = [];
let rows = 5;
let cols = 8;
let brickWidth;
let brickHeight = 20;
let brickSpacing = 8; // Added spacing between bricks
let gameWon = false;
let gameOver = false;
let particles = [];
let bgImg;

// Updated colors to match cyberpunk theme
let paddleColor = [255, 0, 150]; // Neon pink
let ballColor = [255, 0, 0];   // Red
let textColor = [0, 0, 0];  // Bright magenta

function preload() {
  bgImg = loadImage("background.jpg"); // Make sure this image is in the same directory
}

function setup() {
  canvas = createCanvas(1450, 740);
  centerCanvas();
  initializeGame();
}

function windowResized() {
  centerCanvas();
}

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
}

function initializeGame() {
  gameOver = false;
  gameWon = false;
  particles = [];

  // Paddle setup
  paddle = {
    x: width / 2 - 50,
    y: height - 30,
    width: 100,
    height: 10,
    speed: 7
  };

  // Ball setup
  ball = {
    x: width / 2,
    y: height / 2,
    radius: 10,
    speedX: 4,
    speedY: -4
  };

  // Calculate brick dimensions with spacing
  brickWidth = (width - brickSpacing * (cols + 1)) / cols;
  bricks = [];

  // Generate bricks
  for (let i = 0; i < rows; i++) {
    bricks[i] = [];
    for (let j = 0; j < cols; j++) {
      // Create cyberpunk-themed random colors
      let r = random([255, 0, 150, 200, 100]);
      let g = random([0, 255, 150, 50, 0]);
      let b = random([255, 150, 255, 200, 100]);
      
      bricks[i][j] = {
        x: j * (brickWidth + brickSpacing) + brickSpacing,
        y: i * (brickHeight + brickSpacing) + 50, // Moved down a bit
        width: brickWidth,
        height: brickHeight,
        color: color(r, g, b), // Random color with cyberpunk palette
        broken: false
      };
    }
  }

  loop();
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-2, -5);
    this.alpha = 255;
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
  }

  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.alpha);
    ellipse(this.x, this.y, 6);
  }

  isDead() {
    return this.alpha <= 0;
  }
}

function draw() {
  if (bgImg) {
    background(bgImg);
  } else {
    background(0);
  }

  // Draw paddle
  fill(paddleColor);
  rect(paddle.x, paddle.y, paddle.width, paddle.height);

  // Paddle movement
  if (keyIsDown(LEFT_ARROW)) {
    paddle.x -= paddle.speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    paddle.x += paddle.speed;
  }

  paddle.x = constrain(paddle.x, 0, width - paddle.width);

  // Draw and move ball
  fill(ballColor);
  ellipse(ball.x, ball.y, ball.radius * 2);
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Ball collision with walls
  if (ball.x < ball.radius || ball.x > width - ball.radius) {
    ball.speedX *= -1;
  }
  if (ball.y < ball.radius) {
    ball.speedY *= -1;
  }

  // Ball collision with paddle
  if (ball.x > paddle.x && ball.x < paddle.x + paddle.width &&
    ball.y + ball.radius > paddle.y && ball.y - ball.radius < paddle.y + paddle.height) {
    ball.speedY *= -1;
    ball.y = paddle.y - ball.radius;
  }

  // Ball falls below
  if (ball.y > height + ball.radius) {
    noLoop();
    gameOver = true;
    showMessage("Game Over!", "Press SPACE to retry");
  }

  // Draw bricks and check collision
  let bricksLeft = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let b = bricks[i][j];
      if (!b.broken) {
        fill(b.color);
        rect(b.x, b.y, b.width, b.height,10);
        bricksLeft++;

        // Collision
        if (ball.x > b.x && ball.x < b.x + b.width &&
            ball.y - ball.radius < b.y + b.height &&
            ball.y + ball.radius > b.y) {
          b.broken = true;
          ball.speedY *= -1;

          // Emit particles
          for (let p = 0; p < 10; p++) {
            particles.push(new Particle(ball.x, ball.y, b.color));
          }
        }
      }
    }
  }

  // Win condition
  if (bricksLeft === 0 && !gameWon) {
    noLoop();
    gameWon = true;
    showMessage("You Win!", "Press SPACE to play again");
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
}

function showMessage(title, subtitle) {
  textSize(32);
  fill(textColor);
  textAlign(CENTER);
  text(title, width / 2, height / 2 - 20);
  textSize(20);
  text(subtitle, width / 2, height / 2 + 20);
}

function keyPressed() {
  if ((gameOver || gameWon) && key === ' ') {
    initializeGame();
  }
}