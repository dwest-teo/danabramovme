import React from 'react';
import { Link } from 'react-router-dom';
import { CREATE, GALLERY } from '../../constants';

export default () => (
  <div>
    <h1>danabramov.me</h1>
    <Link to={CREATE}>lets do this</Link>
    <div style={{ marginTop: '20px' }}>
      maybe show most recent from gallery here?
    </div>
    <Link to={GALLERY}>look at gallery</Link>
  </div>
);
