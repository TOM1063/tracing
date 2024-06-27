let size = {
  x: window.innerWidth,
  y: window.innerHeight,
};

let prev_point;

function setup() {
  console.log("setup");
  setListeners();
  createCanvas(size.x, size.y);
  background(255);
}

function draw() {
  //   background(0);
  //   fill(255);
  //   stroke(255);
  //   pen(mouseX, mouseY, 10);
}

function mouseDragged() {
  fill(255);
  stroke(0);
  pen(mouseX, mouseY, 2);

  if (prev_point) {
    let dist_from_prev = int(dist(prev_point.x, prev_point.y, mouseX, mouseY));
    let factor = dist_from_prev / 2;

    for (let i = 0; i < factor; i++) {
      let div_x = (prev_point.x * (factor - i) + mouseX * i) / factor;
      let div_y = (prev_point.y * (factor - i) + mouseY * i) / factor;
      pen(div_x, div_y, 2);
    }
    prev_point.x = mouseX;
    prev_point.y = mouseY;
  } else {
    prev_point = new p5.Vector(mouseX, mouseY);
  }
}

function mouseReleased() {
  prev_point = null;
}

function setListeners() {
  window.addEventListener("resize", () => {
    size.x = window.innerWidth;
    size.y = window.innerWidth;
  });
}

function pen(_x, _y, _rad) {
  let points = [];
  for (let i = 0; i < _rad * 10; i++) {
    let x = _x + random(-_rad, _rad);
    let y = _y + random(-_rad, _rad);
    point(x, y);
  }
  // for(let i = 0; i < 100; i ++) {
  //       points.push(new p5.Vector(random(-_rad,_rad),random(-_rad,_rad)))
  // }
}
