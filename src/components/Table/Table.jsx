import React from 'react';
import PropTypes from 'prop-types';

const Table = ({children, className}) => {
  return (
    <table {...{className}}>
      {children}
    </table>
  );
};

Table.propTypes = {
  children: PropTypes.node.isRequired
};

export default Table;
