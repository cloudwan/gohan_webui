import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

const TableDataLinkCell = ({children, url, id}) => {
  return (
    <td>
      <Link to={id ? `${url}/${id}` : url}>
        {children}
      </Link>
    </td>
  );
};

TableDataLinkCell.propTypes = {
  children: PropTypes.node
};

export default TableDataLinkCell;
