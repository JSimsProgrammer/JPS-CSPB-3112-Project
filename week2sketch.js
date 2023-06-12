
let counter = 0; // Counter for draw function
let circleSpeed = 3; //speed of the timid cirlce
let maxSpeed = 7; //max speed of the bouncing circle
let sizeVar = 400; // Size of the canvas

// TimidCircle class
class TimidCircle {
  constructor(x_, y_){
    this.x = x_; // Initialize the x component of the vector
    this.y = y_; // Initialize the y component of the vector 
    this.xNoiseVar = 0; // Assigns a random value between 0 and 1 to the noise of the X value
    this.yNoiseVar = 0; // Assigns a random value between 0 and 1 to the noise of the Y value
    this.targetX = x_; // Target x position for lerping
    this.targetY = y_; // Target y position for lerping
  }

  // Add noise to the x position
  addXNoise(){
    this.xNoiseVar += noise(random(25, 50));
    this.targetX += map(this.xNoiseVar, 25, 50, -circleSpeed, circleSpeed);
  }

  // Add noise to the y position
  addYNoise(){
    this.yNoiseVar += noise(random(25, 50));
    this.targetY += map(this.yNoiseVar, 0, 20, -circleSpeed, circleSpeed);
  }

  // Subtract noise from the x position
  subXNoise(){
    this.xNoiseVar -= noise(random(25, 50));
    this.targetX -= map(this.xNoiseVar, 25, 50, -circleSpeed, circleSpeed);
  }

  // Subtract noise from the y position
  subYNoise(){
    this.yNoiseVar -= noise(random(25, 50));
    this.targetY -= map(this.yNoiseVar, 0, 20, -circleSpeed, circleSpeed);
  }

  // Update the circle's position using lerping
  update() {
    const easing = 0.05;
    this.x = lerp(this.x, this.targetX, easing);
    this.y = lerp(this.y, this.targetY, easing);
  }

  // Reset the circle's position if it goes beyond the canvas
  resetPosition() {
    if (this.x > sizeVar) {
      this.x = 0;
      this.targetX = 0;
    }
    if (this.x < 0) {
      this.x = sizeVar;
      this.targetX = sizeVar;
    }
    if (this.y > sizeVar) {
      this.y = 0;
      this.targetY = 0;
    }
    if (this.y < 0) {
      this.y = sizeVar;
      this.targetY = sizeVar;
    }
  }
}

// PVector class
class PVector {
  constructor(x_, y_){
    this.x = x_;
    this.y = y_;
  }

  // Add a vector to the current vector
  add(v) {
    this.y = this.y + v.y;
    this.x = this.x + v.x;
  }

  // Set a random positive x component of the vector
  randPosXVect(){
    this.x = Math.floor(random(1, maxSpeed))
  }

  // Set a random positive y component of the vector
  randPosYVect(){
    this.y = Math.floor(random(1, maxSpeed))
  }

  // Set a random negative x component of the vector
  randNegXVect(){
    this.x = Math.floor(random(-maxSpeed, -1))
  }

  // Set a random negative y component of the vector
  randNegYVect(){
    this.y = Math.floor(random(-maxSpeed, -1))
  }

  // Reset the vector's position if it goes beyond the canvas
  resetPosition() {
    if (this.x > sizeVar + 30) {
      this.x = sizeVar/2;
    }
    if (this.x < -30) {
      this.x = sizeVar/2;
    }
    if (this.y > sizeVar +30) {
      this.y = sizeVar/2;
    }
    if (this.y < -30) {
      this.y = sizeVar/2;
    }
  }
}

// Create instances of the PVector and TimidCircle classes
let bounceLocationVar = new PVector(100, 100);
let bounceVelocityVar = new PVector(2.5, 5);
let timidCircle = new TimidCircle(sizeVar/2, sizeVar/2);

function setup() {
  createCanvas(sizeVar, sizeVar); // Create a canvas with a width and height of 400 pixels
}

function draw() {
  background(0); // Set the background color to black

  // Update the bouncing ellipse's position
  bounceLocationVar.add(bounceVelocityVar);
  
  // Check if the bouncing ellipse hits the canvas boundaries and change its velocity accordingly
  if ((bounceLocationVar.x > width-8) || (bounceLocationVar.x < 0+8)) {
    bounceVelocityVar.x = bounceVelocityVar.x * -1;
    if(bounceVelocityVar.x > 0){
      bounceVelocityVar.randPosXVect()
    } else { 
      bounceVelocityVar.randNegXVect()
    }
    
  }
  if ((bounceLocationVar.y > height-8) || (bounceLocationVar.y < 0+8)) {
    bounceVelocityVar.y = bounceVelocityVar.y * -1;
    if(bounceVelocityVar.y > 0){
      bounceVelocityVar.randPosYVect()
    } else { 
      bounceVelocityVar.randNegYVect()
    }
  }

  // Reset the bouncing ellipse's position if it goes beyond the canvas
  bounceLocationVar.resetPosition()

  // Update the timid circle's position
  if(counter % 5 == 0) {
    circleRandX = Math.floor(random(1, 100));
    circleRandY = Math.floor(random(1, 100));
  
    if (circleRandX % 2 == 0) {
      timidCircle.addXNoise();
    } else {
      timidCircle.subXNoise();
    }
    
    if (circleRandY % 2 == 0) {
      timidCircle.addYNoise();
    } else {
      timidCircle.subYNoise();
    }
  }

  // Update and reset the timid circle's position if it goes beyond the canvas
  timidCircle.update();
  timidCircle.resetPosition()

  // Draw the timid circle
  stroke(255); // Set the stroke color to white
  fill(34, 139, 34); // Make the color green
  ellipse(timidCircle.x, timidCircle.y, 30, 30); // Draw an ellipse at the current location with a diameter of 30 pixels

  // Draw the bouncing ellipse
  fill(0, 0, 255); // Make the color blue
  ellipse(bounceLocationVar.x, bounceLocationVar.y, 16, 16);
}
