import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button} from '@blueprintjs/core';

class TableToolbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterProperty: props.filterBy || props.filterProperties[0],
      filterValue: props.filterValue || ''
    };
  }

  filterTimeoutId = null;

  filterData = () => {
    let value = this.state.filterValue;
    const property = this.state.filterProperty;

    if (value === undefined || value === '') {
      this.props.filterData(undefined);
      return;
    }

    const filters = {};
    filters[property] = value;

    this.props.filterData(filters);
  };

  handleMenuItemSelected = event => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({filterProperty: event.target.value}, () => {
      if (this.state.filterValue) {
        this.filterData();
      }
    });
  };

  handleSearchChange = event => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    clearTimeout(this.filterTimeoutId);

    this.setState({filterValue: event.target.value});

    this.filterTimeoutId = setTimeout(() => {
      this.filterData();
    }, 500);

  };

  handleRemoveClick = () => {
    this.props.deleteMultipleResources();
  };

  buildSelectOptions = () => {
    const {filterProperties, properties} = this.props;

    return filterProperties.map((item, index) => {
      return <option key={index} value={item}>{properties[item].title}</option>;
    });
  };

  render() {
    return (
      <div>
        <div className="pt-navbar-group pt-align-left">
          <Button className="pt-intent-primary" iconName="add"
            text={'New ' + this.props.newResourceTitle}
            onClick={this.props.handleOpenModal}
          />
          <Button iconName="trash" text={'Delete selected'}
            onClick={this.handleRemoveClick} disabled={this.props.buttonDeleteSelectedDisabled}
          />
        </div>
        <div className="pt-navbar-group pt-align-right">
          <div className="pt-control-group">
            <div className="pt-select">
              <select value={this.state.filterProperty}
                onChange={this.handleMenuItemSelected}>
                {this.buildSelectOptions()}
              </select>
            </div>
            <div className="pt-input-group">
              <span className="pt-icon pt-icon-search"/>
              <input type="text" className="pt-input"
                placeholder="Search" onChange={this.handleSearchChange}
                value={this.state.filterValue}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TableToolbar.propTypes = {
  handleOpenModal: PropTypes.func.isRequired,
  filterValue: PropTypes.string.isRequired,
  filterBy: PropTypes.string.isRequired,
  newResourceTitle: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  filterData: PropTypes.func.isRequired,
  filterProperties: PropTypes.array.isRequired,
  deleteMultipleResources: PropTypes.func.isRequired,
  buttonDeleteSelectedDisabled: PropTypes.bool.isRequired,
  properties: PropTypes.object.isRequired
};

export default TableToolbar;
