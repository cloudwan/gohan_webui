import React, {Component, PropTypes} from 'react';
import {Provider} from 'react-redux';
import Routes from '../routes/Routes';

export default class Root extends Component {

  render() {
    const {store, history} = this.props;

    return (
      <Provider store={store}>
        <Routes history={history} store={store} />
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
