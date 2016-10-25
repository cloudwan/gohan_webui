import React, {Component, PropTypes} from 'react';
import {SelectField, MenuItem, RaisedButton} from 'material-ui';

export default class SelectTenant extends Component {

  constructor(params) {
    super(params);

    this.state = {
      value: null
    };
  }

  handleSelectTenantSubmit = event => {
    event.preventDefault();
    event.stopPropagation();

    this.props.onTenantSubmit(this.state.value);
  };

  handleTenantChange = (event, index, value) => this.setState({value});

  render() {
    return (
      <form onSubmit={this.handleSelectTenantSubmit}>
        <SelectField floatingLabelText="Select tenant" value={this.state.value}
          onChange={this.handleTenantChange} fullWidth={true}>
          {
            this.props.tenants.map(
              (tenant, key) => (
                <MenuItem value={tenant.name} key={key}
                  primaryText={tenant.name}
                />
              )
            )
          }
        </SelectField>
        <br/>
        <RaisedButton primary={true} label="Select Tenant"
          fullWidth={true} type={'submit'}
          disabled={!this.state.value}
        />
      </form>
    );
  }
}

SelectTenant.propTypes = {
  onTenantSubmit: PropTypes.func.isRequired,
};
