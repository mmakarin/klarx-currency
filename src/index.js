import React from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '@material-ui/core';

import './index.css';
import muiTheme from './muiTheme';
// Usually I use babel-plugin-module-resolver to allow easier global imports,
// but it requires ejecting from CRA
import App from './components/App';

ReactDOM.render(
  /* <React.StrictMode> */
  <ThemeProvider theme={muiTheme}>
    <App />
  </ThemeProvider>
  /* </React.StrictMode> */,
  document.getElementById('root')
);
