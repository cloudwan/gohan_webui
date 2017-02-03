import React, {PropTypes} from 'react';

import Label from './Label';

function Template(props) {
  const {
    id,          // eslint-disable-line
    classNames,  // eslint-disable-line
    label,       // eslint-disable-line
    required,    // eslint-disable-line
    displayLabel,// eslint-disable-line
    children,
    errors,
    help,
    description,
    hidden
  } = props;
  if (hidden) {
    return children;
  }
  return (
    <div>
      {displayLabel ? <Label label={label} required={required}
        id={id}
      /> : null}
      {displayLabel && description ? description : null}
      {children}
      {errors}
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
