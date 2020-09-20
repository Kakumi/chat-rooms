import PropTypes from 'prop-types';
import React from 'react';
import { Route } from 'react-router-dom';

const RouteWithLayout = (props) => {
  const { layout: Layout, component: Component, ...rest } = props; //We set an object with data from the props

  //We return a new route with others props
  //We render it with the layout props (baseLayout generally)
  //We show the component Component and send matchProps to it
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <Layout>
          <Component {...matchProps} />
        </Layout>
      )}
    />
  );
};

//Require component and layout at least
RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
};

export default RouteWithLayout;
