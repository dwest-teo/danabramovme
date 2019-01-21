import React, { Fragment, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import html2canvas from 'html2canvas';
import { main, change_artPainting } from './faceReplacement';

import SETTINGS, { IMG_STATE } from './settings';

// TODO - saved image sizing just ain't right
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
    <Fragment>
      <div ref={containerRef} id="artpaintingContainer">
        <canvas
          ref={canvasRef}
          width="788"
          height="1386"
          id="jeeFaceFilterCanvas"
          className="artPainting"
        />
      </div>
      <button
        type="button"
        onClick={() => {
          html2canvas(containerRef.current, {
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
            scale: 1,
            x: 334,
            y: 4,
          }).then(canvas => {
            setSavedImg(canvas.toDataURL('image/jpeg'));
          });
        }}
      >
        Save
      </button>
      {savedImg && <img src={savedImg} alt="test" />}
    </Fragment>
  );
};

Danvas.propTypes = {
  image: PropTypes.string,
};

Danvas.defaultProps = {
  image: SETTINGS.artPainting,
};

export default Danvas;
