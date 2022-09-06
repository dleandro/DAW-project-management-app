import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import App from './main/App';
import * as serviceWorker from './serviceWorker';
import './main/common/css/App.css';
import './main/common/css/index.css';
import Login from './main/users/Login'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Login>
        <App/>
      </Login>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
