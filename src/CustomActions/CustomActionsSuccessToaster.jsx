import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {getActionResultYAML} from './CustomActionsSelectors';

import {
  clearResponse,
} from './CustomActionsActions';

import SuccessToaster from '../components/SuccessToaster';

export const CustomActionsSuccessToaster = ({
  clearResponse = '',
  actionResultYAML = () => {},
}) => (
  <SuccessToaster title='Custom action success:'
    onDismiss={clearResponse}
    responseYAML={actionResultYAML}
  />
);

if (process.env.NODE_ENV !== 'production') {
  CustomActionsSuccessToaster.propTypes = {
    actionResultYAML: PropTypes.string,
    clearResponse: PropTypes.func
  };
}

const mapStateToProps = state => ({
  actionResultYAML: getActionResultYAML(state)
});

export default connect(mapStateToProps, {
  clearResponse,
})(CustomActionsSuccessToaster);
