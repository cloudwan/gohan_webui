import React, {Component} from 'react';
import {Toolbar, ToolbarGroup, RaisedButton, SelectField, TextField, MenuItem} from 'material-ui';

const raisedButtonStyle = {
  margin: '8px 8px 8px 8px',
  marginRight: 'auto'
};

class TableToolbarComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterProperty: props.filterProperties[0],
      filterValue: ''
    };
  }

  filterTimeoutId = null;

  filterData = () => {
    let value = this.state.filterValue;
    const property = this.state.filterProperty;

    if (value === undefined || value === '') {
      value = null;
    }

    const filters = {};
    filters[property] = value;

    this.props.filterData(filters);
  };

  handleMenuItemSelected = (event, index, filterProperty) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({filterProperty}, this.filterData);
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
    }, 2000);

  };

  buildSelectOptions = () => {
    const {filterProperties, properties} = this.props;

    return filterProperties.map((item, index) => {
      return <MenuItem key={index} value={item}
        primaryText={properties[item].title}
      />;
    });
  };

  render() {
    return (
      <Toolbar>
        <ToolbarGroup>
          <RaisedButton onClick={this.props.handleOpenModal}
            label={'Add new ' + this.props.singular}
            style={raisedButtonStyle}
            primary={true}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <SelectField floatingLabelText={'Filter by'} value={this.state.filterProperty}
            onChange={this.handleMenuItemSelected}>
            {this.buildSelectOptions()}
          </SelectField>
          <TextField floatingLabelText={'Search'} value={this.state.filterValue}
            onChange={this.handleSearchChange}
          />
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

export default TableToolbarComponent;
