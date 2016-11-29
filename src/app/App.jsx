/*global VERSION*/

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {AppBar} from 'material-ui';
import {resetErrorMessage} from './../error/ErrorActions';
import {fetchSchema} from './../schema/SchemaActions';
import SidebarMenu from './components/SidebarMenu';
import Alert from './../alert/Alert';

const contentStyle = {
  paddingTop: 64,
  minHeight: 400,
  paddingLeft: 256
};

const appBar = {
  position: 'fixed',
  top: 0
};

class App extends Component {

  componentWillMount() {
    this.props.fetchSchema();

    console.log('Gohan version:', VERSION.version, ', repo tag:', VERSION.tag);
  }

  handleDismissClick = event => {
    if (event) {
      event.preventDefault();
    }
    this.props.resetErrorMessage();
  };

  renderErrorMessage() {
    const {errorMessage} = this.props;

    if (!errorMessage) {
      return null;
    }

    return (
      <Alert message={errorMessage} dismissClick={this.handleDismissClick} />
    );
  }

  render() {
    const {children} = this.props;

    return (
      <div>
        {this.renderErrorMessage()}
        <SidebarMenu schemaReducer={this.props.schemaReducer}/>
        <AppBar style={appBar} title="Gohan webui" />
        <div style={contentStyle}>
          {children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  errorMessage: PropTypes.string,
  schemaReducer: PropTypes.object,
  children: PropTypes.node
};

function mapStateToProps(state) {
  return {
    errorMessage: state.errorReducer,
    resetErrorMessage: PropTypes.func.isRequired,
    schemaReducer: state.schemaReducer
  };
}

export default connect(mapStateToProps, {
  resetErrorMessage,
  fetchSchema
})(App);
