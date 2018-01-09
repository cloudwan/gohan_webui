import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {getActionResult} from './../customActionsSelectors';

import {
  clearResponse,
} from './../customActionsActions';

import SuccessToaster from './../../components/SuccessToaster';

export const CustomActionsSuccessToaster = ({
  clearResponse = '',
  result = '',
}) => (
  <SuccessToaster title='Custom action success:'
    onDismiss={clearResponse}
    result={result}
  />
);

if (process.env.NODE_ENV !== 'production') {
  CustomActionsSuccessToaster.propTypes = {
    result: PropTypes.object,
    clearResponse: PropTypes.func
  };
}

const mapStateToProps = state => ({
  result: getActionResult(state)
});

export default connect(mapStateToProps, {
  clearResponse,
})(CustomActionsSuccessToaster);
