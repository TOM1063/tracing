let size = {
  x: window.innerWidth,
  y: window.innerHeight,
};

let prev_point;
let stroke_size;

let bold_button;
let mid_button;
let thin_button;

function setup() {
  console.log("setup");
  setListeners();
  createCanvas(size.x, size.y);
  background(255);
  stroke_size = 10;

  bold_button = createButton("thick");
  bold_button.position(0, 100);
  bold_button.mousePressed(setBold);

  mid_button = createButton("mid");
  mid_button.position(100, 100);
  mid_button.mousePressed(setMid);

  thin_button = createButton("thin");
  thin_button.position(200, 100);
  thin_button.mousePressed(setThin);
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
  pen(mouseX, mouseY, stroke_size);

  if (prev_point) {
    let dist_from_prev = int(dist(prev_point.x, prev_point.y, mouseX, mouseY));
    let factor = dist_from_prev / stroke_size;

    for (let i = 0; i < factor; i++) {
      let div_x = (prev_point.x * (factor - i) + mouseX * i) / factor;
      let div_y = (prev_point.y * (factor - i) + mouseY * i) / factor;
      pen(div_x, div_y, stroke_size);
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

  //   document.getElementById("bold").addEventListener("onclick", () => {
  //     console.log("set stroke");
  //     stroke_size = 100;
  //   });
  //   document.getElementById("midium").addEventListener("onclick", () => {
  //     stroke_size = 50;
  //   });
  //   document.getElementById("thin").addEventListener("onclick", () => {
  //     stroke_size = 10;
  //   });
}

function setBold() {
  stroke_size = 50;
}
function setMid() {
  stroke_size = 20;
}
function setThin() {
  stroke_size = 5;
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
