import React from 'react';
import styled from 'styled-components';

import Text, { TextPropTypes } from './Text';

const StyledHyperlink = styled(Text)`
  text-decoration: underline;

  :hover {
    text-decoration: none;
  }
`;

export const Hyperlink = props => <StyledHyperlink {...props} />;

Hyperlink.propTypes = TextPropTypes;

Hyperlink.defaultProps = {
  as: 'a',
  color: 'pink',
  fontFamily: '"Merriweather", serif',
  fontWeight: 0,
};

Hyperlink.displayName = 'Hyperlink';

export default Hyperlink;
