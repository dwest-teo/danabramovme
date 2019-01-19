export default `
precision lowp float;
varying vec2 vUV;
uniform sampler2D samplerVideo;
uniform vec4 uxysw;

void main(void) {
  vec3 colorVideo = texture2D(samplerVideo, vUV).rgb;
  vec2 pos = vUV * 2. - vec2(1., 1.);
  vec2 isInside = step(uxysw.xy - uxysw.zw, pos);
  isInside *= step(pos, uxysw.xy + uxysw.zw);
  vec2 blendCenterFactor = abs(pos - uxysw.xy) / uxysw.zw;
  float alpha = isInside.x * isInside.y * pow(max(blendCenterFactor.x, blendCenterFactor.y), 3.);
  vec3 color = mix(colorVideo, vec3(0., 0.6, 1.), alpha);

  gl_FragColor = vec4(color, 1.);
}
`;
