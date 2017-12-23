import React from 'react';
import PropTypes from 'prop-types';

const TableHeaderCell = ({children, className}) => {
  return (
    <th {...{className}}>{children}</th>
  );
};

TableHeaderCell.propTypes = {
  children: PropTypes.node
};

export default TableHeaderCell;
