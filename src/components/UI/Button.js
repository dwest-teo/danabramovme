import React from 'react';

import Text, { TextPropTypes } from './Text';

export const Button = props => <Text {...props} />;

Button.propTypes = TextPropTypes;

Button.defaultProps = {
  as: 'button',
  color: 'pink',
  fontFamily: '"Montserrat", sans-serif',
  fontWeight: 1,
  fontSize: 2,
  py: 2,
  px: 4,
  m: 0,
};

Button.displayName = 'Button';

export default Button;
