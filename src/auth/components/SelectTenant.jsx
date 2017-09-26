import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button} from '@blueprintjs/core';

export default class SelectTenant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      id: ''
    };
  }

  handleSelectTenantSubmit = event => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.props.onTenantSubmit(this.state.value, this.state.id);
  };

  handleTenantChange = event => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({
      value: event.target.value,
      id: this.props.tenants.find(item => item.name === event.target.value).id
    });
  };

  buildSelectOptions = () => {
    return this.props.tenants.map(
      tenant => {
        return <option value={tenant.name} key={tenant.id}>{tenant.name}</option>;
      }
    );
  };


  render() {
    return (
      <div className="pt-card pt-elevation-3 auth-card">
        {this.props.Error}
        <form onSubmit={this.handleSelectTenantSubmit}>
          <label className="pt-label">
              Select tenant
            <div className="pt-select pt-large">
              <select onChange={this.handleTenantChange}
                defaultValue={''}>
                <option value={''} />
                {this.buildSelectOptions()}
              </select>
            </div>
          </label>

          <Button type="submit" className="pt-intent-primary auth-submit"
            disabled={!this.state.value}>
            Select tenant
          </Button>
        </form>
      </div>
    );
  }
}

SelectTenant.propTypes = {
  onTenantSubmit: PropTypes.func.isRequired,
  tenants: PropTypes.array.isRequired
};
