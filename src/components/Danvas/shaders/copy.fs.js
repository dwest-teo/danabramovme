export default `
precision lowp float;
uniform sampler2D samplerImage;
varying vec2 vUV;

void main(void) {
  gl_FragColor = texture2D(samplerImage, vUV);
}
`;
