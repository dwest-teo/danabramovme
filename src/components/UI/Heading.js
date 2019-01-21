import React from 'react';

import Text, { TextPropTypes } from './Text';

export const Heading = props => <Text {...props} />;

Heading.propTypes = TextPropTypes;

Heading.defaultProps = {
  as: 'h1',
  color: 'dark',
  fontFamily: '"Montserrat", sans-serif',
  fontWeight: 1,
  mt: 4,
};

Heading.displayName = 'Heading';

export default Heading;
