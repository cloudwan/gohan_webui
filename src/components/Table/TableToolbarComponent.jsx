import React, {Component} from 'react';
import {Toolbar, ToolbarGroup, RaisedButton, SelectField, TextField, MenuItem} from 'material-ui';

const raisedButtonStyle = {
  margin: '8px 8px 8px 8px',
  marginRight: 'auto'
};

class TableToolbarComponent extends Component {
  constructor(props) {
    super(props);

    const {options, properties} = props;
    const optionsLen = options.length;
    let filterProperty = '';

    for (let i = 0; i < optionsLen; i += 1) {
      const item = options[i];
      const property = properties[item];

      if (property && property.view && !property.view.includes('list') || item === 'id') {
        continue;
      }

      filterProperty = item;
      break;
    }


    this.state = {
      filterProperty,
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

  render() {
    const {options, properties} = this.props;

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
            {
             options.map((item, index) => {
               const property = properties[item];

               if (property && property.view && !property.view.includes('list') || property.type !== 'string') {
                 return null;
               }
               if (item === 'id') {
                 return null;
               }

               return <MenuItem key={index} value={item}
                 primaryText={properties[item].title}
               />;
             })

            }
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
