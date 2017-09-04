import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import CodeMirror from 'react-codemirror';
import 'codemirror/mode/yaml/yaml';
import {Toaster, Position} from '@blueprintjs/core';

import {getActionResultYAML} from './CustomActionsSelectors';

import {
  clearResponse,
} from './CustomActionsActions';

export class CustomActionsSuccessToaster extends Component {

  handleDismissClick = () => {
    this.props.clearResponse();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.actionResultYAML) {
      this.toaster.show({
        message: (<div style={{
          maxWidth: 415,
          minWidth: 215,
          maxHeight: '50vh',
          position: 'relative'
        }}>
          <span>Custom action success:</span>
          <CodeMirror value={nextProps.actionResultYAML}
            options={{
                        mode: 'yaml',
                        readOnly: true,
                        cursorBlinkRate: -1
                      }}
          />
        </div>),
        className: 'pt-intent-success',
        iconName: 'tick',
        timeout: 0,
        onDismiss: this.handleDismissClick
      });
    }
  }

  render() {
    return (
      <Toaster position={Position.TOP}
        ref={ref => {this.toaster = ref;}}
        dismiss={0}
      />
    );
  }
}

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
