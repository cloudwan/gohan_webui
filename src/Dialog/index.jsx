import React, {Component} from 'react';
import {connect} from 'react-redux';
import {isOpen} from './DialogSelectors';

const dialog = defaults => {
  const {
    name
  } = defaults;

  return WrappedComponent => {
    class Dialog extends Component {
      render() {
        const {isOpen} = this.props;

        if (!isOpen) {
          return null;
        }

        return (
          <div>
            <WrappedComponent {...this.props} />
          </div>
        );
      }
    }

    const mapStateToProps = state => (
      {
        isOpen: isOpen(state, name)
      }
    );

    return connect(mapStateToProps)(Dialog);
  };
};

export default dialog;
