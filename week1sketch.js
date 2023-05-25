class PVector {
  constructor(x_, y_){
    this.x = x_;
    this.y = y_;
  }

  add(v) {
    this.y = this.y + v.y;
    this.x = this.x + v.x;
  }
}

let locationVar = new PVector(100,100);
let velocityVar = new PVector(2.5, 5);

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0);
  locationVar.add(velocityVar);
  
  if ((locationVar.x > width-8) || (locationVar.x < 0+8)) {
    velocityVar.x = velocityVar.x * -1;
  }
  if ((locationVar.y > height-8) || (locationVar.y < 0+8)) {
    velocityVar.y = velocityVar.y * -1;
  }

  stroke(255);
  fill(175);
  ellipse(locationVar.x,locationVar.y,16,16);

}
