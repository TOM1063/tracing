const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = canvasElement.getContext("2d");

let handLandmarks = [];

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

console.log("p5");

const sketch = (p) => {
  p.setup = () => setup(p);
  p.draw = () => draw(p);
};

//----------------------------------------------------
new p5(sketch);

let video;

let size = {
  x: window.innerWidth,
  y: window.innerHeight,
};

function setup(p) {
  p.createCanvas(size.x, size.y);
  //   video = createCapture(VIDEO);
  //   video.size(1280, 720);
  //   video.hide();
  console.log("setup");
}

function draw(p) {
  console.log("draw");
  p.background(220, 100);
  //   p.image(video, 0, 0);

  // Mediapipeで取得した手のランドマークをp5.jsで描画
  if (handLandmarks.length > 0) {
    for (let i = 0; i < handLandmarks.length; i++) {
      const landmarks = handLandmarks[i];
      const landmark = landmarks[8];
      const x = (1 - landmark.x) * size.x;
      const y = landmark.y * size.y;
      p.fill(255, 0, 0);
      p.noStroke();
      p.ellipse(x, y, 10, 10);
      p.noFill();
      p.stroke(255, 0, 0);
      p.ellipse(x, y, 100, 100);
    }
  }
}

//----------------------------------------------------
