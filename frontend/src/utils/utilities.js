import * as posenet from "@tensorflow-models/posenet";
import * as tf from "@tensorflow/tfjs";

// Configurable colors and sizes
const POINT_COLOR = "aqua";
const BOUNDING_BOX_COLOR = "red";
const LINE_WIDTH = 2;

export const tryResNetButtonName = "tryResNetButton";
export const tryResNetButtonText = "[New] Try ResNet50";
const tryResNetButtonTextCss = "width:100%;text-decoration:underline;";
const tryResNetButtonBackgroundCss = "background:#e61d5f;";

// Device checks
function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isMobile() {
  return isAndroid() || isiOS();
}

// Style helper for dat.GUI
function setDatGuiPropertyCss(propertyText, liCssString, spanCssString = "") {
  const spans = document.getElementsByClassName("property-name");
  for (let i = 0; i < spans.length; i++) {
    const text = spans[i].textContent || spans[i].innerText;
    if (text === propertyText) {
      spans[i].parentNode.parentNode.style = liCssString;
      if (spanCssString !== "") {
        spans[i].style = spanCssString;
      }
    }
  }
}

export function updateTryResNetButtonDatGuiCss() {
  setDatGuiPropertyCss(
    tryResNetButtonText,
    tryResNetButtonBackgroundCss,
    tryResNetButtonTextCss
  );
}

// Loading toggle UI
export function toggleLoadingUI(
  showLoadingUI,
  loadingDivId = "loading",
  mainDivId = "main"
) {
  const loadingEl = document.getElementById(loadingDivId);
  const mainEl = document.getElementById(mainDivId);
  if (loadingEl && mainEl) {
    loadingEl.style.display = showLoadingUI ? "block" : "none";
    mainEl.style.display = showLoadingUI ? "none" : "block";
  }
}

// Drawing helpers
function toTuple({ y, x }) {
  return [y, x];
}

export function drawPoint(ctx, y, x, r, color) {
  if (!ctx) return;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
  if (!ctx) return;
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = LINE_WIDTH;
  ctx.strokeStyle = color;
  ctx.stroke();
}

export function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(keypoints, minConfidence);
  adjacentKeyPoints.forEach(([kp1, kp2]) => {
    drawSegment(
      toTuple(kp1.position),
      toTuple(kp2.position),
      POINT_COLOR,
      scale,
      ctx
    );
  });
}

export function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  keypoints.forEach((keypoint) => {
    if (keypoint.score >= minConfidence) {
      const { y, x } = keypoint.position;
      drawPoint(ctx, y * scale, x * scale, 3, POINT_COLOR);
    }
  });
}

export function drawBoundingBox(keypoints, ctx) {
  if (!ctx) return;
  const boundingBox = posenet.getBoundingBox(keypoints);
  ctx.beginPath();
  ctx.rect(
    boundingBox.minX,
    boundingBox.minY,
    boundingBox.maxX - boundingBox.minX,
    boundingBox.maxY - boundingBox.minY
  );
  ctx.strokeStyle = BOUNDING_BOX_COLOR;
  ctx.stroke();
}

export async function renderToCanvas(a, ctx) {
  const [height, width] = a.shape;
  const imageData = new ImageData(width, height);
  const data = await a.data();

  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    const k = i * 3;
    imageData.data[j + 0] = data[k + 0];
    imageData.data[j + 1] = data[k + 1];
    imageData.data[j + 2] = data[k + 2];
    imageData.data[j + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

export function renderImageToCanvas(image, size, canvas) {
  if (!canvas || !image) return;
  canvas.width = size[0];
  canvas.height = size[1];
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(image, 0, 0);
  }
}

export async function drawHeatMapValues(heatMapValues, outputStride, canvas) {
  const ctx = canvas.getContext("2d");
  const radius = 5;
  const scaledValues = heatMapValues.mul(tf.scalar(outputStride, "int32"));

  await drawPoints(ctx, scaledValues, radius, POINT_COLOR);
}

async function drawPoints(ctx, pointsTensor, radius, color) {
  if (!ctx) return;
  const points = await pointsTensor.array();

  for (let i = 0; i < points.length; i++) {
    const [y, x] = points[i];
    if (x !== 0 && y !== 0) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }
}

// If you want to enable drawing offset vectors, we can add it back with updates.
