import React, {Component,} from 'react';
import PropTypes from 'prop-types';

import styles from './Checkbox.css';

export default class Checkbox extends Component {
  static defaultProps = {
    value: false,
  };

  get checked() {
    return this.input.checked;
  }

  get value() {
    return this.input.checked;
  }

  render() {
    const {
      id,
      value,
      disabled,
      label,
      onChange,
    } = this.props;

    return (
      <div className={styles.field}>
        <label className={styles.label}>
          <input className={styles.checkboxInput}
            type='checkbox'
            id={id}
            ref={c => {this.input = c;}}
            checked={value}
            disabled={disabled}
            onChange={onChange}
          />
          {label}
        </label>
      </div>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  Checkbox.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.bool,
    required: PropTypes.bool,
    onChange: PropTypes.func,
  };
}
