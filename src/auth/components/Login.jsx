import React, {Component, PropTypes} from 'react';
import {TextField, RaisedButton} from 'material-ui';

export default class Login extends Component {

  handleLoginSubmit = event => {
    const userId = this.userId.getValue();
    const pass = this.userPass.getValue();

    event.preventDefault();
    event.stopPropagation();

    this.props.login(userId, pass);
  };

  render() {
    return (
      <form onSubmit={this.handleLoginSubmit}>
        <TextField ref={c => {this.userId = c;}} hintText="Gohan user id"
          floatingLabelText="User id" type="text"
          fullWidth={true}
        />
        <br/>
        <TextField ref={c => {this.userPass = c;}} hintText="Password Field"
          floatingLabelText="Password" type="password"
          fullWidth={true}
        />
        <br/>
        <RaisedButton primary={true} label="Login"
          fullWidth={true} type={'submit'}
        />
      </form>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
};
