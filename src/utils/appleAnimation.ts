export function initializeAnimation(canvas: HTMLCanvasElement) {
  if (!canvas) {
    console.error("Canvas not found, load static image instead");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Could not get 2D context for canvas");
    return;
  }

  const frameCount = 71;
  const frames: HTMLImageElement[] = [];
  let currentFrame = 1;

  function resizeCanvas() {
    const img = new Image();
    img.src = "/frames/0010.png";
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    };
  }

  function preloadFrames() {
    //           1
    for (let i = 1; i < frameCount; i++) {
      const img = new Image();
      const frameNumber = String(i).padStart(4, "0");
      img.src = `/frames/${frameNumber}.png`;
      img.onerror = () => console.error(`Failed to load frame ${frameNumber}`);
      frames.push(img);
    }
  }

  // Delay
  let frameDelay = 5;
  let frameDelayCounter = 0;

  function drawFrame() {
    if (frames.length === 0) return;

    const img = frames[currentFrame];

    if (!img || img.naturalWidth === 0) {
      console.warn(`Frame corrupted ${currentFrame + 1}`);
      currentFrame++;
      if (currentFrame < frames.length) {
        requestAnimationFrame(drawFrame);
      }
      return;
    }

    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    const aspectRatio = img.width / img.height;
    let drawWidth = canvas.width;
    let drawHeight = canvas.width / aspectRatio;

    if (drawHeight > canvas.height) {
      drawHeight = canvas.height;
      drawWidth = canvas.height * aspectRatio;
    }

    const xOffset = (canvas.width - drawWidth) / 2;
    const yOffset = (canvas.height - drawHeight) / 2;

    ctx?.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);

    // Slow down animation
    frameDelayCounter++;
    if (frameDelayCounter >= frameDelay) {
      frameDelayCounter = 0;
      currentFrame++;
    }

    if (currentFrame < frames.length) {
      requestAnimationFrame(drawFrame);
    } else {
      // Finished animation
    }
  }

  // Initialize animation
  resizeCanvas();
  preloadFrames();

  setTimeout(() => {
    console.log("▶️ Starting animation...");
    drawFrame();
  }, 500);

  // Handle window resize
  window.addEventListener("resize", resizeCanvas);
}

