import React, {PropTypes} from 'react';

const descriptionStyle = {
  marginTop: 0
};

function DescriptionField(props) {
  const {id, description} = props;

  if (!description) {
    return <div />;
  }

  if (typeof description === 'string') {
    return <p id={id} style={descriptionStyle}>{description}</p>;
  }
  return <div id={id} style={descriptionStyle}>{description}</div>;
}

DescriptionField.propTypes = {
  id: PropTypes.string,
  description: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ])
};

export default DescriptionField;
