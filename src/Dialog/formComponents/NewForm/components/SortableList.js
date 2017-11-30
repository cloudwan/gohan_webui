import React from 'react';
import {SortableContainer} from 'react-sortable-hoc';

import styles from './SortableList.css';

const SortableList = SortableContainer(({children}) => (
  <ul className={styles.listContainer}>
    {children}
  </ul>
));

export default props => (
  <SortableList helperClass={styles.listContainerActive} {...props}/>
);

