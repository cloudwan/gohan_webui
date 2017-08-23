import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';

const TableDataLinkCell = ({children, url, id}) => {
  return (
    <td>
      <Link to={`${url}/${id}`}>
        {children}
      </Link>
    </td>
  );
};

TableDataLinkCell.propTypes = {
  children: PropTypes.node
};

export default TableDataLinkCell;
