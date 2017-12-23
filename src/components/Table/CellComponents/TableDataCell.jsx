import React from 'react';
import PropTypes from 'prop-types';

const TableDataCell = ({children, className, colSpan}) => {
  return (
    <td {...{className}} {...{colSpan}}>{children}</td>
  );
};

TableDataCell.propTypes = {
  children: PropTypes.node
};

export default TableDataCell;
