import PropTypes from 'prop-types';
import React from 'react';

const BaseLayout = (props) => {
  const { children } = props;

  //Default app layout
  return (
    <div id="app">
      <div className="container min-vh-100">
        {children}
      </div>
    </div> 
  );
};

//Allow us to use any type of props
BaseLayout.propTypes = {
  children: PropTypes.node,
};

export default BaseLayout;
