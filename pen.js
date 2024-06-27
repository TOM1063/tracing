let size = {
  x: window.innerWidth,
  y: window.innerHeight,
};

let prev_point;
let prev_logline;
let log_id;
let stroke_size;

let bold_button;
let mid_button;
let thin_button;

let player_graph;
let player_log;

let f = 0;

function headerMenuFunc() {
  document.addEventListener("touchmove", handleTouchMove, { passive: false });
}

function handleTouchMove(e) {
  e.preventDefault();
}

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

  player_graph = createGraphics(size.x, size.y);
  player_graph.clear();

  player_log = createGraphics(size.x, size.y);
  player_log.clear();
}

function draw() {
  //   background(0);
  //   fill(255);
  //   stroke(255);
  //   pen(mouseX, mouseY, 10);
  f++;
}

function mouseDragged() {
  //   player_logs(f);
  player_graphics();
}

function mouseReleased() {
  prev_point = null;
  prev_logline = false;
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

function player_graphics() {
  background(255);
  player_graph.fill(255);
  player_graph.stroke(0);
  pen(mouseX, mouseY, stroke_size, player_graph);

  if (prev_point) {
    let dist_from_prev = int(dist(prev_point.x, prev_point.y, mouseX, mouseY));
    let factor = dist_from_prev / stroke_size;

    for (let i = 0; i < factor; i++) {
      let div_x = (prev_point.x * (factor - i) + mouseX * i) / factor;
      let div_y = (prev_point.y * (factor - i) + mouseY * i) / factor;
      pen(div_x, div_y, stroke_size, player_graph);
    }
    prev_point.x = mouseX;
    prev_point.y = mouseY;
  } else {
    prev_point = new p5.Vector(mouseX, mouseY);
  }

  image(player_graph, 0, 0);
}

function player_logs(f) {
  if (prev_logline) {
    prev_logline.addPoint(mouseX, mouseY, f);
  } else {
    prev_logline = new LogLine(log_id);
    prev_logline.addPoint(mouseX, mouseY, f);
  }
  if (prev_point) {
    player_log.stroke(255, 0, 0);
    player_log.noFill();
    player_log.line(prev_point.x, prev_point.y, mouseX, mouseY);
  }
  prev_point = new p5.Vector(mouseX, mouseY);
  image(player_log, 0, 0);
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

function pen(_x, _y, _rad, _graphics) {
  let points = [];
  for (let i = 0; i < _rad * 10; i++) {
    let x = _x + random(-_rad, _rad);
    let y = _y + random(-_rad, _rad);
    _graphics.point(x, y);
  }
  // for(let i = 0; i < 100; i ++) {
  //       points.push(new p5.Vector(random(-_rad,_rad),random(-_rad,_rad)))
  // }
}

class LogLine {
  constructor(_id) {
    this.points = [];
    this.id = _id;
  }
  addPoint(_x, _y, _frame) {
    let point = { x: _x, y: _y, f: _frame };
    this.points.push(point);
  }
  display() {
    stroke(random(100, 255), random(100, 255), random(100, 255));
    for (let i = 0; i < this.points.size(); i++) {
      line(
        this.points[i].x,
        this.points[i].y,
        this.points[i + 1].x,
        this.points[i + 1].y
      );
    }
  }

  getPoints = () => {
    console.log("point is");
    return this.points;
  };
}
