import init, { LogLine } from "../pkg/wasm_logline.js";

let size = {
  x: window.innerWidth,
  y: window.innerHeight,
};

let f = 0;

let loaded_lines;

let loaded_layer;

let ui_layer;

let user_layer;

let img;

let stroke_size = 2;

let current_id = 0;
let current_loaded_point;
let prev_point;
let prev_logline;
let user_lines = [];

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
  p.table = p.loadTable("./data/lines.csv", "csv", "header", () => {
    loaded_lines = getLinesFromTable(p.table);
    console.log("loaded_lines:", loaded_lines);
  });

  img = p.loadImage("data/bibi.png");
}

function setup(p) {
  p.blendMode(p.ADD);
  p.createCanvas(size.x, size.y);
  p.frameRate(30);
  loaded_layer = p.createGraphics(size.x, size.y);
  loaded_layer.clear();
  loaded_layer.image(img, 0, 0, size.x, size.y);
  loaded_layer.background(0);

  user_layer = p.createGraphics(size.x, size.y);
  user_layer.clear();

  slider = p.createSlider(0, 10, 8, 0.1);
  slider.position(50, 80);
  slider.size(200);
}

function draw(p) {
  draw_loaded(p);
  p.image(user_layer, 0, 0);
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
      let fract = (f / speed) % points_length;
      // fract = points_length * ((((f * 4) / speed) % 100) / 100);
      for (let i = 0; i < fract - 1; i++) {
        const point1 = line.get_point(i);
        const point2 = line.get_point(i + 1);

        current_loaded_point = point2;
        for (let user_line of user_lines) {
          if (
            user_line.is_intersection(
              point2.x() * size.x,
              point2.y() * size.y,
              size.x,
              size.y
            )
          ) {
            console.log("hit");
            loaded_layer.noStroke();
            loaded_layer.fill(255, 200, 10, 100);
            loaded_layer.circle(point2.x() * size.x, point2.y() * size.y, 30);
          }
        }
        //   loaded_layer.stroke(200 * (i / fract + 0.1), 10);
        //   loaded_layer.strokeWeight(4);
        //   loaded_layer.noFill();
        //   loaded_layer.line(
        //     point1.x() * size.x,
        //     point1.y() * size.y,
        //     point2.x() * size.x,
        //     point2.y() * size.y
        //   );
        loaded_layer.stroke(200 * (i / fract + 0.1), 200);
        loaded_layer.strokeWeight(2);
        loaded_layer.line(
          point1.x() * size.x,
          point1.y() * size.y,
          point2.x() * size.x,
          point2.y() * size.y
        );
        // loaded_layer.stroke(200 * (i / fract + 0.1), 10);
        // loaded_layer.strokeWeight(10);
        // loaded_layer.line(
        //   point1.x() * size.x,
        //   point1.y() * size.y,
        //   point2.x() * size.x,
        //   point2.y() * size.y
        // );
      }
    }
  }
  f++;
  p.image(loaded_layer, 0, 0);
}

function mouseDragged(p) {
  //   player_graphics(p);
  player_logs(f, p);
}

// function player_graphics(p) {
//   user_layer.fill(255);
//   user_layer.stroke(255);
//   circle_pen(p.mouseX, p.mouseY, stroke_size, user_layer);

//   if (prev_point) {
//     let dist_from_prev = p.int(
//       p.dist(prev_point.x, prev_point.y, p.mouseX, p.mouseY)
//     );
//     let factor = (dist_from_prev / stroke_size) * 10;

//     for (let i = 0; i < factor; i++) {
//       let div_x = (prev_point.x * (factor - i) + p.mouseX * i) / factor;
//       let div_y = (prev_point.y * (factor - i) + p.mouseY * i) / factor;
//       circle_pen(div_x, div_y, stroke_size, user_layer);
//     }
//     prev_point.x = p.mouseX;
//     prev_point.y = p.mouseY;
//   } else {
//     prev_point = new p5.Vector(p.mouseX, p.mouseY);
//   }
// }

function player_logs(f, p) {
  if (prev_logline) {
    prev_logline.add_point(p.mouseX / size.x, p.mouseY / size.y, f);
  } else {
    user_layer.textSize(10);
    user_layer.noStroke();
    user_layer.fill(255);
    user_layer.text(current_id, p.mouseX + 10, p.mouseY + 10);
    prev_logline = new LogLine(current_id);
    prev_logline.add_point(p.mouseX / size.x, p.mouseY / size.y, f);
    current_id++;
  }
  if (prev_point) {
    let dist_from_prev = p.int(
      p.dist(prev_point.x, prev_point.y, p.mouseX, p.mouseY)
    );
    user_layer.stroke(255, 200, 10, 100 + 200 / Math.sqrt(dist_from_prev));
    user_layer.strokeWeight(
      (1 + 3 / Math.sqrt(dist_from_prev + 5)) * stroke_size
    );
    user_layer.noFill();
    user_layer.line(prev_point.x, prev_point.y, p.mouseX, p.mouseY);
  }
  prev_point = new p5.Vector(p.mouseX, p.mouseY);
}

function mouseReleased(p) {
  prev_point = null;
  user_lines.push(prev_logline);
  prev_logline = false;
}

function touchEnded(p) {
  prev_point = null;
  prev_logline = false;
}

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

function circle_pen(_x, _y, _stroke, _graphic) {
  _graphic.fill(255);
  _graphic.stroke(200, 100);
  _graphic.circle(_x, _y, _stroke);
  _graphic.stroke(200, 10);
  _graphic.circle(_x, _y, _stroke);
}
