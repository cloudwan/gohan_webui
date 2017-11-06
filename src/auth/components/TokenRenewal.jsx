import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import {
  getShowTokenRenewal,
  getUserName,
  getTenant
} from './../AuthSelectors';

import {
  login,
  fetchTokenData,
  renewToken
} from '../AuthActions';


class TokenRenewal extends PureComponent {
  handleRenewTokenClick = () => {
    const password = this.pass.value;
    const userName = this.props.userName;

    this.props.renewToken(userName, password);
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
          </div>
          )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    show: getShowTokenRenewal(state),
    userName: getUserName(state),
    tenant: getTenant(state)
  };
}

export default connect(mapStateToProps, {
  login,
  fetchTokenData,
  renewToken
})(TokenRenewal);
