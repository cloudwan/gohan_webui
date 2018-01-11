import React from 'react';
import PropTypes from 'prop-types';

const TableRow = ({children, active}) => {
  return (
    <tr {...{className: active ? 'active' : undefined}}>{children}</tr>
  );
};

TableRow.propTypes = {
  children: PropTypes.node.isRequired,
  active: PropTypes.bool
};

export default TableRow;
