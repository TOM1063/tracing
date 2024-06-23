let size = {
  x: window.innerWidth,
  y: window.innerHeight,
};
let table;
let lines;
let img;

function preload() {
  table = loadTable("./data/lines.csv", "csv", "header", () => {
    lines = getLinesFromTable(table);
    console.log("lines:", lines);
  });

  img = loadImage("data/bibi.png");
}

function setup() {
  console.log("setup");
  setListeners();
  createCanvas(size.x, size.y);
  background(0);
  image(img, 0, 0, size.x, size.y);
  background(0, 0, 0, 200);
}

let f = 0;

function draw() {
  background(0);
  console.log("Draw");
  for (let log_line of lines) {
    log_line.showIntersection(mouseX, mouseY);
    log_line.display();
  }
  noStroke();
  fill(255);
  let fps = frameRate();
  text(round(fps, 2), 50, 20);
  fill(255, 255, 255, 200);
  circle(mouseX, mouseY, 10);
}
function mouseDragged() {
  //   console.log("click");
  //   fill(255, 255, 255, 200);
  //   circle(mouseX, mouseY, 10);
}

function setListeners() {
  window.addEventListener("resize", () => {
    size.x = window.innerWidth;
    size.y = window.innerWidth;
  });
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
  display() {
    stroke(this.color);
    if (this.points.length > 1) {
      for (let i = 0; i < this.points.length - 1; i++) {
        line(
          this.points[i].x * size.x,
          this.points[i].y * size.y,
          this.points[i + 1].x * size.x,
          this.points[i + 1].y * size.y
        );
      }
    }
  }

  showIntersection(_mouse_x, _mouse_y) {
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
        stroke(this.color);
        fill(this.color);
        circle(distance_info.intersection.x, distance_info.intersection.y, 100);
        fill(255);
        noStroke();
        text("touching : " + String(this.id), 50, 100);
        text("points_num : " + String(this.points.length), 50, 120);
      }
    }
  }

  getPoints = () => {
    console.log("point is");
    return this.points;
  };
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
