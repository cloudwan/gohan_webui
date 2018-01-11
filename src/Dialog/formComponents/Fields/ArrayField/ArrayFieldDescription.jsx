import React from 'react';

function ArrayFieldDescription({DescriptionField, idSchema, description}) {
  if (!description) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  const id = `${idSchema.$id}__description`;
  return <DescriptionField id={id} description={description} />;
}

export default ArrayFieldDescription;
