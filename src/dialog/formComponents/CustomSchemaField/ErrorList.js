import React from 'react';

function ErrorList(props) {
  const {errors = []} = props;
  if (errors.length === 0) {
    return <div />;
  }
  return (
    <div>
      <p/>
      <ul className='error-detail bs-callout bs-callout-info'>{
        errors.map((error, index) => {
          return <li className='text-danger' key={index}>{error}</li>;
        })
      }</ul>
    </div>
  );
}

export default ErrorList;
