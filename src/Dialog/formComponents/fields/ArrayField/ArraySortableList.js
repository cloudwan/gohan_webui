import React from 'react';
import {SortableContainer} from 'react-sortable-hoc';

import './ArraySortableList.scss';

export const ArraySortableList = SortableContainer(({children}) => (
  <ul className="list-sortable">
    {children}
  </ul>
));
