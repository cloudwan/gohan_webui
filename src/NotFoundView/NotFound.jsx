/* global document */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {getInitialDocTitle} from './../Breadcrumbs/breadcrumbSelectors';

export class NotFound extends Component {
  componentDidMount() {
    const {initialDocTitle} = this.props;

    if (initialDocTitle && initialDocTitle.length > 0) {
      document.title = `Page not found | ${initialDocTitle}`;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialDocTitle && (nextProps.initialDocTitle !== this.props.initialDocTitle)) {
      document.title = `Page not found | ${nextProps.initialDocTitle}`;
    }
  }

  render() {
    return (
      <div className="pt-card pt-elevation-3">
        <h2>Occurred, a 404 error has...</h2>
        <p>Lost a page i have. How embarrassing...</p>
      </div>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  NotFound.propTypes = {
    initialDocTitle: PropTypes.string
  };
}

export const mapStateToProps = state => ({
  initialDocTitle: getInitialDocTitle(state)
});

export default connect(mapStateToProps)(NotFound);
