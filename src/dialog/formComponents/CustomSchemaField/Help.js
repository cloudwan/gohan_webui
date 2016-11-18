import React from 'react';

function Help(props) {
  const {help} = props;
  if (!help) {
    return <div />;
  }
  if (typeof help === 'string') {
    return <p className='help-block'>{help}</p>;
  }
  return <div className='help-block'>{help}</div>;
}

export default Help;
