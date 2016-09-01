import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {resetErrorMessage} from './../error/ErrorActions';
import {fetchSchema} from './../schema/SchemaActions';
import SidebarMenu from './components/SidebarMenu';
import SidebarMenuItem from './components/SidebarMenuItem';

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

  componentWillMount() {
    this.props.fetchSchema();
  }

  render() {
    const {children} = this.props;
    const sidebarMenuItems = [];

    if (this.props.schemaReducer !== undefined) {
      this.props.schemaReducer.forEach((item, index) => {
        if (!item.parent && item.metadata.type !== 'metaschema') {
          sidebarMenuItems.push(
            <SidebarMenuItem title={item.title} url={item.url}
              description={item.description} key={index}
            />
          );
        }
      });
    }
    return (
      <div>
        {this.renderErrorMessage()}
        <SidebarMenu>
          {sidebarMenuItems}
        </SidebarMenu>
        {children}
      </div>
    );
  }
}

App.propTypes = {
  errorMessage: PropTypes.string,
  schemaReducer: PropTypes.array,
  resetErrorMessage: PropTypes.func.isRequired,
  children: PropTypes.node
};

function mapStateToProps(state) {
  return {
    errorMessage: state.errorReducer,
    schemaReducer: state.schemaReducer
  };
}

export default connect(mapStateToProps, {
  resetErrorMessage,
  fetchSchema
})(App);
