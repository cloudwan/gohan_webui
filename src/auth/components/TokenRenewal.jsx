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
      <div className={'pt-overlay pt-toast-container pt-toast-container-top'}>
        {show && (
          <span>
            <div className={'pt-toast pt-overlay-content'}
              style={{
                width: 480
              }}>
              <div className="form-row align-items-center token-renewal-message-container">
                <div className="col-6">
                  <p className="token-renewal-message">The token will expire in less than 5 minutes.
                  Enter your password for extends token.</p>
                </div>
                <div className="col-4">
                  <input type={'password'} className="form-control form-control-sm"
                    ref={input => { this.pass = input; }}
                  />
                </div>
                <div className="col-2">
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
