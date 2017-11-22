import React from 'react';
import ProtoTypes from 'prop-types';

export const NavContainer = ({children = null}) => (
  <nav className="pt-navbar pt-fixed-top pt-dark">
    {children}
  </nav>
);

export default NavContainer;

if (process.env.NODE_ENV !== 'production') {
  NavContainer.propTypes = {
    children: ProtoTypes.node
  };
}
