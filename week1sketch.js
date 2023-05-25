class PVector {
  constructor(x_, y_){
    this.x = x_; // Initialize the x component of the vector
    this.y = y_; // Initialize the y component of the vector
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
}

let locationVar = new PVector(100, 100); // Create a new PVector instance with initial x and y values
let velocityVar = new PVector(2.5, 5); // Create a new PVector instance representing the velocity

function setup() {
  createCanvas(400, 400); // Create a canvas with a width and height of 400 pixels
}

function draw() {
  background(0); // Set the background color to black

  circleRandX = Math.floor(random(1, 100)); // Generate a random integer between 1 and 100 for circleRandX
  circleRandY = Math.floor(random(1, 100)); // Generate a random integer between 1 and 100 for circleRandY

  console.log(circleRandX); // Output the value of circleRandX to the console

  if (circleRandX % 2 == 0) {
    locationVar.addX(velocityVar); // If circleRandX is even, add the velocity vector to the location vector's x component
  } else {
    locationVar.subX(velocityVar); // If circleRandX is odd, subtract the velocity vector from the location vector's x component
  }
  
  if (circleRandY % 2 == 0) {
    locationVar.addY(velocityVar); // If circleRandY is even, add the velocity vector to the location vector's y component
  } else {
    locationVar.subY(velocityVar); // If circleRandY is odd, subtract the velocity vector from the location vector's y component
  }

  if ((locationVar.x > width - 8) || (locationVar.x < 0 + 8)) {
    velocityVar.x = velocityVar.x * -1; // Reverse the x component of the velocity vector if the ball reaches the horizontal canvas edges
  }
  if ((locationVar.y > height - 8) || (locationVar.y < 0 + 8)) {
    velocityVar.y = velocityVar.y * -1; // Reverse the y component of the velocity vector if the ball reaches the vertical canvas edges
  }

  stroke(255); // Set the stroke color to white
  fill(175); // Set the fill color to a light gray
  ellipse(locationVar.x, locationVar.y, 30, 30); // Draw an ellipse at the current location with a diameter of 30 pixels
}
