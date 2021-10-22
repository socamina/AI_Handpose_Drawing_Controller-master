let newWidth = 0;
let newHeight = 0;
let ratio = 1;
let handpose = null;
let predictions = [];
let canvas2;
let oldDistance = 0;

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowWidth);
  canvas2 = createGraphics(windowWidth, windowWidth);

  noStroke();
  video = createCapture(VIDEO);

  setTimeout(() => {
    console.log(video.width, video.height); // 640->480
    // Avec les vraies dimensions de la video on peut faire les calculs de redimensionnement
    // On obtiendra un ratio à appliquer à nos points de posehand, car ils sont calculés sur la video non resizée
    newWidth = windowWidth;
    ratio = newWidth / video.width;
    newHeight = video.height * ratio;
  }, 2000);

  // ml5
  handpose = ml5.handpose(video, modelLoaded.bind(this));

  handpose.on("predict", (results) => {
    //  console.log(results);
    predictions = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  translate(width, 0);
  scale(-1, 1);

  //image(video, width/2, height/2, newWidth *d, newHeight*d);

  // const prediction = predictions[0];
  // if (prediction) {
  //   for (let j = 0; j < prediction.landmarks.length; j += 1) {
  //     const keypoint = prediction.landmarks[j];
  //     //on dessine les points, en n'oubliant pas qu'on a aggrandit l'affichage.
  //     circle(keypoint[0] * ratio, keypoint[1] * ratio, 10);
  //   }}

  if (predictions.length > 0) {
    let hand = predictions[0];
    let thumb = hand.annotations.thumb;
    let index = hand.annotations.indexFinger;

    let thumbTip = thumb[3];
    let indexTip = index[3];

    let distance = dist(
      thumbTip[0] * ratio,
      thumbTip[1] * ratio,
      indexTip[0] * ratio,
      indexTip[1] * ratio
    );
    distance = map(distance, 0, 520, 1, 2.4);
    console.log(distance);

    translate(width / 2, height / 2);
    imageMode(CENTER);
    //To prevent jumping of the scale we use lerp, which interpolates between the current and the previous value
    let lerpedistance = lerp(distance, oldDistance, 0.5);
    scale(lerpedistance);
    background(255);
    image(video, 0, 0, width, height);
    oldDistance = distance;
  }
}

function modelLoaded() {
  handpose.on("predict", (results) => {
    predictions = results;
  });
}
