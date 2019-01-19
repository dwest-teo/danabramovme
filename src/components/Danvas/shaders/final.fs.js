export default `
precision highp float;
uniform sampler2D samplerImage, samplerHueSrc, samplerHueDst;
uniform vec2 offset, scale;
varying vec2 vUV;
const vec2 EPSILON2 = vec2(0.001, 0.001);

//from http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;

  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

//from https://github.com/hughsk/glsl-hsv2rgb
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);

  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  //return c.z * normalize(mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y));
}

void main(void){
  //flip left-right :
  vec2 uv = vec2(1. - vUV.x, vUV.y);

  //get color in HSV format :
  vec2 uvCut = uv * scale + offset - scale / 2.;
  vec3 colorRGB = texture2D(samplerImage, uvCut).rgb;
  vec3 colorHSV = rgb2hsv(colorRGB);

  //compute color transform :
  vec3 srcRGB = texture2D(samplerHueSrc, uv).rgb;
  vec3 dstRGB = texture2D(samplerHueDst, uv).rgb;
  vec3 srcHSV = rgb2hsv(srcRGB);
  vec3 dstHSV = rgb2hsv(dstRGB);

  //apply the transform :
  vec2 factorSV = vec2(1., 0.8) * dstHSV.yz / (srcHSV.yz + EPSILON2);
  factorSV = clamp(factorSV, vec2(0.3, 0.3), vec2(3, 3.));
  //factorSV.x = mix(0., factorSV.x, smoothstep(0.02, 0.3, colorHSV.z));
  float dHue = dstHSV.x - srcHSV.x;
  vec3 colorHSVout = vec3(mod(1.0 + colorHSV.x + dHue, 1.0), colorHSV.yz * factorSV);
  colorHSVout = clamp(colorHSVout, vec3(0., 0., 0.), vec3(1., 1., 1));
  //vec3 colorHSVout2 = vec3(dstHSV.xy, colorHSVout.z);
  //colorHSVout=mix(colorHSVout2, colorHSVout, smoothstep(0.2,0.4,colorHSV.y)); //0.6->0.8
  //colorHSVout=mix(colorHSVout, colorHSVout2, smoothstep(0.5,1.,colorHSV.z)); //0.6->0.8

  //reconvert to RGB and output the color :
  colorRGB=hsv2rgb(colorHSVout);

  gl_FragColor=vec4(colorRGB, 1.);
}
`;
