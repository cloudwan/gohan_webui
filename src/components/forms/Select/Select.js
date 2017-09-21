/* global window*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import styles from './select.css';

class Select extends Component {
  static defaultProps = {
    sort: false,
    disabled: false,
    readonly: false,
    value: undefined
  };

  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      searchQuery: ''
    };
  }

  componentWillMount() {
    window.addEventListener('click', this.handleWindowClick, false);
    window.addEventListener('keydown', this.handleKeydown, false);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowClick, false);
    window.removeEventListener('keydown', this.handleKeydown, false);
  }

  handleWindowClick = event => {
    const isParent = (reference, target) => (
      target === reference || (target.parentNode && isParent(reference, target.parentNode))
    );
    if (this.state.focused) {
      if (!isParent(ReactDOM.findDOMNode(this.widget), event.target)) {
        this.handleBlur();
      }
    }
  };

  handleKeydown = event => {
    if (this.state.focused) {
      if (event.key === 'Tab') {
        this.handleBlur();
      }
    }
  };

  handleMenuItemClick = value => {
    this.props.onChange(value);
    this.setState({focused: !this.state.focused, searchQuery: ''});
  };

  handleShowAndHideMenu = event => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({focused: !this.state.focused, searchQuery: ''});
  };

  handleBlur = () => {
    this.setState({focused: false, searchQuery: ''});
  };

  handleSearchChange = event => {
    this.setState({searchQuery: event.target.value});
  };

  render() {
    const searchThreshold = 6;
    const {focused} = this.state;
    const {
      value,
      haystack,
      sort,
      disabled,
      readonly
    } = this.props;

    let nullable = false;
    let options = haystack.filter(item => {
      if (typeof item === 'object') {
        if (item.value === null) {
          nullable = true;

          return false;
        }

        return item.label.includes(this.state.searchQuery);
      } else if (typeof item === 'string') {
        if (item === null) {
          nullable = true;

          return false;
        }

        return item.includes(this.state.searchQuery);
      }
      throw new Error(`Unsupported type of haystack item (${typeof item})`);
    });

    if (sort === true) {
      options = options.sort((a, b) => {
        if (typeof a === 'object' || typeof b === 'object') {
          return a.label.localeCompare(b.label);
        } else if (typeof a === 'string' || typeof b === 'string') {
          return a.localeCompare(b);
        }
        throw new Error(`Unsupported type of haystack items (${typeof a}) and (${typeof b})`);
      });
    }

    const selectedItem = haystack.find(item => {
      if (typeof item === 'object') {
        return item.value === value;
      } else if (typeof item === 'string') {
        return value === value;
      }
    });

    return (
      <div className={styles.select}
        ref={ref => {this.widget = ref;}}>
        <button disabled={disabled || readonly}
          className={styles.button}
          onClick={this.handleShowAndHideMenu}>
          {selectedItem ? selectedItem.label || selectedItem : 'Nothing selected'}
        </button>
        {focused &&
          <div className={styles.options}>
            {(haystack.length >= searchThreshold) &&
              <div className={styles.search}>
                <span className={styles.searchIcon}/>
                <input className={styles.searchInput}
                  type="text"
                  placeholder="Search input" dir="auto"
                  value={this.state.searchQuery}
                  onChange={this.handleSearchChange}
                />
              </div>
            }
            <ul className={styles.list}>
              {this.state.searchQuery && (options.length === 0) &&
                <li className={styles.element}>{`No results matched "${this.state.searchQuery}"`}</li>
              }
              {nullable &&
              <li className={selectedItem && value === null ? styles.elementSelected : styles.element}
                onClick={() => this.handleMenuItemClick(null)}>Not selected</li>
              }
              {options.map((item, i) => {
                if (typeof item === 'object') {
                  return (
                    <li key={i}
                      onClick={() => this.handleMenuItemClick(item.value)}
                      className={selectedItem && item.value === value ? styles.elementSelected : styles.element}>
                      {item.label}
                    </li>
                  );
                } else if (typeof item === 'string') {
                  return (
                    <li key={i}
                      onClick={() => this.handleMenuItemClick(item)}
                      className={selectedItem && item.value === value ? styles.elementSelected : styles.element}>
                      {item}
                    </li>
                  );
                }
                return (
                  <li key={i}>{`Unsupported type of haystack items (${typeof item})`}</li>
                );
              })}
            </ul>
          </div>
        }
      </div>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  Select.propTypes = {
    id: PropTypes.string.isRequired,
    haystack: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
          ]).isDefined
        })
      ])
    ).isRequired,
    onChange: PropTypes.func.isRequired,
    sort: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    readonly: PropTypes.bool,
    disabled: PropTypes.bool
  };
}

export default Select;
