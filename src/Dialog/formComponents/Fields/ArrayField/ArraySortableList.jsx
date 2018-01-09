import React from 'react';
import {SortableContainer} from 'react-sortable-hoc';

export const ArraySortableList = SortableContainer(({children}) => (
  <ul className="list-sortable">
    {children}
  </ul>
));
