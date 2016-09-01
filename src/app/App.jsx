import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {resetErrorMessage} from './../error/ErrorActions';

class App extends Component {

  handleDismissClick = event => {
    this.props.resetErrorMessage();
    event.preventDefault();
  };

  renderErrorMessage() {
    const {errorMessage} = this.props;

    if (!errorMessage) {
      return null;
    }

    return (
      <p style={{backgroundColor: '#e99', padding: 10}}>
        <b>{errorMessage}</b>
        {' '}
        (
        <a href="#"
          onClick={this.handleDismissClick}>
          Dismiss
        </a>
        )
      </p>
    );
  }

  render() {
    const {children} = this.props;

    return (
      <div>
        {this.renderErrorMessage()}
        {children}
      </div>
    );
  }
}

App.propTypes = {
  errorMessage: PropTypes.string,
  resetErrorMessage: PropTypes.func.isRequired,
  children: PropTypes.node
};

function mapStateToProps(state) {
  return {
    errorMessage: state.errorReducer,
  };
}

export default connect(mapStateToProps, {
  resetErrorMessage
})(App);
