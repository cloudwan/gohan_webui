import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class SelectTenant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      id: ''
    };
  }

  componentWillMount() {
    this.setState({
      value: this.props.tenants[0].name,
      id: this.props.tenants[0].id
    });
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
  tenants: PropTypes.array.isRequired
};
