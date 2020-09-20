import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import { default as RouteWithLayout } from '../components/RouteWithLayout';
import BaseLayout from '../layouts/base';
import HomePage from '../pages/home';
import RoomsPage from '../pages/rooms';
import RoomPage from '../pages/room';
import Error404 from '../pages/error404';

const router = () => {
  //Generate the route for our app
  //basename is the default link so our address/our endpoint
  //Switch is used to render the first route that match our
  //:id mean that the link can change, and we read the :id from the component
  //no path mean no route is found so we show 404 error
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <RouteWithLayout exact path='/' component={HomePage} layout={BaseLayout} />
        <RouteWithLayout exact path='/rooms' component={RoomsPage} layout={BaseLayout} />
        <RouteWithLayout exact path='/room/:id' component={RoomPage} layout={BaseLayout} />

        <RouteWithLayout path='' component={Error404} layout={BaseLayout} />
      </Switch>
    </Router>
  );
};

export default router;
