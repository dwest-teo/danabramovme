import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { HOME, CREATE, GALLERY } from './constants';
import Home from './components/Home';
import Create from './components/Create';
import Gallery from './components/Gallery';

const App = () => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('do some checking for webcam');
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path={HOME} component={Home} />
        <Route path={CREATE} component={Create} />
        <Route path={GALLERY} component={Gallery} />
      </Switch>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
