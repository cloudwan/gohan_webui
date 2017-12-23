import React from 'react';
import PropTypes from 'prop-types';

const Card = ({children}) => {
  return (
    <div className="card">
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node
};

export default Card;
