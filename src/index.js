import React, { Fragment, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { defaultTheme, reset } from './theme';
import { HOME, CREATE, GALLERY } from './constants';
import Home from './components/Home';
import Create from './components/Create';
import Gallery from './components/Gallery';

const GlobalStyle = createGlobalStyle`
  ${reset}
`;

const App = () => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('do some checking for webcam');
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Fragment>
        <GlobalStyle />
        <Router>
          <Switch>
            <Route exact path={HOME} component={Home} />
            <Route path={CREATE} component={Create} />
            <Route path={GALLERY} component={Gallery} />
          </Switch>
        </Router>
      </Fragment>
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
