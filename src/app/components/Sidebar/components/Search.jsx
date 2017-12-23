import React from 'react';
import ProtoTypes from 'prop-types';

export const Search = ({value = '', onChange = () => {}}) => (
  <div className="sidebar-search mb-1">
    <input className="form-control" type="text"
      placeholder="Search"
      onChange={onChange}
      value={value}
    />
  </div>
);

export default Search;

if (process.env.NODE_ENV !== 'production') {
  Search.propTypes = {
    value: ProtoTypes.string,
    onChange: ProtoTypes.func,
  };
}
