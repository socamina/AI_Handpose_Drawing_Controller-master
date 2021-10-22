let newWidth = 0;
let newHeight = 0;
let ratio = 1;
let handpose = null;
let predictions = [];
let canvas2;

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

  /**
   * Si ton image est toujours SQUEEZED, essaie de rallonger le temps du timeout --> 2000 == 2 sec
   */

  // ml5
  handpose = ml5.handpose(video, modelLoaded.bind(this));

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", (results) => {
    console.log(results);
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

  image(video, 0, 0, newWidth, newHeight);
  // background(255,0,0,30);
  const prediction = predictions[0];
  //si on a des prediction on met à jour les positions des points
  if (prediction) {
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      //on dessine les points, en n'oubliant pas qu'on a aggrandit l'affichage.
      circle(keypoint[0] * ratio, keypoint[1] * ratio, 10);
    }}

  if (predictions.length > 0) {
    let hand = predictions[0];
    let thumb = hand.annotations.thumb;
    let index = hand.annotations.indexFinger;
    let middleFinger = hand.annotations.middleFinger;
    let ringFinger = hand.annotations.ringFinger;
    let pinky = hand.annotations.pinky;

    let thumbTip = thumb[3];
    let indexTip = index[3];
    let middleFingerTip = middleFinger[3];
    let ringFingerTip = ringFinger[3];
    let pinkyTip = pinky[3];

    push();
    canvas2.noStroke();
    canvas2.fill(255, 0, 0, 200);
    canvas2.ellipse(thumbTip[0] * ratio, thumbTip[1] * ratio, 50, 50);
    pop();

    push();
    canvas2.noStroke();
    canvas2.fill(255, 153, 0, 200);
    canvas2.ellipse(indexTip[0] * ratio, indexTip[1] * ratio, 50, 50);
    pop();

    push();
    canvas2.noStroke();
    canvas2.fill(255, 251, 0, 200);
    canvas2.ellipse(
      middleFingerTip[0] * ratio,
      middleFingerTip[1] * ratio,
      50,
      50
    );
    pop();

    push();
    canvas2.noStroke();
    canvas2.fill(60, 255, 0, 200);
    canvas2.ellipse(ringFingerTip[0] * ratio, ringFingerTip[1] * ratio, 50, 50);
    pop();

    push();
    canvas2.noStroke();
    canvas2.fill(0, 255, 250, 200);
    canvas2.ellipse(pinkyTip[0] * ratio, pinkyTip[1] * ratio, 50, 50);
    pop();
    // push();
    // stroke(255,0,0);
    // strokeWeight(3);
    // line(thumbTip[0], thumbTip[1],indexTip[0], indexTip[1]);
    // pop();
  }
  image(canvas2, 0, 0);
}

function modelLoaded() {
  handpose.on("predict", (results) => {
    predictions = results;
  });
}
