import React, { PureComponent, Fragment } from 'react';
import Slider from 'react-slick';

import { main, change_artPainting } from '../../faceReplacement';

const sliderSettings = {
  speed: 300,
  slidesToShow: 1,
  centerMode: true,
  variableWidth: true,
  arrows: false,
  swipeToSlide: true,
  infinite: false,
  focusOnSelect: true,
};

class Home extends PureComponent {
  componentDidMount() {
    console.log('run that main function');
    main();
  }

  render() {
    return (
      <Fragment>
        <div id="artpaintingContainer">
          <canvas
            width="1024"
            height="1024"
            id="jeeFaceFilterCanvas"
            className="artPainting"
          />
        </div>
        <Slider {...sliderSettings}>
          <div
            onClick={change_artPainting('images/old-dan.jpg', {
              x: 0.09803,
              y: 0.08814,
              s: 0.48782,
              ry: -0.04926,
            })}
            className="carouselItem carouselItem0"
          />
          <div
            onClick={change_artPainting('images/new-dan.jpg', {
              x: 0.04351,
              y: 0.07059,
              s: 0.6098,
              ry: 0.06192,
            })}
            className="carouselItem carouselItem1"
          />
        </Slider>
      </Fragment>
    );
  }
}

export default Home;
