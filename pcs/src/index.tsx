import './index.css';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.compat.css';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactNotification from 'react-notifications-component';

import App from './App';
import { AppContextProvider } from './contexts/AppContext';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <>
    <ReactNotification />
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
