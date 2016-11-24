import React, {Component, PropTypes} from 'react';
import {TextField, RaisedButton} from 'material-ui';

export default class Login extends Component {

  handleLoginSubmit = event => {
    event.preventDefault();
    event.stopPropagation();

    const userId = this.userId.getValue();
    const pass = this.userPass.getValue();

    this.props.onLoginSubmit(userId, pass);
  };

  render() {
    return (
      <form onSubmit={this.handleLoginSubmit}>
        <TextField ref={c => {this.userId = c;}} hintText="Gohan user id"
          floatingLabelText="User id"
          fullWidth={true}
          autoFocus={true}
        />
        <TextField ref={c => {this.userPass = c;}} hintText="Password Field"
          floatingLabelText="Password" type="password"
          fullWidth={true}
        />
        <RaisedButton primary={true} label="Login"
          fullWidth={true} type={'submit'}
        />
      </form>
    );
  }
}

Login.propTypes = {
  onLoginSubmit: PropTypes.func.isRequired
};
