import styled from 'styled-components';
import {
  color,
  fontFamily,
  fontSize,
  fontWeight,
  space,
  textAlign,
} from 'styled-system';

export const Text = styled.p(
  color,
  fontFamily,
  fontSize,
  fontWeight,
  space,
  textAlign
);

/* eslint-disable react/forbid-foreign-prop-types */
export const TextPropTypes = {
  ...color.propTypes,
  ...fontFamily.propTypes,
  ...fontSize.propTypes,
  ...fontWeight.propTypes,
  ...space.propTypes,
  ...textAlign.propTypes,
};

Text.propTypes = TextPropTypes;

Text.defaultProps = {
  fontFamily: '"Merriweather", serif',
  fontWeight: 0,
  fontize: 1,
  color: 'dark',
  my: 3,
};

Text.displayName = 'Text';

export default Text;
