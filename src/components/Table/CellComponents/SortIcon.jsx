import React from 'react';
import PropTypes from 'prop-types';

const SortIcon = ({sortOrder}) => {
  return (
    <span className={'pt-icon-small pt-icon-sort-' + sortOrder}
      style={{marginLeft: 4}}
    />
  );
};

SortIcon.propTypes = {
  sortOrder: PropTypes.string
};

export default SortIcon;
