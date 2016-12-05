import React from 'react';


function ArrayFieldTitle({TitleField, idSchema, title, required}) {
  if (!title) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  const id = `${idSchema.$id}__title`;
  return <TitleField id={id} title={title}
    required={required}
  />;
}

export default ArrayFieldTitle;
