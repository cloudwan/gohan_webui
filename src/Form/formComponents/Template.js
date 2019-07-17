import React from 'react';
import PropTypes from 'prop-types';

// import bootstrap from 'bootstrap/dist/css/bootstrap.css';

import Label from './Label';

function Template(props) {
  const {
    id,          // eslint-disable-line
    classNames,  // eslint-disable-line
    label,       // eslint-disable-line
    required,    // eslint-disable-line
    displayLabel,// eslint-disable-line
    children,
    errors,      // eslint-disable-line
    help,
    description,
    hidden,
    rawErrors
  } = props;

  if (hidden) {
    return children;
  }

  return (
    <div className={`form-group ${rawErrors ? 'has-danger' : ''}`}>
      {displayLabel ? <Label label={label} required={required}
        id={id}
      /> : null}
      {displayLabel && description ? description : null}
      {children}
      {help}
    </div>
  );
}

Template.propTypes = {
  id: PropTypes.string,
  classNames: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.node.isRequired,
  errors: PropTypes.element,
  help: PropTypes.element,
  description: PropTypes.element,
  hidden: PropTypes.bool,
  required: PropTypes.bool,
  readonly: PropTypes.bool,
  displayLabel: PropTypes.bool,
  formContext: PropTypes.object,
};

Template.defaultProps = {
  hidden: false,
  readonly: false,
  required: false,
  displayLabel: true,
};

export default Template;
