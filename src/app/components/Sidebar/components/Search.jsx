import React from 'react';
import ProtoTypes from 'prop-types';

import Input from '../../../../components/Input';
import InputLabel from '../../../../components/InputLabel';

export const Search = ({value = '', onChange = () => {}}) => (
  <div className="sidebar-search">
    <InputLabel>
      <Input type="text"
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
