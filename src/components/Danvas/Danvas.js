import React, { useEffect, useRef } from 'react';

import { main, change_artPainting } from './faceReplacement';

import SETTINGS from './settings';

const Danvas = ({ image }) => {
  const canvasRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('faceReplacement: main()');
    main(canvasRef.current, containerRef.current);
  }, []);

  useEffect(
    () => {
      // eslint-disable-next-line no-console
      console.log('faceReplacement: change_artPainting()');
      change_artPainting(image);
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
    </div>
  );
};

Danvas.defaultProps = {
  image: SETTINGS.artPainting,
};

export default Danvas;
