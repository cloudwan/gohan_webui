import React, {PropTypes} from 'react';

import './DescriptionField.scss';

function DescriptionField(props) {
  const {id, description} = props;

  if (!description) {
    return <div />;
  }

  if (typeof description === 'string') {
    return (
      <p id={id} className="gohan-form__description">
        {description}
      </p>
    );
  }
  return (
    <div id={id} className="gohan-form__description">
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
