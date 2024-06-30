import init, { LogLine } from "../pkg/wasm_logline.js";

let size = {
  x: window.innerWidth,
  y: window.innerHeight,
};

let f = 0;

let loaded_lines;

let loaded_layer;

let ui_layer;

let img;

//---------ui
let slider;

init().then(() => {
  new p5(sketch);
});

const sketch = (p) => {
  p.preload = () => preload(p);
  p.setup = () => setup(p);
  p.draw = () => draw(p);
  p.mouseDragged = () => mouseDragged(p);
  p.mouseReleased = () => mouseReleased(p);
  p.touchEnded = () => touchEnded(p);
};

function preload(p) {
  p.table = p.loadTable("./data/lines_utouto.csv", "csv", "header", () => {
    loaded_lines = getLinesFromTable(p.table);
    console.log("loaded_lines:", loaded_lines);
  });

  img = p.loadImage("data/utouto.png");
}

function setup(p) {
  p.blendMode(p.ADD);
  p.createCanvas(size.x, size.y);
  loaded_layer = p.createGraphics(size.x, size.y);
  loaded_layer.clear();
  loaded_layer.image(img, 0, 0, size.x, size.y);

  slider = p.createSlider(0, 10, 8, 0.1);
  slider.position(50, 80);
  slider.size(200);
}

function draw(p) {
  draw_loaded(p);
  p.noStroke();
  p.fill(255);
  let fps = p.frameRate();
  p.text("FPS : " + String(p.round(fps, 2)), 50, 50);
}
function draw_loaded(p) {
  let speed = 10 - slider.value();
  loaded_layer.background(0);
  for (let line of loaded_lines) {
    let points_length = line.points_length();
    if (points_length > 5) {
      let fract = Math.floor(f / speed) % points_length;
      console.log(fract);
      if (f == 0) {
        loaded_layer.clear();
      }
      for (let i = 0; i < fract - 1; i++) {
        const point1 = line.get_point(i);
        const point2 = line.get_point(i + 1);
        loaded_layer.stroke(200 * (i / fract + 0.1));
        loaded_layer.strokeWeight(3);
        loaded_layer.fill(0);
        loaded_layer.line(
          point1.x() * size.x,
          point1.y() * size.y,
          point2.x() * size.x,
          point2.y() * size.y
        );
      }
    }
  }

  f++;
  p.image(loaded_layer, 0, 0);
}

function mouseDragged(p) {}

function mouseReleased(p) {}
function touchEnd(p) {}

function getLinesFromTable(_table) {
  console.log("row counts :", _table.getRowCount());
  let prev_id = 0;
  let lines = [];
  let fract = 0;
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
        fract = 0;
        let new_line = new LogLine(id);
        new_line.add_point(u, v, fract);
        lines.push(new_line);
        prev_id = id;
      }
    } else {
      console.log("same");
      lines[lines.length - 1].add_point(u, v, f);
    }
    fract++;
    console.log("");
  }
  return lines;
}
