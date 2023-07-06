
let counter = 0; // Counter for draw function
let circleSpeed = 3; //speed of the timid cirlce
let maxSpeed = 7; //max speed of the bouncing circle
let sizeVar = 800; // Size of the canvas
let timidCirclemass = 55
let foodSeekerMass = 30 // Size of bouncing ball
let foodItemMass = 50
const fear = 8
const topSpeed = 3.75
const foodNeed = .75
const flySpeed = 10
swarmSize = 1

/*
***************
Functions
***************
*/

function getSideLenNotHypot(hypotenuse, leg) {
  
  let len = Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(leg, 2));
  return len;
}

function getMidpoint(x1, y1, x2, y2) {
  let newX = (x1 + x2) / 2;
  let newY = (y1 + y2) / 2;

  let result = [newX, newY];

  return result;
}


function getEqTriagleCoord(x, y, length) {
  let x2 = x + length;
  let y2 = y;
  let midpoint = getMidpoint(x, y, x2, y2);
  let x3 = midpoint[0];
  let centerLen = getSideLenNotHypot(length, length/2);
  let y3 = y + centerLen;

  return [x, y, x2, y2, x3, y3];
}


function rotateAroundPoint(xC, yC, xO, yO, angle) {
  let xN = (xO - xC) * Math.cos(angle) - (yO - yC) * Math.sin(angle) + xC;
  let yN = (xO - xC) * Math.sin(angle) + (yO - yC) * Math.cos(angle) + yC;

  return [xN, yN];
}

function getLineLen(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
}

function shrinkTriangle(triangleLst, scale){
  for(let i = 0; i < triangleLst.length; i++){
    triangleLst[i] = triangleLst[i] * scale
  }
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandColorInt() {
  return Math.floor(Math.random() * 256);
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

  static getVDistance(v1, v2){
    return Math.abs(Math.sqrt(((v2.x - v1.x) * (v2.x - v1.x)) + ((v2.y - v1.y) * (v2.y - v1.y))))
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


class Crawler {
  constructor(segments, segmentSize, angleX, aVelocityX, amplitudeX, angleY, aVelocityY, amplitudeY, xOffset, xSpeed, yOffset, ySpeed){
    this.segments = segments;
    this.segmentSize = segmentSize;

    this.angleX = angleX;
    this.aVelocityX = aVelocityX;
    this.amplitudeX = amplitudeX;

    this.angleY = angleY;
    this.aVelocityY = aVelocityY;
    this.amplitudeY = amplitudeY;

    this.location = new PVector(xOffset, yOffset)
    this.velocity = new PVector(xSpeed, ySpeed)
    this.acceleration = new PVector(0,0);
    
  } 

  display(){
    let angle = atan2(this.velocity.y, this.velocity.x)
    ellipseMode(CENTER);
    stroke(255);
    fill(175);
    push()
    translate(this.location.x, this.location.y);
    rotate(angle)
    for (let pos = -200; pos <= 0; pos += 15) {
      let x = this.amplitudeX * cos(this.angleX + pos / 25);
      let y = this.amplitudeY * sin(this.angleY + pos / 150);
      
      strokeWeight(1);
      ellipse(pos, y - 15, 30, 30);
      strokeWeight(3);
      line(pos, y, pos + x, y + 30);
      line(pos, y - 30, pos + x, y - 60);
      
      this.angleY += this.aVelocityY;
      console.log(y - this.location.y)

    }
    pop()

    //ellipse(this.location.x, this.location.y, 50, 50)

  }

  update(){
    this.velocity.add(this.acceleration)
    this.velocity.limit(5);
    this.location.add(this.velocity)

    this.angleX += this.aVelocityX;
  }

  reset() {
    //If this is too far outside the canvas
    if(this.location.x > width + 300 || this.location.x < -300|| this.location.y > height + 300 || this.location.y < -300) {
      //Reset X to be a random value.
      this.location.x =  getRandomInt(-50, width + 50);
        //If X is inside the canvas, Reset Y to be above or below. 
        if(this.location.x < width && this.location.x > 0) {
          let randInt = getRandomInt(1, 100);
          if(randInt % 2  == 0) {
            this.location.y = -50;
          } else {
            this.location.y = height + 50;
          }
        //Else, Y can be reset anywhere in defined boundaries
        } else {
          this.location.y =  getRandomInt(-50, height + 50);
        }
      //If X is on the left side of the canvas, make X speed positive. 
      if(this.location.x < width/2) {
        this.velocity.x = getRandomInt(1, 5);
      //Else, make x speed negative.  
      } else {
        this.velocity.x = getRandomInt(-5, -1);
      }
      //If Y is on the top of the cavas, make Yspeed positive. 
      if(this.location.y < height/2){
        this.velocity.y = getRandomInt(1, 5);
        //Else, make Y speed negative. Use a range for thse values.
      } else {
        this.velocity.y = getRandomInt(-5, -1);
      }
    }
  }
}

class Particle {
  constructor(){
  this.location = new PVector(0,0);
  this.velocity = new PVector(getRandomFloat(-5, 5), getRandomFloat(-5, 5));
  this.acceleration = new PVector(0, .1);
  this.lifespan = 255
  //this.bodyColor = [getRandColorInt(), getRandColorInt(), getRandColorInt()]

  this.location.x =  getRandomInt(-50, sizeVar + 50);
  //If X is inside the canvas, Reset Y to be above or below. 
  if(this.location.x < sizeVar && this.location.x > 0) {
      let randInt = getRandomInt(1, 100);
      if(randInt % 2  == 0) {
        this.location.y = -50;
      } else {
        this.location.y = sizeVar + 50;
      }
    //Else, Y can be reset anywhere in defined boundaries
    } else {
      this.location.y =  getRandomInt(-50, sizeVar + 50);
    }
    let destination = new PVector(sizeVar/2, sizeVar/2);
    let dir = PVector.sub(destination, this.location)

    dir.normalize();
    dir.multi(0.5)
    this.acceleration = dir;

    this.velocity.add(this.acceleration)
    this.velocity.limit(topSpeed);
    this.location.add(this.velocity)
  }  
  

 
  update(foodX, foodY) {
    this.lifespan -= 2
    let destination = new PVector(foodX, foodY);
    let dir = PVector.sub(destination, this.location)

    dir.normalize();
    dir.multi(0.5)
    this.acceleration = dir;

    this.velocity.add(this.acceleration)
    this.velocity.limit(flySpeed);
    this.location.add(this.velocity)
    
  }

  reset() {
    this.location = new PVector(sizeVar/2,sizeVar/4);
    this.velocity = new PVector(getRandomFloat(-5, 5), getRandomFloat(-5, 5));
    this.acceleration = new PVector(0, .1);
    this.lifespan = 255
  }
 
  display() {
    let angle = atan2(this.velocity.y, this.velocity.x)
    stroke(220, this.lifespan)
    fill(220, this.lifespan);
    push();
    rectMode(CENTER);
    translate(this.location.x, this.location.y);
    rotate(angle);
    //let coord = getEqTriagleCoord(0, 0, 10)
    //triangle(coord[0], coord[1], coord[2], coord[3], coord[4], coord[5])
    rect(0, 0, 5, 1)
    pop();
  }

  isDead(){
    if(this.lifespan < 0){
      return true;
    } else {
      return false;
    }
  }

  run(foodX, foodY){
    this.display();
    this.update(foodX, foodY);
  }

}

class ParticleSystem{
  constructor(){
    this.pArray = []
    this.location = new PVector(sizeVar/2,sizeVar/4);
  }
//First, I want to be populating the list every frame. Then, I want to remove any dead 
//particles. Finally, I want to display the current particles in the list. This will then
//all be called in a run function. 
  addParticle(){
    let p = new Particle();
    this.pArray.push(p);
  }

  run(foodX, foodY){
    const iterator = this.pArray[Symbol.iterator]();
    let current = iterator.next();

    while(!current.done){
      const particle = current.value;
      particle.run(foodX, foodY);
      if (particle.isDead()) {
        const indexToRemove = this.pArray.indexOf(particle);
        this.pArray.splice(indexToRemove, 1);
        console.log("SPLICE!")
        current = iterator.next();
      } else {
        current = iterator.next();
      }
    }
    for(let i = 0; i<swarmSize; i++){
      this.addParticle();
    } 
    console.log(this.pArray.length)
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
let crawler = new Crawler(0, 0, 0, 0.1, 15, 0, .001, 150, 0, 1, 0, -1);
let swarm = new ParticleSystem();


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
  let seekerToItemDist = PVector.getVDistance(foodItem.location, foodSeeker.location)

  if(seekerToItemDist <= (foodItemMass + foodSeekerMass)/2){
    foodItem.resetPosition()
  }

  //Run Crawler Methods
  crawler.display();
  crawler.update();
  crawler.reset();

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


  //Draw the food seeker
  fill(0, 0, 255); // Make the color blue
  ellipse(foodSeeker.location.x, foodSeeker.location.y, foodSeeker.mass, foodSeeker.mass);

  //Draw the food item
  fill(255, 0, 255);
  ellipse(foodItem.location.x, foodItem.location.y, foodItem.mass, foodItem.mass)

  //Make the Swarm
  swarm.run(foodItem.location.x, foodItem.location.y);
}


//TODO: Need to fix the food jumping around. Instead of comparing both pixel arrays, just look for the center, top, bottom, left, right, into an array.
//Then check those for cross over.