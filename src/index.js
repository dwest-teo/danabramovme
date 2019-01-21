import React, { Fragment, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { defaultTheme, reset } from './theme';
import Home from './components/Home';

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
        <Home />
      </Fragment>
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
