import React from 'react';
import PropTypes from 'prop-types';

const Select = ({
  items = [],
  onSelect = () => {},
  selectedItem = ''
}) => (
  <div className="pt-select pt-fill">
    <select className="select"
      onChange={onSelect}
      value={selectedItem}>
      {
        items && items.map((item, index) => (
          <option key={index}
            value={item}>
            {item}
          </option>
        ))
      }
    </select>
  </div>
);

export default Select;

if (process.env.NODE_ENV !== 'production') {
  Select.propTypes = {
    items: PropTypes.array,
    onSelect: PropTypes.func,
    selectedItem: PropTypes.string,
  };
}
