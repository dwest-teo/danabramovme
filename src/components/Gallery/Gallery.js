import React from 'react';
import { Link } from 'react-router-dom';
import { CREATE } from '../../constants';

export default () => (
  <div>
    <h1>gallery</h1>
    <Link to={CREATE}>make your own</Link>
    <div style={{ marginTop: '20px' }}>results from firebase here</div>
  </div>
);
