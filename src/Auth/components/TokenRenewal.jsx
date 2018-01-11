import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import {
  getShowTokenRenewal,
  getUserName,
  getTenant
} from './../authSelectors';

import {
  login,
  fetchTokenData,
  renewToken
} from './../authActions';


class TokenRenewal extends PureComponent {
  handleRenewTokenClick = () => {
    const password = this.pass.value;
    const userName = this.props.userName;

    this.props.renewToken(userName, password);
  };

  render() {
    const {show} = this.props;

    return (
      <div className={'pt-overlay pt-overlay-open pt-toast-container pt-toast-container-top'}>
        {show && (
          <div className={'pt-toast pt-intent-warning pt-overlay-content'}
            style={{
              left: '50%',
              transform: 'translate(-50%, 0)',
              maxWidth: 880
            }}>
            <span>
              <span className={'pt-toast-message'}>
                The token will expire in less than 5 minutes.
                Enter your password for extends token.
              </span>
              <input type={'password'} ref={input => {this.pass = input;}}/>
              <button className={'pt-button pt-intent-warning pt-minimal'}
                onClick={this.handleRenewTokenClick}>Extend</button>
            </span>
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
