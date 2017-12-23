import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Login extends Component {
  handleLoginSubmit = event => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const userId = this.userId.value;
    const pass = this.userPass.value;

    this.props.onLoginSubmit(userId, pass);
  };

  render() {
    return (
      <div className="auth-container d-flex justify-content-center align-items-center">
        <div className="auth-box">
          <form className="auth-body" onSubmit={this.handleLoginSubmit}>
            <h3 className="text-center">Gohan Web UI</h3>
            <p className="mb-2 text-muted text-center">Web UI for Gohan project</p>
            {this.props.Error}
            <div className="form-group">
              <input className="form-control" type="text"
                ref={c => { this.userId = c; }} placeholder="User ID"
              />
            </div>
            <div className="form-group">
              <input className="form-control" type="password"
                ref={c => { this.userPass = c; }} placeholder="Password"
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  onLoginSubmit: PropTypes.func.isRequired
};

if (process.env.NODE_ENV !== 'production') {
  Login.propTypes = {
    onLoginSubmit: PropTypes.func.isRequired,
    Error: PropTypes.element
  };
}
