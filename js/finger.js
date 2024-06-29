const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = canvasElement.getContext("2d");

let handLandmarks = [];
let classifications = [];

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  if (results.multiHandLandmarks) {
    handLandmarks = results.multiHandLandmarks;
    classifications = results.multiHandedness;
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 5,
      });
      drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
    }
  } else {
    handLandmarks = [];
  }
  canvasCtx.restore();
}

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 1280,
  height: 720,
});
camera.start();

//----------------------------------------------------
console.log("p5");

import init, { LogLine } from "../pkg/wasm_logline.js";

init().then(() => {
  new p5(sketch);
});

const sketch = (p) => {
  p.setup = () => setup(p);
  p.draw = () => draw(p);
};

//----------------------------------------------------

let video;

let log_layer;
let user_layer;

let f = 0;
let fps = 0;

let size = {
  x: window.innerWidth,
  y: window.innerHeight,
};

let user_lines = [];

let left_line = null;
let right_line = null;

function setup(p) {
  p.createCanvas(size.x, size.y);
  //   video = createCapture(VIDEO);
  //   video.size(1280, 720);
  //   video.hide();
  log_layer = p.createGraphics(size.x, size.y);
  log_layer.clear();

  user_layer = p.createGraphics(size.x, size.y);
  user_layer.clear();

  console.log("setup");
}

function draw(p) {
  function draw_log() {
    p.background(220, 100);
    log_layer.clear();
    log_layer.noStroke();
    log_layer.fill(0, 100);
    if (f % 5 == 0) {
      fps = p.frameRate();
    }
    log_layer.text("FPS : " + String(p.round(fps, 0)), 50, 50);
    log_layer.text("hands_num : " + String(handLandmarks.length), 50, 80);
    p.image(log_layer, 0, 0);
  }
  // Mediapipeで取得した手のランドマークをp5.jsで描画
  function draw_user() {
    user_layer.clear();
    if (handLandmarks.length > 0) {
      for (let i = 0; i < handLandmarks.length; i++) {
        const isLeft = classifications[i].label === "Right";
        const landmarks = handLandmarks[i];
        const landmark = landmarks[8];
        const x = (1 - landmark.x) * size.x;
        const y = landmark.y * size.y;
        user_layer.textSize(30);
        if (isLeft) {
          if (left_line) {
            left_line.add_point(x, y, f);
          } else {
            left_line = new LogLine(f);
            left_line.add_point(x, y, f);
          }
          user_layer.noFill();
          user_layer.stroke(255, 100, 0);
          user_layer.text("left", x + 10, y + 10);
          user_layer.ellipse(x, y, 100, 100);
          user_layer.fill(255, 100, 0);
          user_layer.ellipse(x, y, 10, 10);
        } else {
          if (right_line) {
            right_line.add_point(x, y, f);
          } else {
            right_line = new LogLine(f);
            right_line.add_point(x, y, f);
          }
          user_layer.noFill();
          user_layer.stroke(0);
          user_layer.text("right", x + 10, y + 10);
          user_layer.ellipse(x, y, 100, 100);
          user_layer.fill(0);
          user_layer.ellipse(x, y, 10, 10);
        }
      }

      if (left_line) {
        for (let i = 0; i < left_line.points_length() - 1; i++) {
          const point1 = left_line.get_point(i);
          const point2 = left_line.get_point(i + 1);
          user_layer.noFill();
          user_layer.stroke(255, 100, 0);
          user_layer.line(point1.x(), point1.y(), point2.x(), point2.y());
        }
      }
      if (right_line) {
        for (let i = 0; i < right_line.points_length() - 1; i++) {
          const point1 = right_line.get_point(i);
          const point2 = right_line.get_point(i + 1);
          user_layer.noFill();
          user_layer.stroke(0);
          user_layer.line(point1.x(), point1.y(), point2.x(), point2.y());
        }
      }
    }
    p.image(user_layer, 0, 0);
  }

  draw_log();
  draw_user();
  //   p.image(video, 0, 0);
  f++;
}

//----------------------------------------------------

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
