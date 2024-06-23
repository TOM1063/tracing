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
  stroke(255, 30);
  noFill();
  ellipse(mouseX, mouseY, 100, 100);
  console.log("draw");
  for (let log_line of lines) {
    let prev_point = null;
    for (log_point of log_line.points) {
      if ((f - 10 < log_point.f) & (log_point.f < f)) {
        if (prev_point) {
          console.log("point:", log_point.x, log_point.y);
          stroke(255, 0, 0);
          line(
            prev_point.x * size.x,
            prev_point.y * size.y,
            log_point.x * size.x,
            log_point.y * size.y
          );
        } else {
          console.log("newLine");
          noStroke();
          fill(255, 255, 255, 10);
          textSize(10);
          text(
            String(log_line.id),
            log_line.points[0].x * size.x,
            log_line.points[0].y * size.y
          );
        }
        prev_point = log_point;
      }
    }
  }
  f += 4;
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
