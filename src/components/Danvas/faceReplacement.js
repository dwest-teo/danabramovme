import faceFilter from './lib/jeelizFaceFilterES6';
import NNC from './lib/NNC.json';

import SETTINGS from './settings';

import COPY_VS from './shaders/copy.vs';
import COPY_FS from './shaders/copy.fs';
import SEARCH_FS from './shaders/search.fs';
import FINAL_FS from './shaders/final.fs';

const ARTPAINTING = {
  baseTexture: false,
  potFaceCutTexture: null,
  potFaceCutTextureSizePx: 0,
  hueTexture: null,
  detectCounter: 0,
  image: new Image(),
  canvasMask: false,
  url: -1,
  positionFace: [0, 0],
  scaleFace: [1, 1],
  detectedState: false,
};

const USERCROP = {
  faceCutDims: [0, 0],
  potFaceCutTexture: null,
  hueTexture: null,
};

const SHPS = {
  // shaderprograms
  cropUserFace: null,
  copy: null,
};

let DOMARTPAINTINGCONTAINER;
let GL;
let GLDRAWTARGET;
let FBO;

let NLOADEDS = 0;
let FFSPECS;

const STATES = {
  // possible states of the app. ENUM equivalent
  ERROR: -1,
  IDLE: 0,
  LOADING: 1,
  DETECTARTPAINTINGFACE: 2,
  DETECTUSERFACE: 3,
  BUSY: 4,
  ARTPAINTINGFACEDETECTPROVIDED: 5,
};

let STATE = STATES.IDLE;
let ISUSERFACEDETECTED = false;

// entry point
export function main(canvas, container) {
  STATE = STATES.LOADING;

  // build_carousel();

  DOMARTPAINTINGCONTAINER = container;

  ARTPAINTING.image.src = SETTINGS.artPainting;
  ARTPAINTING.image.onload = check_isLoaded.bind(null, 'ARTPAINTING.image');

  faceFilter.init({
    canvasId: canvas.id,
    NNCpath: NNC,
    callbackReady: (errCode, spec) => {
      if (errCode) {
        console.log('AN ERROR HAPPENS. ERROR CODE =', errCode);
        STATE = STATES.ERROR;
        return;
      }
      FFSPECS = spec;
      GL = spec.GL;
      FBO = GL.createFramebuffer();
      GLDRAWTARGET = GL.DRAW_FRAMEBUFFER ? GL.DRAW_FRAMEBUFFER : GL.FRAMEBUFFER;

      console.log('INFO : faceFilter IS READY');
      check_isLoaded('faceFilter');
    }, // end callbackReady()

    // called at each render iteration (drawing loop)
    callbackTrack,
  }); // end faceFilter.init
}

function check_isLoaded(label) {
  console.log('INFO in check_isLoaded() : ', label, 'is loaded');
  if (++NLOADEDS === 2) {
    start();
  }
}

function start() {
  console.log('INFO : start()');

  create_textures();
  build_shps();

  // set the canvas to the artpainting size :
  update_artPainting(SETTINGS.detectState);
} // end start()

function update_artPainting(detectState) {
  // called both at start (start()) and when user change the art painting
  FFSPECS.canvasElement.width = ARTPAINTING.image.width;
  FFSPECS.canvasElement.height = ARTPAINTING.image.height;
  faceFilter.resize();

  // create or update the artpainting webgl texture :
  if (!ARTPAINTING.baseTexture) {
    ARTPAINTING.baseTexture = GL.createTexture();
  }
  GL.bindTexture(GL.TEXTURE_2D, ARTPAINTING.baseTexture);
  GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
  GL.texImage2D(
    GL.TEXTURE_2D,
    0,
    GL.RGBA,
    GL.RGBA,
    GL.UNSIGNED_BYTE,
    ARTPAINTING.image
  );
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

  faceFilter.set_inputTexture(
    ARTPAINTING.baseTexture,
    ARTPAINTING.image.width,
    ARTPAINTING.image.height
  );

  ARTPAINTING.detectCounter = 0;
  FFSPECS.canvasElement.classList.remove('canvasDetected');
  FFSPECS.canvasElement.classList.remove('canvasNotDetected');
  FFSPECS.canvasElement.classList.add('artPainting');

  FFSPECS.canvasElement.style.top = '';
  FFSPECS.canvasElement.style.left = '';
  FFSPECS.canvasElement.style.width = '';

  // toggle_carousel(true);

  if (detectState) {
    STATE = STATES.ARTPAINTINGFACEDETECTPROVIDED;
    ARTPAINTING.detectedState = detectState;
  } else {
    STATE = STATES.DETECTARTPAINTINGFACE;
  }
} // end update_artPainting()

// function build_carousel() {
//   $('#carousel').slick({
//     //see http://kenwheeler.github.io/slick/
//     speed: 300,
//     slidesToShow: 1,
//     centerMode: true,
//     variableWidth: true,
//     arrows: false,
//     swipeToSlide: true,
//     infinite: false,
//     focusOnSelect: true,
//   });
//   toggle_carousel(false);
// }

// function toggle_carousel(isEnabled) {
//   if (isEnabled) {
//     $('#carousel').css({
//       opacity: 1,
//       pointerEvents: 'auto',
//     });
//   } else {
//     $('#carousel').css({
//       opacity: 0.5,
//       pointerEvents: 'none',
//     });
//   }
// }

// called directly from the DOM controls to change the base image :
export function change_artPainting(urlImage, detectState) {
  if (
    urlImage === ARTPAINTING.url ||
    [STATES.DETECTARTPAINTINGFACE, STATES.DETECTUSERFACE].indexOf(STATE) === -1
  ) {
    return;
  }
  if (typeof detectState === 'undefined') {
    var detectState = false;
  }

  STATE = STATES.BUSY;
  // toggle_carousel(false);
  if (ARTPAINTING.canvasMask) {
    ARTPAINTING.canvasMask.parentElement.removeChild(ARTPAINTING.canvasMask);
    ARTPAINTING.canvasMask = false;
  }
  ARTPAINTING.image = new Image();

  if (urlImage === 'CUSTOM') {
    // upload custom image
    var domInputFile = document.getElementById('customImage');
    if (!domInputFile.files || !domInputFile.files[0]) {
      alert('You should select at least one file');
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      ARTPAINTING.url = 'CUSTOM' + Date.now();
      ARTPAINTING.image.src = e.target.result;
      ARTPAINTING.image.onload = update_artPainting.bind(null, detectState);
    };
    reader.readAsDataURL(domInputFile.files[0]);
  } else {
    ARTPAINTING.url = urlImage;
    ARTPAINTING.image.src = urlImage;
    ARTPAINTING.image.onload = update_artPainting.bind(null, detectState);
  }
} // end change_artPainting()

function create_textures() {
  var create_emptyTexture = function(w, h) {
    var tex = GL.createTexture();
    GL.bindTexture(GL.TEXTURE_2D, tex);
    GL.texImage2D(
      GL.TEXTURE_2D,
      0,
      GL.RGBA,
      w,
      h,
      0,
      GL.RGBA,
      GL.UNSIGNED_BYTE,
      null
    );
    return tex;
  };

  var create_emptyLinearTexture = function(w, h) {
    var tex = create_emptyTexture(w, h);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    return tex;
  };

  // create the artpainting and userCrop hue textures :
  var create_hueTexture = function() {
    return create_emptyLinearTexture(
      SETTINGS.hueTextureSizePx,
      SETTINGS.hueTextureSizePx
    );
  };
  ARTPAINTING.hueTexture = create_hueTexture();
  USERCROP.hueTexture = create_hueTexture();

  // create the userCrop textures
  var faceAspectRatio =
    SETTINGS.artPaintingMaskScale[1] / SETTINGS.artPaintingMaskScale[0];
  USERCROP.faceCutDims[0] = SETTINGS.faceRenderSizePx;
  USERCROP.faceCutDims[1] = Math.round(
    SETTINGS.faceRenderSizePx * faceAspectRatio
  );

  USERCROP.potFaceCutTexture = create_emptyTexture(
    SETTINGS.faceRenderSizePx,
    SETTINGS.faceRenderSizePx
  );
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
  GL.texParameteri(
    GL.TEXTURE_2D,
    GL.TEXTURE_MIN_FILTER,
    GL.LINEAR_MIPMAP_NEAREST
  );
} // end create_textures()

function build_artPaintingMask(detectState, callback) {
  //cut the face with webgl and put a fading
  console.log('INFO : build_artPaintingMask()');

  var x = detectState.x,
    y = detectState.y,
    s = detectState.s,
    ry = detectState.ry;

  //compute normalized frame cut params :
  var xn = x * 0.5 + 0.5 + s * SETTINGS.artPaintingMaskOffset[0] * Math.sin(ry); //normalized x position
  var yn = y * 0.5 + 0.5 + s * SETTINGS.artPaintingMaskOffset[1];
  var sxn = s * SETTINGS.artPaintingMaskScale[0];
  var syn =
    (s * SETTINGS.artPaintingMaskScale[1] * ARTPAINTING.image.width) /
    ARTPAINTING.image.height;

  ARTPAINTING.positionFace[0] = xn;
  ARTPAINTING.positionFace[1] = yn;
  ARTPAINTING.scaleFace[0] = sxn;
  ARTPAINTING.scaleFace[1] = syn;

  //build the mask (the artPainting with the hole cut)
  GL.useProgram(SHPS.buildMask.program);
  GL.uniform2f(SHPS.buildMask.offset, xn, yn);
  GL.uniform2f(SHPS.buildMask.scale, sxn, syn);

  GL.activeTexture(GL.TEXTURE0);
  GL.bindTexture(GL.TEXTURE_2D, ARTPAINTING.baseTexture);

  // FILL VIEWPORT
  GL.enable(GL.BLEND);
  GL.blendFunc(GL.SRC_ALPHA, GL.ZERO);
  GL.clearColor(0, 0, 0, 0);
  GL.clear(GL.COLOR_BUFFER_BIT);
  GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);
  GL.disable(GL.BLEND);

  // copy the face cuted to a dumb canvas2D which will be displayed in the DOM
  var artPaintingMask = document.createElement('canvas');
  artPaintingMask.width = ARTPAINTING.image.width;
  artPaintingMask.height = ARTPAINTING.image.height;
  var ctx = artPaintingMask.getContext('2d');
  ctx.drawImage(FFSPECS.canvasElement, 0, 0);

  artPaintingMask.classList.add('artPainting');
  FFSPECS.canvasElement.classList.remove('artPainting');
  FFSPECS.canvasElement.classList.add('canvasNotDetected');
  ISUSERFACEDETECTED = false;
  ARTPAINTING.canvasMask = artPaintingMask;
  DOMARTPAINTINGCONTAINER.appendChild(artPaintingMask);

  // initialize the face cut pot texture
  var faceWidthPx = Math.round(ARTPAINTING.image.width * sxn);
  var faceHeightPx = Math.round(ARTPAINTING.image.height * syn);
  var maxDimPx = Math.max(faceWidthPx, faceHeightPx);
  ARTPAINTING.potFaceCutTextureSizePx = Math.pow(
    2,
    Math.ceil(Math.log(maxDimPx) / Math.log(2))
  );
  ARTPAINTING.potFaceCutTexture = GL.createTexture();
  GL.bindTexture(GL.TEXTURE_2D, ARTPAINTING.potFaceCutTexture);
  GL.texImage2D(
    GL.TEXTURE_2D,
    0,
    GL.RGBA,
    ARTPAINTING.potFaceCutTextureSizePx,
    ARTPAINTING.potFaceCutTextureSizePx,
    0,
    GL.RGBA,
    GL.UNSIGNED_BYTE,
    null
  );
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
  GL.texParameteri(
    GL.TEXTURE_2D,
    GL.TEXTURE_MIN_FILTER,
    GL.LINEAR_MIPMAP_NEAREST
  );

  // compute the face cut pot texture by doing render to texture
  GL.useProgram(SHPS.cropUserFace.program);
  GL.uniform2f(SHPS.cropUserFace.offset, xn, yn);
  GL.uniform2f(SHPS.cropUserFace.scale, sxn, syn);

  GL.bindFramebuffer(GLDRAWTARGET, FBO);
  GL.bindTexture(GL.TEXTURE_2D, ARTPAINTING.baseTexture);
  GL.viewport(
    0,
    0,
    ARTPAINTING.potFaceCutTextureSizePx,
    ARTPAINTING.potFaceCutTextureSizePx
  );
  GL.framebufferTexture2D(
    GL.FRAMEBUFFER,
    GL.COLOR_ATTACHMENT0,
    GL.TEXTURE_2D,
    ARTPAINTING.potFaceCutTexture,
    0
  );
  GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0); // FILL VIEWPORT

  // copy the ARTPAINTING.potFaceCutTexture to ARTPAINTING.hueTexture :
  GL.useProgram(SHPS.copyInvX.program);
  GL.viewport(0, 0, SETTINGS.hueTextureSizePx, SETTINGS.hueTextureSizePx);
  GL.framebufferTexture2D(
    GL.FRAMEBUFFER,
    GL.COLOR_ATTACHMENT0,
    GL.TEXTURE_2D,
    ARTPAINTING.hueTexture,
    0
  );
  GL.bindTexture(GL.TEXTURE_2D, ARTPAINTING.potFaceCutTexture);
  GL.generateMipmap(GL.TEXTURE_2D);
  GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0); // FILL VIEWPORT

  GL.bindFramebuffer(GLDRAWTARGET, null);
  callback();
} // end build_artPaintingMask()

function build_shps() {
  // build the search SHP
  const shpSearch = build_shaderProgram(COPY_VS, SEARCH_FS, 'SEARCH FACE');
  SHPS.search = {
    program: shpSearch,
    samplerVideo: GL.getUniformLocation(shpSearch, 'samplerVideo'),
    uxysw: GL.getUniformLocation(shpSearch, 'uxysw'),
  };
  GL.useProgram(shpSearch);
  GL.uniform1i(SHPS.search.samplerVideo, 0);

  // ARTPAINTING SHPS
  var set_apShp = function(shp) {
    var uSamplerImage = GL.getUniformLocation(shp, 'samplerImage');
    var uScale = GL.getUniformLocation(shp, 'scale');
    var uOffset = GL.getUniformLocation(shp, 'offset');

    GL.useProgram(shp);
    GL.uniform1i(uSamplerImage, 0);

    return {
      scale: uScale,
      offset: uOffset,
      program: shp,
    };
  };

  var alphaShaderChunk =
    'float alpha=0.;\n\
             vec2 uv=(vUV-offset+s2)/(2.*s2); //uv normalized in the face\n\
             if (uv.y>UPPERHEADY){ //upper head : circle arc\n\
                 vec2 uvc=(uv-vec2(0.5,UPPERHEADY))*vec2(1., 0.5/(1.-UPPERHEADY));\n\
                 float alphaBorder=smoothstep(0.5-SMOOTHEDGE, 0.5, length(uvc));\n\
                 float alphaCenter=smoothstep(UPPERHEADY, 1., uv.y);\n\
                 alpha=mix(alphaCenter, alphaBorder, smoothstep(0.3, 0.4, abs(uv.x-0.5)));\n\
             } else if (uv.y<LOWERHEADY){ //lower head : circle arc \n\
                 vec2 uvc=(uv-vec2(0.5, LOWERHEADY))*vec2(1., 0.5/LOWERHEADY);\n\
                 alpha=smoothstep(0.5-SMOOTHEDGE, 0.5, length(uvc));\n\
             } else { //middle head : straight\n\
                 vec2 uvc=vec2(uv.x-0.5, 0.);\n\
                 alpha=smoothstep(0.5-SMOOTHEDGE, 0.5,length(uvc));\n\
             }\n';
  alphaShaderChunk +=
    'float grayScale=dot(color, vec3(0.33,0.33,0.33));\n\
                       if (alpha>0.01){\n\
                        alpha=mix(pow(alpha, 0.5), pow(alpha, 1.5), smoothstep(0.1,0.5,grayScale));\n\
                       }';

  var shpBuildMask = build_shaderProgram(
    COPY_VS,

    'precision highp float;\n\
         uniform vec2 offset, scale;\n\
         uniform sampler2D samplerImage;\n\
         varying vec2 vUV;\n\
         \n\
         const float UPPERHEADY=' +
      SETTINGS.artPaintingHeadForheadY.toFixed(2) +
      ';\n\
         const float LOWERHEADY=' +
      SETTINGS.artPaintingHeadJawY.toFixed(2) +
      ';\n\
         const float SMOOTHEDGE=' +
      SETTINGS.artPaintingCropSmoothEdge.toFixed(2) +
      ';\n\
         \n\
         \n\
         void main(void){\n\
             vec2 s2=0.5*scale;\n\
             vec2 isFace=step(vUV, offset+s2)*step(offset-s2, vUV);\n\
             float isNotFace=1.-isFace.x*isFace.y;\n\
             if (isNotFace>0.01){\n\
                 gl_FragColor=texture2D(samplerImage, vUV); return;\n\
             }\n\
             vec3 color=texture2D(samplerImage, vUV).rgb;\n\
             ' +
      alphaShaderChunk +
      '\
             gl_FragColor=vec4(color, alpha);\n\
             ' +
      (SETTINGS.debugArtpaintingCrop ? 'gl_FragColor=vec4(1.,0.,0.,1.);' : '') +
      '\n\
         }',

    'BUILD ARTPAINTING MASK'
  );
  SHPS.buildMask = set_apShp(shpBuildMask);

  //this SHP is only used to crop the face to compute the hueTexture
  var shpCutFace = build_shaderProgram(
    'attribute vec2 position;\n\
         uniform vec2 offset, scale;\n\
         varying vec2 vUV;\n\
         void main(void){\n\
            gl_Position=vec4(position, 0., 1.);\n\
            vUV=offset+0.5*position*scale;\n\
         }',
    'precision lowp float;\n\
         uniform sampler2D samplerImage;\n\
         varying vec2 vUV;\n\
         const float BORDER=0.2;\n\
         \n\
         void main(void){\n\
             vec2 uvCentered=2.0*vUV-vec2(1.,1.);\n\
             float ruv=length(uvCentered);\n\
             vec2 uvn=uvCentered/ruv;\n\
             vec2 uvBorder=uvn*(1.-BORDER);\n\
             float isOutside=step(1.-BORDER, ruv);\n\
             uvCentered=mix(uvCentered, uvBorder, isOutside);\n\
             gl_FragColor=texture2D(samplerImage, uvCentered*0.5+vec2(0.5,0.5));\n\
         }',
    'CUT ARTPAINTING FACE'
  );
  SHPS.cropUserFace = set_apShp(shpCutFace);

  //build the copy shader program :
  var shpCopy = build_shaderProgram(COPY_VS, COPY_FS, 'COPY');
  SHPS.copy = {
    program: shpCopy,
  };
  var uSamplerImage = GL.getUniformLocation(shpCopy, 'samplerImage');
  GL.useProgram(shpCopy);
  GL.uniform1i(uSamplerImage, 0);

  //build the copyInvX shader program
  var shpCopyInvX = build_shaderProgram(
    COPY_VS.replace('vUV=0.5+0.5*position', 'vUV=0.5+vec2(-0.5,0.5)*position'),
    COPY_FS,
    'COPYINVX'
  );
  SHPS.copyInvX = {
    program: shpCopyInvX,
  };
  var uSamplerImage = GL.getUniformLocation(shpCopyInvX, 'samplerImage');
  GL.useProgram(shpCopyInvX);
  GL.uniform1i(uSamplerImage, 0);

  //final render shp
  var shpRender = build_shaderProgram(COPY_VS, FINAL_FS, 'FINAL RENDER FACE');
  SHPS.render = {
    program: shpRender,
    scale: GL.getUniformLocation(shpRender, 'scale'),
    offset: GL.getUniformLocation(shpRender, 'offset'),
  };
  var uSamplerImage = GL.getUniformLocation(shpRender, 'samplerImage');
  var uSamplerHueSrc = GL.getUniformLocation(shpRender, 'samplerHueSrc');
  var uSamplerHueDst = GL.getUniformLocation(shpRender, 'samplerHueDst');
  GL.useProgram(shpRender);
  GL.uniform1i(uSamplerImage, 0);
  GL.uniform1i(uSamplerHueSrc, 2);
  GL.uniform1i(uSamplerHueDst, 1);
} //end build_shps()

function reset_toVideo() {
  position_userCropCanvas();
  window.addEventListener('resize', position_userCropCanvas, false);

  FFSPECS.canvasElement.width = SETTINGS.videoDetectSizePx;
  FFSPECS.canvasElement.height = SETTINGS.videoDetectSizePx;
  faceFilter.resize();

  faceFilter.reset_inputTexture();
  STATE = STATES.DETECTUSERFACE;
}

// compile a shader
function compile_shader(source, type, typeString) {
  var shader = GL.createShader(type);
  GL.shaderSource(shader, source);
  GL.compileShader(shader);
  if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
    alert(
      'ERROR IN ' + typeString + ' SHADER : ' + GL.getShaderInfoLog(shader)
    );
    console.log('Buggy shader source : \n', source);
    return false;
  }
  return shader;
}

// helper function to build the shader program :
function build_shaderProgram(shaderVertexSource, shaderFragmentSource, id) {
  // compile both shader separately
  const shaderVertex = compile_shader(
    shaderVertexSource,
    GL.VERTEX_SHADER,
    `VERTEX ${id}`
  );
  const shaderFragment = compile_shader(
    shaderFragmentSource,
    GL.FRAGMENT_SHADER,
    `FRADMENT ${id}`
  );

  const shaderProgram = GL.createProgram();
  GL.attachShader(shaderProgram, shaderVertex);
  GL.attachShader(shaderProgram, shaderFragment);

  // start the linking stage :
  GL.linkProgram(shaderProgram);
  const aPos = GL.getAttribLocation(shaderProgram, 'position');
  GL.enableVertexAttribArray(aPos);

  return shaderProgram;
} // end build_shaderProgram()

function position_userCropCanvas() {
  console.log('INFO : position_userCropCanvas()');
  var restoredPosition = FFSPECS.canvasElement.style.position;
  FFSPECS.canvasElement.style.position = 'absolute';

  // compute topPx an leftPx in the artpainting canvas image ref :
  var topPx = ARTPAINTING.image.height * ARTPAINTING.positionFace[1];
  var leftPx = ARTPAINTING.image.width * ARTPAINTING.positionFace[0];
  var widthFacePx = ARTPAINTING.image.width * ARTPAINTING.scaleFace[0];
  var heightFacePx = ARTPAINTING.image.height * ARTPAINTING.scaleFace[1];
  var widthPx =
    (widthFacePx * SETTINGS.videoDetectSizePx) / SETTINGS.faceRenderSizePx; //the whole canvas is bigger than the user face rendering
  topPx = ARTPAINTING.image.height - topPx; //Y axis is inverted between WebGL viewport and CSS

  // take account of the CSS scale factor of the art painting
  var domRect = DOMARTPAINTINGCONTAINER.getBoundingClientRect();
  var cssScaleFactor = domRect.width / ARTPAINTING.image.width;
  topPx *= cssScaleFactor;
  leftPx *= cssScaleFactor;
  widthPx *= cssScaleFactor;
  widthFacePx *= cssScaleFactor;
  heightFacePx *= cssScaleFactor;

  // position corner of the userFace instead of center
  topPx -= heightFacePx / 2;
  leftPx -= widthFacePx / 2;

  FFSPECS.canvasElement.style.top = Math.round(topPx).toString() + 'px';
  FFSPECS.canvasElement.style.left = Math.round(leftPx).toString() + 'px';
  FFSPECS.canvasElement.style.width = Math.round(widthPx).toString() + 'px';

  FFSPECS.canvasElement.style.position = restoredPosition;
} // end position_userCropCanvas()

// draw in search mode
function draw_search(detectState) {
  GL.useProgram(SHPS.search.program);
  GL.viewport(0, 0, FFSPECS.canvasElement.width, FFSPECS.canvasElement.height);
  GL.uniform4f(
    SHPS.search.uxysw,
    detectState.x,
    detectState.y,
    detectState.s,
    (detectState.s * FFSPECS.canvasElement.width) / FFSPECS.canvasElement.height
  );
  GL.activeTexture(GL.TEXTURE0);
  GL.bindTexture(GL.TEXTURE_2D, FFSPECS.videoTexture);
  GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);
}

// draw final render
function draw_render(detectState) {
  // do RTT
  GL.bindFramebuffer(GLDRAWTARGET, FBO);

  // crop the user's face and put the result to USERCROP.potFaceCutTexture
  var s = detectState.s / SETTINGS.zoomFactor;
  var xn =
    detectState.x * 0.5 +
    0.5 +
    s * SETTINGS.artPaintingMaskOffset[0] * Math.sin(detectState.ry); //normalized x position
  var yn = detectState.y * 0.5 + 0.5 + s * SETTINGS.artPaintingMaskOffset[1];
  var sxn = s * SETTINGS.artPaintingMaskScale[0];
  var syn = s * SETTINGS.artPaintingMaskScale[1];

  GL.useProgram(SHPS.cropUserFace.program);
  GL.framebufferTexture2D(
    GL.FRAMEBUFFER,
    GL.COLOR_ATTACHMENT0,
    GL.TEXTURE_2D,
    USERCROP.potFaceCutTexture,
    0
  );
  GL.uniform2f(SHPS.cropUserFace.offset, xn, yn);
  GL.uniform2f(SHPS.cropUserFace.scale, sxn, syn);
  GL.viewport(0, 0, SETTINGS.faceRenderSizePx, SETTINGS.faceRenderSizePx);
  GL.bindTexture(GL.TEXTURE_2D, FFSPECS.videoTexture);
  GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);

  // shrink the userface to a SETTINGS.hueTextureSizePx texture
  GL.useProgram(SHPS.copy.program);
  GL.framebufferTexture2D(
    GL.FRAMEBUFFER,
    GL.COLOR_ATTACHMENT0,
    GL.TEXTURE_2D,
    USERCROP.hueTexture,
    0
  );
  GL.viewport(0, 0, SETTINGS.hueTextureSizePx, SETTINGS.hueTextureSizePx);
  GL.bindTexture(GL.TEXTURE_2D, USERCROP.potFaceCutTexture);
  GL.generateMipmap(GL.TEXTURE_2D);
  GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);

  // final rendering including light correction
  GL.bindFramebuffer(GLDRAWTARGET, null);
  GL.useProgram(SHPS.render.program);
  GL.uniform2f(SHPS.render.offset, xn, yn);
  GL.uniform2f(SHPS.render.scale, sxn, syn);
  GL.bindTexture(GL.TEXTURE_2D, FFSPECS.videoTexture);
  GL.activeTexture(GL.TEXTURE1);
  GL.bindTexture(GL.TEXTURE_2D, ARTPAINTING.hueTexture);
  // GL.bindTexture(GL.TEXTURE_2D, ARTPAINTING.potFaceCutTexture); //KILL

  GL.activeTexture(GL.TEXTURE2);
  GL.bindTexture(GL.TEXTURE_2D, USERCROP.hueTexture);
  GL.activeTexture(GL.TEXTURE0);
  GL.viewport(
    0,
    SETTINGS.videoDetectSizePx - USERCROP.faceCutDims[1],
    USERCROP.faceCutDims[0],
    USERCROP.faceCutDims[1]
  );
  GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);
} // end draw_render()

function callbackTrack(detectState) {
  switch (STATE) {
    case STATES.DETECTARTPAINTINGFACE:
      if (detectState.detected > SETTINGS.detectArtPaintingThreshold) {
        if (++ARTPAINTING.detectCounter > SETTINGS.nDetectsArtPainting) {
          var round = function(n) {
            return Math.round(n * 1e5) / 1e5;
          };
          console.log(
            'FACE DETECTED IN THE BASE PICTURE. detectState = ' +
              JSON.stringify({
                x: round(detectState.x),
                y: round(detectState.y),
                s: round(detectState.s),
                ry: round(detectState.ry),
              }).replace(/"/g, '')
          );
          STATE = STATES.BUSY;
          build_artPaintingMask(detectState, reset_toVideo);
          return;
        }
      }
      draw_search(detectState);
      break;

    case STATES.ARTPAINTINGFACEDETECTPROVIDED:
      STATE = STATES.BUSY;
      build_artPaintingMask(ARTPAINTING.detectedState, reset_toVideo);
      break;

    case STATES.DETECTUSERFACE:
      if (
        ISUSERFACEDETECTED &&
        detectState.detected <
          SETTINGS.detectionThreshold - SETTINGS.detectionHysteresis
      ) {
        // DETECTION LOST
        ISUSERFACEDETECTED = false;
        FFSPECS.canvasElement.classList.remove('canvasDetected');
        FFSPECS.canvasElement.classList.add('canvasNotDetected');
      } else if (
        !ISUSERFACEDETECTED &&
        detectState.detected >
          SETTINGS.detectionThreshold + SETTINGS.detectionHysteresis
      ) {
        // FACE DETECTED
        ISUSERFACEDETECTED = true;
        FFSPECS.canvasElement.classList.remove('canvasNotDetected');
        FFSPECS.canvasElement.classList.add('canvasDetected');
      }

      if (ISUSERFACEDETECTED) {
        draw_render(detectState);
      } else {
        draw_search(detectState);
      }

      break;

    default:
      break;
  } // end switch(STATE)
} // end callbackTrack
