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

let loaded_graph;

let f = 0;

let current_id = 0;

let loaded_lines;
let prev_loaded_point;

let img;

function preload() {
  table = loadTable("./data/lines.csv", "csv", "header", () => {
    loaded_lines = getLinesFromTable(table);
    console.log("loaded_lines:", loaded_lines);
  });

  img = loadImage("data/bibi.png");
}

function headerMenuFunc() {
  document.addEventListener("touchmove", handleTouchMove, { passive: false });
}

function handleTouchMove(e) {
  e.preventDefault();
}

window.addEventListener("resize", () => {
  size.x = window.innerWidth;
  size.y = window.innerWidth;
});

function setup() {
  blendMode(ADD);
  console.log("setup");
  createCanvas(size.x, size.y);
  background(255);
  stroke_size = 1;

  bold_button = createButton("thick");
  bold_button.position(50, 100);
  bold_button.mousePressed(setBold);

  mid_button = createButton("mid");
  mid_button.position(100, 100);
  mid_button.mousePressed(setMid);

  thin_button = createButton("thin");
  thin_button.position(150, 100);
  thin_button.mousePressed(setThin);

  player_graph = createGraphics(size.x, size.y);
  player_graph.clear();

  player_log = createGraphics(size.x, size.y);
  player_log.clear();

  loaded_graph = createGraphics(size.x, size.y);
  loaded_graph.clear();
  loaded_graph.image(img, 0, 0, size.x, size.y);
  loaded_graph.background(0, 0, 0, 200);
  for (let log_line of loaded_lines) {
    //     log_line.showIntersection(mouseX, mouseY);
    log_line.display(loaded_graph);
  }
  image(loaded_graph, 0, 0);
}

function draw() {
  background(0);
  image(loaded_graph, 0, 0);
  image(player_log, 0, 0);
  noStroke();
  fill(255);
  let fps = frameRate();
  text("FPS : " + String(round(fps, 2)), 50, 20);
  fill(0);
}

function mouseDragged() {
  player_logs(f);
  for (let log_line of loaded_lines) {
    log_line.showIntersection(mouseX, mouseY, loaded_graph);
  }
  //   player_graphics();
}

function mouseReleased() {
  prev_point = null;
  prev_logline = false;
}

function touchEnded() {
  prev_point = null;
  prev_logline = false;
}

function player_graphics() {
  //   background(255);
  player_graph.fill(255);
  player_graph.stroke(0);
  circle_pen(mouseX, mouseY, stroke_size, player_graph);

  if (prev_point) {
    let dist_from_prev = int(dist(prev_point.x, prev_point.y, mouseX, mouseY));
    let factor = (dist_from_prev / stroke_size) * 100;

    for (let i = 0; i < factor; i++) {
      let div_x = (prev_point.x * (factor - i) + mouseX * i) / factor;
      let div_y = (prev_point.y * (factor - i) + mouseY * i) / factor;
      circle_pen(div_x, div_y, stroke_size, player_graph);
    }
    prev_point.x = mouseX;
    prev_point.y = mouseY;
  } else {
    prev_point = new p5.Vector(mouseX, mouseY);
  }
}

function player_logs(f) {
  //   background(255);
  if (prev_logline) {
    prev_logline.addPoint(mouseX, mouseY, f);
  } else {
    player_log.textSize(10);
    player_log.noStroke();
    player_log.fill(255);
    player_log.text(current_id, mouseX + 10, mouseY + 10);
    prev_logline = new LogLine(current_id);
    prev_logline.addPoint(mouseX, mouseY, f);
    current_id++;
  }
  if (prev_point) {
    let dist_from_prev = int(dist(prev_point.x, prev_point.y, mouseX, mouseY));
    player_log.stroke(255, 255, 255, 200 / Math.sqrt(dist_from_prev));
    player_log.strokeWeight(
      (1 + 3 / Math.sqrt(dist_from_prev + 5)) * stroke_size
    );
    player_log.noFill();
    player_log.line(prev_point.x, prev_point.y, mouseX, mouseY);
  }
  prev_point = new p5.Vector(mouseX, mouseY);
  image(player_log, 0, 0);
}

function setBold() {
  stroke_size = 5;
}
function setMid() {
  stroke_size = 3;
}
function setThin() {
  stroke_size = 1;
}

function circle_pen(_x, _y, _rad, _graphics) {
  let points = [];
  for (let i = -_rad; i < _rad; i += 1 / (_rad * 2)) {
    let border = Math.sin(Math.acos(i / _rad)) * _rad;
    let x = _x + random(-border, border);
    _graphics.point(x, _y + i);
  }
  // for(let i = 0; i < 100; i ++) {
  //       points.push(new p5.Vector(random(-_rad,_rad),random(-_rad,_rad)))
  // }
}

class LogLine {
  constructor(_id) {
    this.points = [];
    this.id = _id;
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
  }
  addPoint(_x, _y, _frame) {
    let point = { x: _x, y: _y, f: _frame };
    this.points.push(point);
  }
  display(_graphics) {
    _graphics.stroke(this.color);
    _graphics.strokeWeight(1);
    for (let i = 0; i < this.points.length - 1; i++) {
      _graphics.line(
        this.points[i].x * size.x,
        this.points[i].y * size.y,
        this.points[i + 1].x * size.x,
        this.points[i + 1].y * size.y
      );
    }
  }

  showIntersection(_mouse_x, _mouse_y, _graphics) {
    for (let i = 0; i < this.points.length - 1; i++) {
      let distance_info = distToSegment(
        _mouse_x,
        _mouse_y,
        this.points[i].x * size.x,
        this.points[i].y * size.y,
        this.points[i + 1].x * size.x,
        this.points[i + 1].y * size.y
      );
      if (distance_info.distance < 2) {
        _graphics.noStroke();
        _graphics.fill(
          red(this.color),
          green(this.color),
          blue(this.color),
          10
        );
        for (let j = 0; j < 7; j += 1) {
          _graphics.circle(
            distance_info.intersection.x,
            distance_info.intersection.y,
            j * j
          );
        }
      }
    }
  }

  getPoints = () => {
    console.log("point is");
    return this.points;
  };
}

function getLinesFromTable(_table) {
  console.log("row counts :", _table.getRowCount());
  let prev_id = 0;
  let lines = [];
  for (let i = 0; i < _table.getRowCount(); i++) {
    let frame = i;
    let id = _table.getString(int(i), 0);
    let u = _table.getString(int(i), 1);
    let v = 1 - _table.getString(int(i), 2);
    let width = _table.getString(int(i), 3);
    let height = _table.getString(int(i), 4);

    if (id != prev_id) {
      if (id == "") {
        // console.log("no", id);
        continue;
      } else {
        let new_line = new LogLine(id);
        new_line.addPoint(u, v, i);
        lines.push(new_line);
        prev_id = id;
      }
    } else {
      console.log("same");
      lines[lines.length - 1].addPoint(u, v, i);
    }
    console.log("");
  }
  return lines;
}

function distToSegment(px, py, x1, y1, x2, y2) {
  let l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (l2 === 0)
    return { distance: dist(px, py, x1, y1), intersection: { x: x1, y: y1 } };
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  let intersection = { x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) };
  return {
    distance: dist(px, py, intersection.x, intersection.y),
    intersection,
  };
}
