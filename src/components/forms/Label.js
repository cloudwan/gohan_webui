import React from 'react';
import ProtoTypes from 'prop-types';

import bootstrap from 'bootstrap/dist/css/bootstrap.css';

function Label(props) {
  const {children, htmlFor} = props;

  return (
    <label className={bootstrap['form-control-label']} {...{htmlFor}}>
      {children}
    </label>
  );
}

export default Label;

if (process.env.NODE_ENV !== 'production') {
  Label.propTypes = {
    children: ProtoTypes.node.isRequired,
    htmlFor: ProtoTypes.string.isRequired,
  };
}
