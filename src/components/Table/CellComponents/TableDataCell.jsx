import React from 'react';
import PropTypes from 'prop-types';

const TableDataCell = ({children}) => {
  return (
    <td>{children}</td>
  );
};

TableDataCell.propTypes = {
  children: PropTypes.node
};

export default TableDataCell;
