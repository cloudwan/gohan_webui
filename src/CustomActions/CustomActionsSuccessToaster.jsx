import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {getActionResult} from './CustomActionsSelectors';

import {
  clearResponse,
} from './CustomActionsActions';

import SuccessToaster from '../components/SuccessToaster';

export const CustomActionsSuccessToaster = ({
  clearResponse = '',
  result = '',
}) => (
  <SuccessToaster title='The Custom Action was Successful'
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
