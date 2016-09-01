import React, {Component, PropTypes} from 'react';

export default class SelectTenant extends Component {

  handleSelectTenantSubmit = event => {
    event.preventDefault();
    event.stopPropagation();

    this.props.onTenantSubmit(this.tenant.value);
  };

  render() {
    return (
      <form onSubmit={this.handleSelectTenantSubmit}>
        <select ref={c => {this.tenant = c;}}>
          {this.props.tenants.map((tenant, key) => <option value={tenant.name} key={key}>{tenant.name}</option>)}
        </select>
        <br/>
        <button>Select Tenant</button>
      </form>
    );
  }
}

SelectTenant.propTypes = {
  onTenantSubmit: PropTypes.func.isRequired,
};
