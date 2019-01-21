import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { CREATE, GALLERY } from '../../constants';
import { ContentWrapper, Heading, Hyperlink, Text } from '../UI';

export default () => (
  <ContentWrapper>
    <header>
      <Heading>danabramov.me</Heading>
    </header>
    <Hyperlink as={Link} to={CREATE}>
      let's do this
    </Hyperlink>
    <Text>maybe show most recent from gallery here?</Text>
  </ContentWrapper>
);
