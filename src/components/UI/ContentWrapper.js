import styled from 'styled-components';
import { color, space, maxWidth } from 'styled-system';

export const ContentWrapper = styled.div(color, space, maxWidth);

ContentWrapper.propTypes = {
  ...color.propTypes,
  ...space.propTypes,
  ...maxWidth.propTypes,
};

ContentWrapper.defaultProps = {
  maxWidth: '42rem',
  mx: 'auto',
  py: 6,
  px: 4,
};

ContentWrapper.displayName = 'ContentWrapper';

export default ContentWrapper;
