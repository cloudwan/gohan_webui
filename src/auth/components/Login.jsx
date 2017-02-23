/* global process */
import React, {Component, PropTypes} from 'react';
import {Button} from '@blueprintjs/core';

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
      <div className="pt-card pt-elevation-3 auth-card">
        {this.props.Error}
        <form onSubmit={this.handleLoginSubmit}>
          <label className="pt-label">
            User id
            <input className="pt-input auth-input" type="text"
              ref={c => {this.userId = c;}} placeholder="Gohan user id"
            />
          </label>

          <label className="pt-label">
            Password
            <input className="pt-input auth-input" type="password"
              ref={c => {this.userPass = c;}} placeholder="Password field"
            />
          </label>
          <Button type="submit" className="pt-intent-primary auth-submit">
            Login
          </Button>
        </form>
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
