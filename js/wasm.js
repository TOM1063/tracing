// import init, { add } from "../pkg/p5.js";

// init().then(() => {
//   console.log(add(1, 3));
// });

import("../pkg/p5.js").then(({ default: init, add }) => {
  init().then(() => {
    console.log(add(1, 3));
  });
});

// void setup() {

// }

// void draw() {

// }
