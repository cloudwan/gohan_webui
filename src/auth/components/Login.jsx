import React, {Component, PropTypes} from 'react';

export default class Login extends Component {

  handleLoginSubmit = event => {
    const userId = this.userId.value;
    const pass = this.userPass.value;

    event.preventDefault();
    event.stopPropagation();

    this.props.login(userId, pass);
  };

  render() {
    return (
      <form onSubmit={this.handleLoginSubmit}>
        <input ref={c => {this.userId = c;}} placeholder="user id"/>
        <br/>
        <input ref={c => {this.userPass = c;}} placeholder="password"
          type="password"
        />
        <br/>
        <button>Login</button>
      </form>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
};
