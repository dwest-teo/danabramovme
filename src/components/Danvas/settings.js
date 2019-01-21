import OLD_DAN from '../../images/old-dan.jpg';
import NEW_DAN from '../../images/new-dan.jpg';

const imgState = {};
imgState[OLD_DAN] = { x: 0.09903, y: 0.08914, s: 0.48782, ry: -0.04926 };
imgState[NEW_DAN] = { x: 0.04351, y: 0.05059, s: 0.6098, ry: 0.06192 };

export const IMG_STATE = imgState;

export default {
  // initial art painting
  artPainting: OLD_DAN,

  // detect state in the initial art painting to avoid search step
  detectState: imgState[OLD_DAN],

  // number of positive detections to perfectly locate the face in the art painting
  nDetectsArtPainting: 25,

  detectArtPaintingThreshold: 0.6,

  artPaintingMaskScale: [1.3, 1.5],

  // relative. 1-> 100% scale mask width of the image (or height)
  artPaintingMaskOffset: [0.015, 0.15],

  // crop smooth edge
  artPaintingCropSmoothEdge: 0.25,

  // forhead start when Y>this value. Max: 1
  artPaintingHeadForheadY: 0.65,

  // lower jaw start when Y<this value. Max: 1
  artPaintingHeadJawY: 0.4,

  // user crop face and detection settings :
  videoDetectSizePx: 1024,
  faceRenderSizePx: 256,

  // 1-> exactly the same zoom than for the art painting
  zoomFactor: 1.03,

  // sensibility, between 0 and 1. Less -> more sensitive
  detectionThreshold: 0.65,

  detectionHysteresis: 0.03,

  // mixed settings - should be PoT
  hueTextureSizePx: 4,

  // debug flags - should be set to false for standard running :
  debugArtpaintingCrop: false,
};
