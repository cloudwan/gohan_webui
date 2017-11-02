import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import {
  getShowTokenRenewal,
  getUserName
} from './../AuthSelectors';

import {
  hideTokenRenewal,
  waitForTokenExpire,
  login
} from '../AuthActions';


class TokenRenewal extends PureComponent {
  componentDidMount() {
    this.props.waitForTokenExpire();
  }

  handleRenewTokenClick = () => {
    const password = this.pass.value;
    const userName = this.props.userName;

    this.props.login(userName, password);
  };

  render() {
    const {show} = this.props;

    return (
      <div style={{
        position: 'absolute',
        zIndex: 999999,
        left: '50%',
        transform: 'translate(-50%, 0)',
        background: 'yellow'
      }}>
        {show && (
          <div>
            <span>Token renewal component</span>
            <input type={'password'} ref={input => {this.pass = input;}}/>
            <button onClick={this.handleRenewTokenClick}>renew</button>
            <span>{ show.toString() } </span>
          </div>
          )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    show: getShowTokenRenewal(state),
    userName: getUserName(state)
  };
}

export default connect(mapStateToProps, {
  waitForTokenExpire,
  hideTokenRenewal,
  login
})(TokenRenewal);
