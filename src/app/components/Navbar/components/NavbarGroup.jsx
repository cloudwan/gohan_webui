import React from 'react';
import ProtoTypes from 'prop-types';

export const NavbarGroup = ({children = null, isRight = false}) => (
  <div className={`pt-navbar-group pt-align-${isRight ? 'right' : 'left'}`}>
    {children}
  </div>
);

export default NavbarGroup;

if (process.env.NODE_ENV !== 'production') {
  NavbarGroup.propTypes = {
    children: ProtoTypes.node,
    isRight: ProtoTypes.bool,
  };
}
