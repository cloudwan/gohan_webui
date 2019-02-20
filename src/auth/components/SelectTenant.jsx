import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class SelectTenant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      tenantFilter: false,
    };
  }

  componentWillMount() {
    const {isAdmin, useDomain, tenantsByDomain} = this.props;
    const domains = Object.keys(this.props.tenantsByDomain);
    if (domains && domains.length > 0) {
      if (isAdmin && useDomain) {
        this.setState({id: 'all'});
      } else {
        const tenants = tenantsByDomain[domains[0]].tenants;
        this.setState({
          id: tenants[0].id
        });
      }
    }
  }

  handleSelectTenantSubmit = event => {
    let tenantName = '';

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.state.id !== 'all') {
      const tenant = Object.keys(this.props.tenantsByDomain)
        .reduce((result, domainId) => result.concat(this.props.tenantsByDomain[domainId].tenants), [])
        .find(tenant => tenant.id.toLowerCase() === this.state.id.toLowerCase());

      tenantName = tenant && tenant.name ? tenant.name : '';
    } else if (this.state.id === 'all') {
      tenantName = 'All';
    }

    this.props.onTenantSubmit(tenantName, this.state.id, this.state.tenantFilter);
  };

  handleTenantChange = event => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({id: event.target.value});
  };

  handleFilterTenantStatusChange = () => {
    this.setState({tenantFilter: !this.state.tenantFilter});
  };

  buildSelectOptions = () => {
    const {tenantsByDomain, useDomain, isAdmin} = this.props;
    const domains = Object.keys(tenantsByDomain);

    const initialValue = isAdmin && useDomain ?
      [<option value={'all'} key='all'>{'All'}</option>] :
      [];

    const selectOptions = domains.reduce((result, domainId) => {
      const domain = tenantsByDomain[domainId];
      if (domain.tenants.length > 0) {
        if (domains.length > 1) {
          result.push(
            <optgroup label={domain.name} key={domainId}>
              {domain.tenants.map(tenant => (
                <option value={tenant.id} key={tenant.id}>{tenant.name}</option>
              ))}
            </optgroup>
          );
        } else {
          domain.tenants.forEach(tenant => {
            result.push(<option value={tenant.id} key={tenant.id}>{tenant.name}</option>);
          });
        }

        return result;
      }
    }, initialValue);

    return selectOptions;
  };

  render() {
    return (
      <div className="auth-container d-flex justify-content-center align-items-center">
        <div className="auth-box">
          <form className="auth-body" onSubmit={this.handleSelectTenantSubmit}>
            <h3 className="card-title text-center">{`Hello ${this.props.username}!`}</h3>
            <p className="card-subtitle mb-2 text-muted text-center">Select a Tenant</p>
            {this.props.Error}
            <div className="form-group">
              <select className="form-control" onChange={this.handleTenantChange}
                defaultValue={''}>
                {this.buildSelectOptions()}
              </select>
            </div>
            {!this.props.useDomain && (
              <div className="form-group">
                <div className="checkbox enable-tenant-filter">
                  <label className="pt-control pt-checkbox pt-inline">
                    <input type="checkbox" onChange={this.handleFilterTenantStatusChange}
                      checked={this.state.tenantFilter}
                    />
                    <span className="pt-control-indicator" />
                    Filter resources by tenant
                  </label>
                  <p className="form-text text-muted">(Modifiable after login too)</p>
                </div>
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-block">
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }
}

SelectTenant.propTypes = {
  onTenantSubmit: PropTypes.func.isRequired,
  tenantsByDomain: PropTypes.object.isRequired,
  useDomain: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};
