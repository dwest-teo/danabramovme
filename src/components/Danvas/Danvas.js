import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { main, change_artPainting } from './faceReplacement';

import SETTINGS, { IMG_STATE } from './settings';

const Danvas = ({ image }) => {
  const canvasRef = useRef();
  const containerRef = useRef();
  const [savedImg, setSavedImg] = useState();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('faceReplacement: main()');
    main(canvasRef.current, containerRef.current);
  }, []);

  useEffect(
    () => {
      setSavedImg();
      // eslint-disable-next-line no-console
      console.log('faceReplacement: change_artPainting()');
      change_artPainting(image, IMG_STATE[image]);
    },
    [image]
  );

  return (
    <div ref={containerRef} id="artpaintingContainer">
      <canvas
        ref={canvasRef}
        width="1024"
        height="1024"
        id="jeeFaceFilterCanvas"
        className="artPainting"
      />
      <button
        type="button"
        onClick={() => setSavedImg(canvasRef.current.toDataURL('image/png'))}
      >
        Save
      </button>
      {savedImg && <img src={savedImg} alt="test" />}
    </div>
  );
};

Danvas.propTypes = {
  image: PropTypes.string,
};

Danvas.defaultProps = {
  image: SETTINGS.artPainting,
};

export default Danvas;
