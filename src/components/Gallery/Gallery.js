import React from 'react';
import { Link } from 'react-router-dom';
import { CREATE } from '../../constants';
import { ContentWrapper, Heading, Hyperlink, Text } from '../UI';

export default () => (
  <ContentWrapper>
    <Heading>gallery</Heading>
    <Hyperlink as={Link} to={CREATE}>
      make your own
    </Hyperlink>
    <Text mt={4}>results from firebase here</Text>
  </ContentWrapper>
);
