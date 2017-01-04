import React, {Component, PropTypes} from 'react';
import {Button} from '@blueprintjs/core';

export default class LoginBp extends Component {
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
      <form onSubmit={this.handleLoginSubmit}>
        <label className="pt-label">
          User id
          <input className="pt-input" type="text"
            ref={c => {this.userId = c;}} placeholder="Gohan user id"
          />
        </label>

        <label className="pt-label">
          Password
          <input className="pt-input" type="password"
            ref={c => {this.userPass = c;}} placeholder="Password field"
          />
        </label>
        <Button type="submit">Login</Button>
      </form>
    );
  }
}

LoginBp.propTypes = {
  onLoginSubmit: PropTypes.func.isRequired
};
