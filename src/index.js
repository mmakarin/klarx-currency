import React from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '@material-ui/core';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import relativeTime from 'dayjs/plugin/relativeTime';

import './index.css';
import muiTheme from './muiTheme';
import App from './components/App';

dayjs.extend(isSameOrBefore);
dayjs.extend(relativeTime);

ReactDOM.render(
  /* <React.StrictMode> */
  <ThemeProvider theme={muiTheme}>
    <App />
  </ThemeProvider>
  /* </React.StrictMode> */,
  document.getElementById('root')
);
