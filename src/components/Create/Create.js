import React, { useState } from 'react';
import { ContentWrapper, Button } from '../UI';

import Danvas from '../Danvas';

import OLD_DAN from '../../images/old-dan.jpg';
import NEW_DAN from '../../images/new-dan.jpg';

const IMAGES = [OLD_DAN, NEW_DAN];

const Create = () => {
  const [activeDan, setActiveDan] = useState(OLD_DAN);

  return (
    <ContentWrapper>
      <Danvas image={activeDan} />
      {IMAGES.map(img => (
        <Button
          key={img}
          onClick={() => setActiveDan(img)}
          type="button"
          style={{
            height: '50px',
            width: '50px',
            padding: '0',
            border: 'none',
          }}
        >
          <img
            src={img}
            alt=""
            style={{
              objectFit: 'cover',
              height: '100%',
              width: '100%',
            }}
          />
        </Button>
      ))}
    </ContentWrapper>
  );
};

export default Create;
