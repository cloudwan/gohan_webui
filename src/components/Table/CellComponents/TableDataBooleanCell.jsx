import React from 'react';
import PropTypes from 'prop-types';

const TableDataBooleanCell = ({children}) => {
  return (
    <td>{String(children)}</td>
  );
};

TableDataBooleanCell.propTypes = {
  children: PropTypes.bool
};

export default TableDataBooleanCell;
