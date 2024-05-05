import React from 'react';
import { HashRouter as Router } from 'react-router-dom';

import Routes from './routes';
import GlobalStyles from './styles/global';

import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes />
      <GlobalStyles />
    </Router>
  );
};

export default App;
