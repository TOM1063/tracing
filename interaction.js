let size = {
  x: window.innerWidth,
  y: window.innerHeight,
};

function setup() {
  console.log("setup");
  createCanvas(size.x, size.y);
  background(0);
  background(0, 0, 0, 200);
}

function draw() {
  stroke(255, 30);
  noFill();
  ellipse(mouseX, mouseY, 100, 100);
}
