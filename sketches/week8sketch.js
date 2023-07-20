
let counter = 0; // Counter for draw function
let circleSpeed = 3; //speed of the timid cirlce
let maxSpeed = 7; //max speed of the bouncing circle
let sizeVar = 1200; // Size of the canvas
let timidCirclemass = 55
let foodSeekerMass = 30 // Size of bouncing ball
let foodItemMass = 50
const maxBugLength = 200
const maxBugSize = 50
const fear = 8
const topSpeed = 3.75
const crawlerSpeed = 2
const foodNeed = .75
const flySpeed = 10
const swarmSize = 1
const numberOfBugs = 3


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

function colorMod(x) {
  var normalized = x % 510; // Get the value in the range of 0 to 509

  if (normalized > 255) {
    normalized = 510 - normalized; // Map values above 255 back to the range of 0 to 255
  }

  return normalized;
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
    this.counter = 0
    this.triangleList = []
  }

  update(){
    this.velocity.add(this.acceleration)
    this.velocity.limit(topSpeed);
    this.location.add(this.velocity)
    this.counter += 1
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

  display() {
    let angle = atan2(this.velocity.y, this.velocity.x)
    this.addToList(angle, this.location)
    this.displayList();
    stroke(100)
    fill(0, 0, 255); // Make the color blue
    push();
    rectMode(CENTER);
    translate(this.location.x, this.location.y);
    rotate(angle+5);
    let coord = getEqTriagleCoord(0, 0, this.mass)
    triangle(coord[0], coord[1], coord[2], coord[3], coord[4], coord[5])
    pop();
  }

  addToList(angle, location){
    if(this.counter%2 == 0){
      let loc = new PVector(location.x, location.y); // Create a new PVector object with the coordinates
      this.triangleList.push([angle, loc])
      if(this.triangleList.length > 40){
        this.triangleList.shift();
      }
    }
  }

  displayList(){
    for(var i = 0; i < this.triangleList.length; i++){
      stroke(100)
      fill(0, 0, 255); // Make the color blue
      push();
      rectMode(CENTER);
      translate(this.triangleList[i][1].x, this.triangleList[i][1].y);
      console.log(this.triangleList[i][1].x)
      rotate(this.triangleList[i][0]+5);
      let coord = getEqTriagleCoord(0, 0, this.mass)
      triangle(coord[0], coord[1], coord[2], coord[3], coord[4], coord[5])
      pop();
    }
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
    this.mass = foodItemMass;
  }

  shrink(){
    this.mass -= .01;
  }

  isDead(){
    if(this.mass < 7){
      this.resetPosition();
    }
  }

  isTouching(otherLocation){
    let dist = PVector.getVDistance(this.location, otherLocation)
    if(dist < this.mass){
      return true
    } else {
      return false
    }
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
    this.angle = 0;
    this.angleVel = .02;
    this.amplitudeX =25;
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

  display() {
    push();

    translate(this.location.x, this.location.y); // Translate to the center of the square
    rotate(this.angle);
    this.angle += this.angleVel;
    stroke(colorMod(this.angle), colorMod(this.location.x), colorMod(this.location.y)); // Set the stroke color to white
    fill(colorMod(this.location.y), colorMod(this.location.x), colorMod(this.location.y - this.location.x)); // Make the color green
    rect(0, 0, this.mass, this.mass);
    for(let i = this.mass +this.mass * .1; i -= this.mass * .1; i > 0) {
      let x = this.amplitudeX * cos(this.angle*2 + i / 25);
      line(0, 0 + i , 0-15, 0 + i - 15 + x) // Left Side
      line(0 + i, 0, 0 + i + 15 + x, 0 - 15) // Top Side
      line(0 + this.mass, 0 + i, (0 + this.mass) + 15, (0 + this.mass/2) + i - 15-x) // Right Side
      line(0 + i, 0 + this.mass, 0 + i - 15-x, 0 + this.mass  + 15) // Bottom Side
    }
    fill(colorMod(this.location.x), colorMod(this.location.y), colorMod(this.location.y + this.location.x)); // Make the color green
    ellipse(0+this.mass/2, 0+this.mass/2, this.mass, this.mass)
    pop()
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
  constructor(angleX, aVelocityX, amplitudeX, angleY, aVelocityY, amplitudeY){
    this.length = getRandomInt(5, maxBugLength);
    this.size = getRandomInt(15, maxBugSize);
    this.distance = this.size/ getRandomInt(2, 8);

    this.angleX = angleX;
    this.aVelocityX = aVelocityX;
    this.amplitudeX = amplitudeX;

    this.angleY = angleY;
    this.aVelocityY = aVelocityY;
    this.amplitudeY = amplitudeY;

    this.location = new PVector(0, 0)
    this.velocity = new PVector(0, 0)
    this.acceleration = new PVector(0,0);

    this.bodyColor = [getRandColorInt(), getRandColorInt(), getRandColorInt()]

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
    //If X is on the left side of the canvas, make X speed positive. 
    if(this.location.x < sizeVar/2) {
      this.velocity.x = getRandomInt(1, crawlerSpeed);
    //Else, make x speed negative.  
    } else {
      this.velocity.x = getRandomInt(-crawlerSpeed, -1);
    }
    //If Y is on the top of the cavas, make Yspeed positive. 
    if(this.location.y < sizeVar/2){
      this.velocity.y = getRandomInt(1, crawlerSpeed);
      //Else, make Y speed negative. Use a range for thse values.
    } else {
      this.velocity.y = getRandomInt(-crawlerSpeed, -1);
    }  
  } 

  display(){
    let angle = atan2(this.velocity.y, this.velocity.x)
    ellipseMode(CENTER);
    stroke(255);
    fill(this.bodyColor[0], this.bodyColor[1], this.bodyColor[2]);
    push()
    translate(this.location.x, this.location.y);
    rotate(angle)
    for (let pos = -this.length - 10; pos <= -10; pos += this.distance) {
      //let x = this.amplitudeX * cos(this.angleX + pos / 25);
      let x = this.amplitudeX * cos(this.angleX + pos / 25);
      let y = this.amplitudeY * sin(this.angleY + pos / 150);
      
      strokeWeight(1);
      fill(this.bodyColor[0], this.bodyColor[1], this.bodyColor[2]);
      //fill(this.location.y % 255, this.location.x % 255, Math.abs(this.location.x - this.location.y) % 255);
      stroke(0);
      ellipse(pos, y - (this.size/2), this.size, this.size);
      strokeWeight(3);
      //stroke(255)
      stroke(this.bodyColor[2], this.bodyColor[1], this.bodyColor[0])
      //stroke(this.location.x % 255, this.location.y % 255, (this.location.x + this.location.y) % 255);
      line(pos, y, pos + x, y + this.size);
      line(pos, y - this.size, pos + x, y - (this.size*2));
      
      this.angleY += this.aVelocityY;

    }
    pop()
  }

  update(){
    this.velocity.add(this.acceleration)
    this.velocity.limit(topSpeed);
    this.location.add(this.velocity)

    this.angleX += this.aVelocityX;
  }

  reset() {
    //If this is too far outside the canvas
    if(this.location.x > width + this.length || this.location.x < -this.length|| this.location.y > height + this.length || this.location.y < -this.length) {
      //Reset X to be a random value.
      this.location.x =  getRandomInt(-50, width + 50);
        //If X is inside the canvas, Reset Y to be above or below. 
        if(this.location.x < width && this.location.x > 0) {
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
      //If X is on the left side of the canvas, make X speed positive. 
      if(this.location.x < sizeVar/2) {
        this.velocity.x = getRandomInt(1, crawlerSpeed);
      //Else, make x speed negative.  
      } else {
        this.velocity.x = getRandomInt(-crawlerSpeed, -1);
      }
      //If Y is on the top of the cavas, make Yspeed positive. 
      if(this.location.y < sizeVar/2){
        this.velocity.y = getRandomInt(1, crawlerSpeed);
        //Else, make Y speed negative. Use a range for thse values.
      } else {
        this.velocity.y = getRandomInt(-crawlerSpeed, -1);
      }

      this.bodyColor = [getRandColorInt(), getRandColorInt(), getRandColorInt()]
      this.length = getRandomInt(5, maxBugLength);
      this.size = getRandomInt(15, maxBugSize);
      this.distance = this.size/ getRandomInt(2, 8);
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
        current = iterator.next();
      } else {
        current = iterator.next();
      }
    }
    for(let i = 0; i<swarmSize; i++){
      this.addParticle();
    } 
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
let swarm = new ParticleSystem();

let crawlerList = []

//Instantiation
for(let i = 0; i < numberOfBugs; i++) {
  let crawler = new Crawler(0, 0.1, 15, 0, .001, 150);
  crawlerList.push(crawler);

}


/*
***************
SETUP
***************
*/

function setup() {
  createCanvas(sizeVar, sizeVar);
  background(0); // Set the background color to black

}


/*
***************
DRAW
***************
*/

function draw() {
  background(0); // Set the background color to black

  for(let i = 0; i < crawlerList.length; i++) {
    crawlerList[i].display();
    crawlerList[i].update();
    crawlerList[i].reset();
  }

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

  if(seekerToItemDist <= ((foodItem.mass + foodSeekerMass)/2)+8){
    foodItem.resetPosition()
  }



  //Run Crawler Methods
  for(let i = 0; i < crawlerList.length; i++) {
    crawlerList[i].display();
    crawlerList[i].update();
    crawlerList[i].reset();
  }

  // Attract the food seeker to the food
  foodSeeker.goToFood(foodItem);

  //Timid circle repels the food seeker
  repel = timidCircle.repelFoodSeeker(foodSeeker);
  foodSeeker.applyForce(repel)

  //Update the Food Seeker
  foodSeeker.update()

  // Draw the timid circle
  timidCircle.display();

  //Draw the food seeker
  foodSeeker.display()

  //Draw the food item
  fill(255, 0, 255);
  ellipse(foodItem.location.x, foodItem.location.y, foodItem.mass, foodItem.mass)

  //Make the Swarm
  swarm.run(foodItem.location.x, foodItem.location.y);


  for(let i = 0; i < swarm.pArray.length; i++){

    if(foodItem.isTouching(swarm.pArray[i].location)){
      foodItem.shrink();
    }
  }
    //foodItem.shrink();
    foodItem.isDead();

}


//TODO: Need to fix the food jumping around. Instead of comparing both pixel arrays, just look for the center, top, bottom, left, right, into an array.
//Then check those for cross over.