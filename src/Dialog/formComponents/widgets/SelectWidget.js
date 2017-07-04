/* global window*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {Button, Menu, MenuItem} from '@blueprintjs/core';
import {asNumber} from 'react-jsonschema-form/lib/utils';

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
function processValue({type, items}, value) {
  if (type === 'array' && items && ['number', 'integer'].includes(items.type)) {
    return value.map(asNumber);
  } else if (type === 'boolean') {
    return value === 'true';
  } else if (type === 'number') {
    return asNumber(value);
  }
  return value;
}

class SelectWidget extends Component {

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
    this.props.onChange(processValue(this.props.schema, value));
    this.handleShowAndHideMenu();
  };

  handleShowAndHideMenu = () => {
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
      options,
      disabled,
      readonly,
      label,      // eslint-disable-line
      required,   // eslint-disable-line
      multiple,   // eslint-disable-line
      autofocus,  // eslint-disable-line
    } = this.props;

    let nullable = false;
    const enumOptions = options.enumOptions.filter(item => {
      if (!item.value) {
        nullable = true;

        return false;
      }
      return item.label.includes(this.state.searchQuery);
    }).sort((a, b) => a.label.localeCompare(b.label));
    const selectedItem = options.enumOptions.find(item => item.value === value);

    return (
      <div className="gohan-select-widget pt-fill" ref={ref => {this.widget = ref;}}>
        <Button text={selectedItem ? selectedItem.label : 'Nothing selected'} onClick={this.handleShowAndHideMenu}
          className={'pt-fill'} rightIconName={'caret-down'}
          disabled={disabled || readonly}
        />
        {focused &&
          <div className="options-list">
            {(options.enumOptions.length >= searchThreshold) &&
              <div className="pt-input-group pt-fill">
                <span className="pt-icon pt-icon-search"/>
                <input className="pt-input" type="text"
                  placeholder="Search input" dir="auto"
                  value={this.state.searchQuery} onChange={this.handleSearchChange}
                />
              </div>
            }
            <Menu>
              {this.state.searchQuery && (enumOptions.length === 0) &&
                <span>{`No results matched "${this.state.searchQuery}"`}</span>
              }
              {nullable &&
                <MenuItem text={'Not selected'} onClick={() => this.handleMenuItemClick(null)}/>
              }
              {enumOptions.map(({value, label}, i) => (
                <MenuItem key={i} text={label}
                  onClick={() => this.handleMenuItemClick(value)}
                  className={selectedItem && value === selectedItem.value ? 'pt-active' : ''}
                />
              ))}
            </Menu>
          </div>
        }
      </div>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  SelectWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    multiple: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
  };
}

export default SelectWidget;
