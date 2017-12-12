/* global document */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {getInitialDocTitle} from '../breadcrumb/breadcrumbSelectors';

export class Sample extends Component {
  componentDidMount() {
    const {initialDocTitle} = this.props;

    if (initialDocTitle && initialDocTitle.length > 0) {
      document.title = `Sample | ${initialDocTitle}`;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialDocTitle && (nextProps.initialDocTitle !== this.props.initialDocTitle)) {
      document.title = `Sample | ${nextProps.initialDocTitle}`;
    }
  }

  static onEnter() {
    console.log('onEnter');
  }

  static onLeave() {
    console.log('onLeave');
  }

  render() {
    return (
      <div className="sample-view">
        <h2>Sample Gohan webUI Component.</h2>
      </div>
    );
  }
}

Sample.contextTypes = {
};

Sample.propTypes = {
};

function mapStateToProps(state) {
  return {
    initialDocTitle: getInitialDocTitle(state)
  };
}

export default connect(mapStateToProps, {
})(Sample);
