import React from 'react';
import './App.sass';

import Router from './router'

function App() {
  //We use the router because with this one, we will route "/" by default and show the home page directly
  return (
    <Router />
  );
}

export default App;
