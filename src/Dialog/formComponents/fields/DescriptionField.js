import React from 'react';
import PropTypes from 'prop-types';


function DescriptionField(props) {
  const {id, description} = props;

  if (!description) {
    return <div />;
  }

  if (typeof description === 'string') {
    return (
      <p id={id} className="gohan-form-description">
        {description}
      </p>
    );
  }
  return (
    <div id={id} className="gohan-form-description">
      {description}
    </div>
  );
}

DescriptionField.propTypes = {
  id: PropTypes.string,
  description: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ])
};

export default DescriptionField;
