
let counter = 0; // Counter for draw function
let circleSpeed = 3; //speed of the timid cirlce
let maxSpeed = 7; //max speed of the bouncing circle
let sizeVar = 400; // Size of the canvas
let bounceMass = 16 // Size of bouncing ball
const fear = 2
const topSpeed = 5
const foodNeed = 10

/*
***************
Functions
***************
*/
function findCommonPixels(array1, array2) {
  for (let i = 0; i < array1.length; i++) {
    for (let j = 0; j < array2.length; j++) {
      if (PVector.match(array1[i], array2[j])) {
        return true; // Found a common pixel, return true
      }
    }
  }
  return false; // No common pixels found
}

/*
***************
CLASSES
***************
*/

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

  // Subtract a vector from the current vector
  sub(v) {
    this.x = this.x - v.x;
    this.y = this.y - v.y;
  }

  // Multiply the vector by a scalar
  multi(scalar){
    this.x = this.x*scalar
    this.y = this.y*scalar
  }

  // Divide the vector by a scalar
  div(scalar){
    this.x = this.x/scalar
    this.y = this.y/scalar
  }

  mag(){
    return Math.sqrt((this.x * this.x) + (this.y * this.y))
  }

  normalize() {
    let m = this.mag();
    if (m != 0) {
      this.div(m);
    }
   }

   limit(max) {
    const magnitude = this.mag();
    if (magnitude > max) {
      this.div(magnitude); // Normalize the vector
      this.multi(max); // Scale the vector to the specified maximum value
    }
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

  //STATIC METHODS

  static add(v1, v2) {
    return new PVector(v1.x + v2.x, v1.y + v2.y);
  }

  static sub(v1, v2) {
    return new PVector(v1.x - v2.x, v1.y - v2.y);
  }

  static mag(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static match(v1, v2){
    if(v1.x == v2.x && v1.y == v2.y){
      return true
    } else {
      return false
    }
  }

}


// Food Seeker Class
class FoodSeeker{
  constructor(x_, y_, mass){
    this.location = new PVector(x_, y_);
    this.velocity = new PVector(0,0);
    this.acceleration = new PVector(0,0);
    this.mass = mass; // Set the mass (aka size) of the circle
    this.pixelArray = []
  }

  update(){
    this.velocity.add(this.acceleration)
    this.velocity.limit(topSpeed);
    this.location.add(this.velocity)
  }
  applyForce(force){
    this.acceleration.add(force)
  }

  goToFood(foodItem){
    let force = PVector.sub(foodItem.location, this.location);
    force.normalize();
    force.multi(.175)
    this.acceleration = force;
  }

  getPixelArray(){
    let left = new PVector(Math.floor(this.location.x - this.mass), this.location.y);
    let right = new PVector(Math.ceil(this.location.x + this.mass), this.location.y);
    let top = new PVector(Math.floor(this.location.y - this.mass), this.location.x);
    let bottom = new PVector(Math.ceil(this.location.y + this.mass), this.location.x);

    this.pixelArray = [this.location, left, right, top, bottom];
  } 
  
}

// Food Class
class FoodItem{
  constructor(x_, y_, mass){
    this.location = new PVector(x_, y_);
    this.mass = mass; // Set the mass (aka size) of the circle
    this.pixelArray = []
  }

  getPixelArray(){
    let left = Math.floor(this.location.x - this.mass);
    let right = Math.ceil(this.location.x + this.mass);
    let top = Math.floor(this.location.y - foodSeeker.mass);
    let bottom = Math.ceil(this.location.y + this.mass);

    // Iterate over each row within the bounding box
    for (let y = top; y <= bottom; y++) {
      // Iterate over each column within the bounding box
      for (let x = left; x <= right; x++) {
        // Create a PVector representing the current pixel and add it to the array
        let pVector = new PVector(x, y);
        this.pixelArray.push(pVector);
      }
    }
  }

  resetPosition(){
    this.location.x = Math.floor(Math.random() * (sizeVar - 15)) + 15
    this.location.y = Math.floor(Math.random() * (sizeVar - 15)) + 15
    foodItem.getPixelArray();
  }

}

// TimidCircle class
class TimidCircle {
  constructor(x_, y_, mass){
    this.location = new PVector(x_, y_); //Assign the location of this class
    this.xNoiseVar = 0; // Assigns a random value between 0 and 1 to the noise of the X value
    this.yNoiseVar = 0; // Assigns a random value between 0 and 1 to the noise of the Y value
    this.targetX = x_; // Target x position for lerping
    this.targetY = y_; // Target y position for lerping
    this.mass = mass; // Set the mass (aka size) of the circle
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
    this.location.x = lerp(this.location.x, this.targetX, easing);
    this.location.y = lerp(this.location.y, this.targetY, easing);
  }

  // Reset the circle's position if it goes beyond the canvas
  resetPosition() {
    if (this.location.x > sizeVar) {
      this.location.x = 0;
      this.targetX = 0;
    }
    if (this.location.x < 0) {
      this.location.x = sizeVar;
      this.targetX = sizeVar;
    }
    if (this.location.y > sizeVar) {
      this.location.y = 0;
      this.targetY = 0;
    }
    if (this.location.y < 0) {
      this.location.y = sizeVar;
      this.targetY = sizeVar;
    }
  }

  repelFoodSeeker(foodSeeker){
    let force = PVector.sub(this.location, foodSeeker.location);
    let distance = force.mag();
    distance = constrain(distance,5.0,25.0);
    force.normalize();
    let strength = (fear * this.mass) / (distance*distance);
    force.multi(strength);
    force.multi(-1)
    return force;
  }
}


/*
***************
INSTANTIATION
***************
*/

// Create instances of the PVector and TimidCircle classes
let timidCircle = new TimidCircle(sizeVar/2, sizeVar/2, 30);
let foodSeeker = new FoodSeeker(sizeVar/4, sizeVar/4, 15)
//let foodItem = new FoodItem(Math.floor(Math.random() * (sizeVar - 15)) + 15, Math.floor(Math.random() * (sizeVar - 15)) + 15, 7.5);
let foodItem = new FoodItem(sizeVar/2, sizeVar/2, 10)

//Get Pixel Arrays for Each Item
foodSeeker.getPixelArray();
foodItem.getPixelArray();


/*
***************
SETUP
***************
*/

function setup() {
  createCanvas(sizeVar, sizeVar); // Create a canvas with a width and height of 400 pixels
}


/*
***************
DRAW
***************
*/

function draw() {
  background(0); // Set the background color to black

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

  //Check to see if there is overlap. If so, move the food!
  foodSeeker.getPixelArray();
  let hasCommonPixels = findCommonPixels(foodSeeker.pixelArray, foodItem.pixelArray);

  if(hasCommonPixels){
    foodItem.resetPosition()
  }



  // Attract the food seeker to the food
  foodSeeker.goToFood(foodItem);

  //Timid circle repels the food seeker
  //repel = timidCircle.repelFoodSeeker(foodSeeker);
  //foodSeeker.applyForce(repel)

  //Update the Food Seeker
  foodSeeker.update()

  // Draw the timid circle
  stroke(255); // Set the stroke color to white
  fill(34, 139, 34); // Make the color green
  ellipse(timidCircle.location.x, timidCircle.location.y, timidCircle.mass, timidCircle.mass); // Draw an ellipse at the current location with a diameter of 30 pixels


  //Draw the food seeker
  fill(0, 0, 255); // Make the color blue
  ellipse(foodSeeker.location.x, foodSeeker.location.y, foodSeeker.mass, foodSeeker.mass);

  //Draw the food item
  fill(255, 0, 255);
  ellipse(foodItem.location.x, foodItem.location.y, foodItem.mass, foodItem.mass)
}


//TODO: Need to fix the food jumping around. Instead of comparing both pixel arrays, just look for the center, top, bottom, left, right, into an array.
//Then check those for cross over.