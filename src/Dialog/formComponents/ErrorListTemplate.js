import React from 'react';
import {Toast} from '@blueprintjs/core';

export default function ErrorListTemplate(props) {
  const {errors} = props;

  return (
    <div>
      <Toast message={errors.reduce(
        (result, error, index) =>
          result + `${error.message}${index === errors.length - 1 ? '.' : ', '}`, 'Validation error: '
      )}
        className={'pt-intent-danger'}
        iconName={'error'}
        timeout={0}
      />
    </div>
  );
}
