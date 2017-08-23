import React from 'react';
import PropTypes from 'prop-types';

const TableHeaderCell = ({children}) => {
  return (
    <th>{children}</th>
  );
};

TableHeaderCell.propTypes = {
  children: PropTypes.node
};

export default TableHeaderCell;
