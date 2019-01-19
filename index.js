import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import Home from './components/home';

class Root extends PureComponent {
  componentDidMount() {
    console.log('do some checking for webcam');
  }

  render() {
    return <Home />;
  }
}

const rootElem = document.getElementById('root');
ReactDOM.render(<Root />, rootElem);
