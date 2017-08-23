import React from 'react';
import PropTypes from 'prop-types';

const TableRow = ({children}) => {
  return (
    <tr>{children}</tr>
  );
};

TableRow.propTypes = {
  children: PropTypes.node.isRequired
};

export default TableRow;
