import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';

const App = () => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('do some checking for webcam');
  }, []);

  return <Home />;
};

ReactDOM.render(<App />, document.getElementById('app'));
