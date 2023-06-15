
let counter = 0; // Counter for draw function
let circleSpeed = 3; //speed of the timid cirlce
let maxSpeed = 7; //max speed of the bouncing circle
let sizeVar = 800; // Size of the canvas
let timidCirclemass = 55
let foodSeekerMass = 30 // Size of bouncing ball
let foodItemMass = 15
const fear = 8
const topSpeed = 3.75
const foodNeed = .8

/*
***************
Functions
***************
*/



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

  static getVDistance(v1, v2){
    return Math.abs(Math.sqrt(((v2.x - v1.x) * (v2.x - v1.x)) + ((v2.y - v1.y) * (v2.y - v1.y))))
  }

  static getMidpoint(v1, v2){
    let midX = (v1.x + v2.x) / 2
    let midY = (v1.y + v2.y) / 2
    return new PVector(midX, midY)
  }

}


// Food Seeker Class
class FoodSeeker{
  constructor(x_, y_, mass){
    this.location = new PVector(x_, y_);
    this.velocity = new PVector(0,0);
    this.acceleration = new PVector(0,0);
    this.mass = mass; // Set the mass (aka size) of the circle
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
    force.multi(foodNeed)
    this.acceleration = force;
  }

  
}

// Food Class
class FoodItem{
  constructor(x_, y_, mass){
    this.location = new PVector(x_, y_);
    this.mass = mass; // Set the mass (aka size) of the circle
  }

  resetPosition(){
    this.location.x = Math.floor(Math.random() * (sizeVar - 15)) + 15
    this.location.y = Math.floor(Math.random() * (sizeVar - 15)) + 15
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
let timidCircle = new TimidCircle(sizeVar/2, sizeVar/2, timidCirclemass);
let foodSeeker = new FoodSeeker(sizeVar/4, sizeVar/4, foodSeekerMass)
let foodItem = new FoodItem(Math.floor(Math.random() * (sizeVar - 15)) + 15, Math.floor(Math.random() * (sizeVar - 15)) + 15, foodItemMass);
//let foodItem = new FoodItem(sizeVar/2, sizeVar/2, foodItemMass)



/*
***************
SETUP
***************
*/

function setup() {
  createCanvas(sizeVar, sizeVar); // Create a canvas with a width and height of 400 pixels
  background(0); // Set the background color to black

}


/*
***************
DRAW
***************
*/

function draw() {
  //background(0); // Set the background color to black


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
  let seekerToItemDist = PVector.getVDistance(foodItem.location, foodSeeker.location)

  if(seekerToItemDist <= (foodItemMass + foodSeekerMass)/2){
    foodItem.resetPosition()
  }



  // Attract the food seeker to the food
  foodSeeker.goToFood(foodItem);

  //Timid circle repels the food seeker
  repel = timidCircle.repelFoodSeeker(foodSeeker);
  foodSeeker.applyForce(repel)

  //Update the Food Seeker
  foodSeeker.update()

  // Draw the timid circle
  stroke(255); // Set the stroke color to white
  fill(34, 139, 34); // Make the color green
  ellipse(timidCircle.location.x, timidCircle.location.y, timidCircle.mass, timidCircle.mass); // Draw an ellipse at the current location with a diameter of 30 pixels


  // Get midpoints
  timidFoodItemMP = PVector.getMidpoint(timidCircle.location, foodItem.location)
  timidFoodSeekerMP =PVector.getMidpoint(timidCircle.location, foodSeeker.location)
  seekerItemMP = PVector.getMidpoint(foodSeeker.location, foodItem.location)


  // Draw timid circle lines

  stroke(34, 139, 34); // Set the stroke color to Green
  //line(timidCircle.location.x, timidCircle.location.y, timidFoodItemMP.x, timidFoodItemMP.y)
  //line(timidCircle.location.x, timidCircle.location.y, timidFoodSeekerMP.x, timidFoodSeekerMP.y)

  //Draw the food seeker
  stroke(255); // Set the stroke color to white
  fill(0, 0, 255); // Make the color blue
  ellipse(foodSeeker.location.x, foodSeeker.location.y, foodSeeker.mass, foodSeeker.mass);
  
  // Draw foodSeeker lines
  stroke(0, 0, 255); // Set the stroke color to Blue
  //line(foodSeeker.location.x, foodSeeker.location.y, seekerItemMP.x, seekerItemMP.y)
  //line(foodSeeker.location.x, foodSeeker.location.y, timidFoodSeekerMP.x, timidFoodSeekerMP.y)


  //Draw the food item
  stroke(255); // Set the stroke color to white
  fill(255, 0, 255);
  //ellipse(foodItem.location.x, foodItem.location.y, foodItem.mass, foodItem.mass)

  // Draw FoodItem lines
  stroke(255, 0, 255); // Set the stroke color to Pink
  //line(foodItem.location.x, foodItem.location.y, timidFoodItemMP.x, timidFoodItemMP.y)
  //line(foodItem.location.x, foodItem.location.y, seekerItemMP.x, seekerItemMP.y) 

///*
  //Draw midpoint circles
  fill(255)// Set fil to white
  stroke(0)//Set stroke to black
  ellipse(timidFoodItemMP.x, timidFoodItemMP.y, 20)
  ellipse(timidFoodSeekerMP.x, timidFoodSeekerMP.y, 20)
  ellipse(seekerItemMP.x, seekerItemMP.y, 20)
//*/
}


//TODO: Need to fix the food jumping around. Instead of comparing both pixel arrays, just look for the center, top, bottom, left, right, into an array.
//Then check those for cross over.