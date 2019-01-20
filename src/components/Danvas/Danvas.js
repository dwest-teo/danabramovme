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
          width="1024"
          height="1024"
          id="jeeFaceFilterCanvas"
          className="artPainting"
        />
      </div>
      <button
        type="button"
        onClick={() => {
          html2canvas(containerRef.current, {
            width: canvasRef.current.width,
            height: canvasRef.current.height,
            scale: 1,
            x: 0,
            y: 0,
          }).then(canvas => {
            setSavedImg(canvas.toDataURL('image/png'));
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
