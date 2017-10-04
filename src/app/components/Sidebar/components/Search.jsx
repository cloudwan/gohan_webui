import React from 'react';
import ProtoTypes from 'prop-types';

import Input from '../../../../components/Input';
import InputLabel from '../../../../components/InputLabel';

import styles from './search.css';

export const Search = ({value = '', onChange = () => {}}) => (
  <div className={styles.searchContainer}>
    <InputLabel>
      <Input type="text"
        className={styles.sidebarSearch}
        value={value}
        placeholder="Search"
        isFill={true}
        onChange={onChange}
      />
    </InputLabel>
  </div>
);

export default Search;

if (process.env.NODE_ENV !== 'production') {
  Search.propTypes = {
    value: ProtoTypes.string,
    onChange: ProtoTypes.func,
  };
}
