let counter = 0; //Counter for limiting movement speed on cirlce
let circleSpeed = 5;
let sizeVar = 400; //Size of the canver


class PVector {
  constructor(x_, y_){
    this.x = x_; // Initialize the x component of the vector
    this.y = y_; // Initialize the y component of the vector 
    this.xNoiseVar = 0; // Assigns a random value between 0 and 1 to the noise of the X value
    this.yNoiseVar = 0; // Assigns a random value between 0 and 1 to the noise of the Y value
    this.targetX = x_; // Target x position for lerping
    this.targetY = y_; // Target y position for lerping
  }

  addX(v) {
    this.x = this.x + v.x; // Add the x component of another vector to this vector's x component
  }

  subX(v) {
    this.x = this.x - v.x; // Subtract the x component of another vector from this vector's x component
  }

  addY(v) {
    this.y = this.y + v.y; // Add the y component of another vector to this vector's y component
  }

  subY(v) {
    this.y = this.y - v.y; // Subtract the y component of another vector from this vector's y component
  }

  addXNoise(){
    this.xNoiseVar += noise(random(25, 50));
    this.targetX += map(this.xNoiseVar, 25, 50, -circleSpeed, circleSpeed);
  }

  addYNoise(){
    this.yNoiseVar += noise(random(25, 50));
    this.targetY += map(this.yNoiseVar, 0, 20, -circleSpeed, circleSpeed);
  }

  subXNoise(){
    this.xNoiseVar -= noise(random(25, 50));
    this.targetX -= map(this.xNoiseVar, 25, 50, -circleSpeed, circleSpeed);
  }

  subYNoise(){
    this.yNoiseVar -= noise(random(25, 50));
    this.targetY -= map(this.yNoiseVar, 0, 20, -circleSpeed, circleSpeed);
  }

  update() {
    const easing = 0.05;
    this.x = lerp(this.x, this.targetX, easing);
    this.y = lerp(this.y, this.targetY, easing);
  }

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

let circle = new PVector(sizeVar/2, sizeVar/2); // Create a new PVector instance with initial x and y values

function setup() {
  createCanvas(sizeVar, sizeVar); // Create a canvas with a width and height of 400 pixels

}

function draw() {

  counter += 1;

  background(0); // Set the background color to black

  console.log(circle.x)

  if(counter % 5 == 0) {
    circleRandX = Math.floor(random(1, 100));
    circleRandY = Math.floor(random(1, 100));
  
  
    if (circleRandX % 2 == 0) {
      circle.addXNoise();
    } else {
      circle.subXNoise();
    }
    
    if (circleRandY % 2 == 0) {
      circle.addYNoise();
    } else {
      circle.subYNoise();
    }
  }

  circle.update();
  circle.resetPosition()


  stroke(255); // Set the stroke color to white
  fill(175); // Set the fill color to a light gray
  ellipse(circle.x, circle.y, 30, 30); // Draw an ellipse at the current location with a diameter of 30 pixels
}

//Next steps are create another circle and have it bounce around the canvas. But give it a few things. Make it change its velocity vector
// every time it his a wall. Additionally, try messing with the acceleration from time to time. Maybe give it a few big steps or something.
// And finally, if it is close to the other circle, make it change direction and flee! 
