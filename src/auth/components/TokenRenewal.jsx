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
    const mfaCode = this.mfaCode.value;
    const userName = this.props.userName;

    this.props.renewToken(userName, password, mfaCode);
  };

  render() {
    const {show} = this.props;

    return (
      <div className={'pt-overlay pt-toast-container pt-toast-container-top'}>
        {show && (
          <span>
            <div className={'pt-toast pt-overlay-content'}
              style={{
                width: 480
              }}>
              <div className="token-renewal-message-container">
                <div className="col-12" style={{marginBottom: '15px'}}>
                  <p className="token-renewal-message">
                    The token will expire in less than 5 minutes. Enter your password for extends token.
                  </p>
                </div>
                <div className="col-12" style={{marginBottom: '15px'}}>
                  <input type={'password'}
                    placeholder="Password"
                    className="form-control form-control-sm"
                    ref={input => {
                      this.pass = input;
                    }}
                  />
                </div>
                <div className="col-12" style={{marginBottom: '15px'}}>
                  <input type="text"
                    placeholder="6 digit code"
                    className="form-control form-control-sm"
                    ref={input => {
                      this.mfaCode = input;
                    }}
                  />
                </div>
                <div className="col-12">
                  <button className={'btn btn-primary btn-sm'}
                    onClick={this.handleRenewTokenClick}>Extend</button>
                </div>
              </div>
            </div>
          </span>
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
