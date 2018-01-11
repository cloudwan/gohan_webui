import React from 'react';
import ProtoTypes from 'prop-types';

export const Container = ({children = null, isOpen = false}) => (
  <div className={`pt-elevation-0 pt-fixed-top sidebar${isOpen ? '' : ' sidebar-hidden'}`}>
    {children}
  </div>
);

export default Container;

if (process.env.NODE_ENV !== 'production') {
  Container.propTypes = {
    children: ProtoTypes.node
  };
}
