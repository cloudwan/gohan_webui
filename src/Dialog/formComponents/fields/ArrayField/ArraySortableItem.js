import React from 'react';
import {SortableElement} from 'react-sortable-hoc';

export const ArraySortableItem = SortableElement(({children}) => (
  <li className="list-sortable__item">
    {children}
  </li>
));
