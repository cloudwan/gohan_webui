import React from 'react';
import PropTypes from 'prop-types';

const TableHeader = ({children}) => {
  return (
    <thead>{children}</thead>
  );
};

TableHeader.propTypes = {
  children: PropTypes.node.isRequired
};

export default TableHeader;
