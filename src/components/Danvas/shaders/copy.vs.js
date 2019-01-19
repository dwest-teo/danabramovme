export default `
attribute vec2 position;
varying vec2 vUV;

void main(void) {
  gl_Position = vec4(position, 0., 1.);
  vUV = 0.5 + 0.5 * position;
}
`;
