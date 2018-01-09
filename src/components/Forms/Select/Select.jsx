/* global window, document*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Portal from 'react-portal';

import styles from './styles.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.css';

class Select extends Component {
  static defaultProps = {
    sort: false,
    disabled: false,
    readonly: false,
    nullable: false,
    value: undefined
  };

  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      searchQuery: '',
      left: 0,
      top: 0,
      width: 0
    };
  }

  componentWillMount() {
    window.addEventListener('keydown', this.handleKeydown, false);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown, false);
  }

  handleKeydown = event => {
    if (this.state.focused) {
      if (event.key === 'Tab') {
        this.handleBlur();
      }
    }
  };

  handleMenuItemClick = value => {
    if (Array.isArray(this.props.value)) {
      const newValues = this.props.value.slice();

      if (newValues.includes(value)) {
        this.props.onChange(newValues.filter(item => item !== value));
      } else {
        newValues.push(value);
        this.props.onChange(newValues);
      }
    } else {
      this.props.onChange(value);
    }

    this.setState({focused: !this.state.focused, searchQuery: ''});
  };

  handleShowAndHideMenu = event => {
    const bodyRect = document.body.getBoundingClientRect();
    const targetRect = event.target.getBoundingClientRect();
    const bottomMargin = 15;

    event.stopPropagation();
    event.preventDefault();

    this.setState({
      focused: !this.state.focused,
      searchQuery: '',
      maxHeight: bodyRect.height - targetRect.bottom - bottomMargin,
      top: targetRect.bottom - bodyRect.top,
      left: targetRect.left - bodyRect.left,
      width: targetRect.width
    });
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
      readonly,
      isInvalid,
      nullable
    } = this.props;

    let options = haystack.filter(item => {
      if (typeof item === 'object') {
        if (item.value === null) {
          return false;
        }

        return item.label.includes(this.state.searchQuery);
      } else if (typeof item === 'string') {
        if (item === null) {
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

    let selectedItem = '';

    if (Array.isArray(value) && value.length !== 0) {
      selectedItem = value.map(item => haystack.find(
        hay => {
          if (typeof hay === 'object') {
            return hay.value === item;
          } else if (typeof hay === 'string') {
            return hay === item;
          }
        }
      ).label).reduce((result, item) => `${result}, ${item}`);
    } else {
      selectedItem = haystack.find(item => {
        if (typeof item === 'object') {
          return item.value === value;
        } else if (typeof item === 'string') {
          return item === value;
        }
      });
    }

    return (
      <div className={`${styles.select} ${bootstrap['form-control']} \
      ${styles.singleBorder} ${isInvalid ? bootstrap['is-invalid'] : ''}`}
        ref={ref => {this.widget = ref;}}>
        <button disabled={disabled || readonly}
          className={styles.button}
          onClick={this.handleShowAndHideMenu}>
          {selectedItem ? selectedItem.label || selectedItem : 'Nothing selected'}
        </button>
        {focused &&
          <Portal closeOnOutsideClick={true}
            onClose={this.handleBlur}
            isOpened={focused}>
            <div style={{
              left: this.state.left,
              top: this.state.top,
              width: this.state.width,
              maxHeight: this.state.maxHeight
            }}
              className={styles.options}>
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
                  <li className={styles.elementNotFound}>{`No results matched "${this.state.searchQuery}"`}</li>
                }
                {nullable &&
                <li className={!selectedItem && !value ? styles.elementSelected : styles.element}
                  onClick={() => this.handleMenuItemClick(null)}>Not selected</li>
                }
                {options.map((item, i) => {
                  if (typeof item === 'object') {
                    return (
                      <li key={i}
                        onClick={() => this.handleMenuItemClick(item.value)}
                        className={
                          selectedItem && (
                            item.value === value || (Array.isArray(value) && value.includes(item.value))
                          ) ? styles.elementSelected : styles.element
                        }>
                        {item.label}
                      </li>
                    );
                  } else if (typeof item === 'string') {
                    return (
                      <li key={i}
                        onClick={() => this.handleMenuItemClick(item)}
                        className={
                          selectedItem && (item === value || (Array.isArray(value) && value.includes(item))) ?
                            styles.elementSelected : styles.element
                        }>
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
          </Portal>
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
    nullable: PropTypes.bool,
    sort: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.array
    ]),
    readonly: PropTypes.bool,
    disabled: PropTypes.bool
  };
}

export default Select;
