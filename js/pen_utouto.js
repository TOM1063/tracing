import init, { LogLine } from "../pkg/wasm_logline.js";

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

init().then(() => {
  new p5(sketch);
});

function preload(p) {
  p.table = p.loadTable("./data/lines_utouto.csv", "csv", "header", () => {
    loaded_lines = getLinesFromTable(p.table);
    console.log("loaded_lines:", loaded_lines);
  });

  img = p.loadImage("data/utouto.png");
}

function setup(p) {
  p.blendMode(p.ADD);
  console.log("setup");
  p.createCanvas(size.x, size.y);
  p.background(255);
  stroke_size = 1;

  bold_button = p.createButton("thick");
  bold_button.position(50, 100);
  bold_button.mousePressed(setBold);

  mid_button = p.createButton("mid");
  mid_button.position(100, 100);
  mid_button.mousePressed(setMid);

  thin_button = p.createButton("thin");
  thin_button.position(150, 100);
  thin_button.mousePressed(setThin);

  player_graph = p.createGraphics(size.x, size.y);
  player_graph.clear();

  player_log = p.createGraphics(size.x, size.y);
  player_log.clear();

  loaded_graph = p.createGraphics(size.x, size.y);
  loaded_graph.clear();
  loaded_graph.image(img, 0, 0, size.x, size.y);
  loaded_graph.background(0, 0, 0, 100);

  // p.image(loaded_graph, 0, 0);
  for (let log_line of loaded_lines) {
    const color = log_line.get_color();
    loaded_graph.stroke(color.r(), color.g(), color.b());
    // log_line.showIntersection(p.mouseX, p.mouseY);
    for (let i = 0; i < log_line.points_length() - 1; i++) {
      const point1 = log_line.get_point(i);
      const point2 = log_line.get_point(i + 1);
      // loaded_graph.stroke(255, 100);
      loaded_graph.strokeWeight(1);
      loaded_graph.line(
        point1.x() * size.x,
        point1.y() * size.y,
        point2.x() * size.x,
        point2.y() * size.y
      );
    }
  }
}

function draw(p) {
  p.background(0);
  p.image(loaded_graph, 0, 0);
  p.image(player_log, 0, 0);
  p.noStroke();
  p.fill(255);
  let fps = p.frameRate();
  p.text("FPS : " + String(p.round(fps, 2)), 50, 20);
  p.fill(0);
}

function mouseDragged(p) {
  player_logs(f, p);

  for (let log_line of loaded_lines) {
    if (log_line.is_intersection(p.mouseX, p.mouseY, size.x, size.y)) {
      loaded_graph.noStroke();
      let color = log_line.get_color();
      loaded_graph.fill(
        p.red(color.r()),
        p.green(color.g()),
        p.blue(color.b()),
        10
      );
      for (let j = 0; j < 7; j += 1) {
        p.fill(255);
        p.circle(p.mouseX, p.mouseY, 100);
        loaded_graph.circle(p.mouseX, p.mouseY, j * j);
      }
    }
  }
  // player_graphics(p);
}

function mouseReleased(p) {
  prev_point = null;
  prev_logline = false;
}

function touchEnded(p) {
  prev_point = null;
  prev_logline = false;
}

function player_graphics(p) {
  player_graph.fill(255);
  player_graph.stroke(0);
  circle_pen(p.mouseX, p.mouseY, stroke_size, player_graph);

  if (prev_point) {
    let dist_from_prev = p.int(
      p.dist(prev_point.x, prev_point.y, p.mouseX, p.mouseY)
    );
    let factor = (dist_from_prev / stroke_size) * 100;

    for (let i = 0; i < factor; i++) {
      let div_x = (prev_point.x * (factor - i) + p.mouseX * i) / factor;
      let div_y = (prev_point.y * (factor - i) + p.mouseX * i) / factor;
      circle_pen(div_x, div_y, stroke_size, player_graph);
    }
    prev_point.x = p.mouseX;
    prev_point.y = p.mouseY;
  } else {
    prev_point = new p5.Vector(p.mouseX, p.mouseY);
  }
}

function player_logs(f, p) {
  if (prev_logline) {
    prev_logline.add_point(p.mouseX, p.mouseY, f);
  } else {
    player_log.textSize(10);
    player_log.noStroke();
    player_log.fill(255);
    player_log.text(current_id, p.mouseX + 10, p.mouseY + 10);
    prev_logline = new LogLine(current_id);
    prev_logline.add_point(p.mouseX, p.mouseY, f);
    current_id++;
  }
  if (prev_point) {
    let dist_from_prev = p.int(
      p.dist(prev_point.x, prev_point.y, p.mouseX, p.mouseY)
    );
    player_log.stroke(255, 255, 255, 200 / Math.sqrt(dist_from_prev));
    player_log.strokeWeight(
      (1 + 3 / Math.sqrt(dist_from_prev + 5)) * stroke_size
    );
    player_log.noFill();
    player_log.line(prev_point.x, prev_point.y, p.mouseX, p.mouseY);
  }
  prev_point = new p5.Vector(p.mouseX, p.mouseY);
  p.image(player_log, 0, 0);
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
function getLinesFromTable(_table) {
  console.log("row counts :", _table.getRowCount());
  let prev_id = 0;
  let lines = [];
  for (let i = 0; i < _table.getRowCount(); i++) {
    let frame = i;
    let id = _table.getString(i, 0);
    let u = _table.getString(i, 1);
    let v = 1 - _table.getString(i, 2);
    let width = _table.getString(i, 3);
    let height = _table.getString(i, 4);

    if (id != prev_id) {
      if (id == "") {
        continue;
      } else {
        let new_line = new LogLine(id);
        new_line.add_point(u, v, i);
        lines.push(new_line);
        prev_id = id;
      }
    } else {
      console.log("same");
      lines[lines.length - 1].add_point(u, v, i);
    }
    console.log("");
  }
  return lines;
}

const sketch = (p) => {
  p.preload = () => preload(p);
  p.setup = () => setup(p);
  p.draw = () => draw(p);
  p.mouseDragged = () => mouseDragged(p);
  p.mouseReleased = () => mouseReleased(p);
  p.touchEnded = () => touchEnded(p);
};
