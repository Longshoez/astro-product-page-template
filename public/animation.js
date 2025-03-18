const canvas = document.getElementById("model-image");
if (!canvas) {
  console.error("not found, load static image instead");
}
const ctx = canvas?.getContext("2d");

const frameCount = 70;
const frames = [];
let currentFrame = 1;

function resizeCanvas() {
  if (canvas) {
    const img = new Image();
    img.src = "/frames/0001.png";
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
  }
}

function preloadFrames() {
  for (let i = 1; i < frameCount; i++) {
    const img = new Image();
    const frameNumber = String(i).padStart(4, "0");
    alert(frameNumber);
    img.src = `/frames/${frameNumber}.png`;
    img.onerror = () => console.error(`Failed to load frame ${frameNumber}`);
    frames.push(img);
  }
}

//delay 1/5 fifths
let frameDelay = 5;
let frameDelayCounter = 0;

function drawFrame() {
  if (!ctx || frames.length === 0) return;

  const img = frames[currentFrame];

  if (!img || img.naturalWidth === 0) {
    console.warn(`frame corrupted ${currentFrame + 1}`);
    currentFrame++;
    if (currentFrame < frames.length) {
      requestAnimationFrame(drawFrame);
    }
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const aspectRatio = img.width / img.height;
  let drawWidth = canvas.width;
  let drawHeight = canvas.width / aspectRatio;

  if (drawHeight > canvas.height) {
    drawHeight = canvas.height;
    drawWidth = canvas.height * aspectRatio;
  }

  const xOffset = (canvas.width - drawWidth) / 2;
  const yOffset = (canvas.height - drawHeight) / 2;

  ctx.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);

  // slow down animation
  frameDelayCounter++;
  if (frameDelayCounter >= frameDelay) {
    frameDelayCounter = 0;
    currentFrame++;
  }

  if (currentFrame < frames.length) {
    requestAnimationFrame(drawFrame);
  } else {
    //finished animation
  }
}

window.onload = () => {
  resizeCanvas();
  preloadFrames();

  setTimeout(() => {
    console.log("▶️ Starting animation...");
    drawFrame();
    //delay to allow images to change might change for other method
  }, 500);
};

window.onresize = resizeCanvas;
