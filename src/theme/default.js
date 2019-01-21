export const theme = {
  breakpoints: [32, 48, 64],
  space: [0, 4, 8, 16, 20, 32, 42, 64, 128, 256, 512],
  fontSizes: [12, 14, 16, 20, 24, 36, 48, 80, 96],
  fontWeights: [400, 900],
  fonts: {
    copy: '"Merriweather", serif',
    title: '"Montserrat", sans-serif',
  },
  lineHeights: {
    solid: 1,
    title: 1.25,
    copy: 1.4,
  },
  letterSpacings: {
    normal: 'normal',
    tracked: '0.1em',
    tight: '-0.05em',
    mega: '0.25em',
  },
  borders: [
    0,
    '1px solid',
    '2px solid',
    '4px solid',
    '8px solid',
    '16px solid',
    '32px solid',
  ],
  radii: [0, 4, 6, 16, 9999, '100%'],
  colors: {
    black: '#000',
    dark: '#282c35',
    pink: '#d23669',
    altpink: '#ffa7c4',
    white: '#fff',
    transparent: 'transparent',
    pinks: ['#d23669', '#ffa7c4'],
  },
};

export default theme;
