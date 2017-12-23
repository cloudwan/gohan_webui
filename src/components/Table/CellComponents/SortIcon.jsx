import React from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {faSortAlphaDown, faSortAlphaUp} from '@fortawesome/fontawesome-free-solid';

const SortIcon = ({sortOrder}) => {

  if (sortOrder === 'asc') {
    return (
      <FontAwesomeIcon className="fa-icon" icon={faSortAlphaDown} />
    );
  } else if (sortOrder === 'desc') {
    return (
      <FontAwesomeIcon className="fa-icon" icon={faSortAlphaUp} />
    );
  }
  return null;
};

SortIcon.propTypes = {
  sortOrder: PropTypes.string
};

export default SortIcon;
