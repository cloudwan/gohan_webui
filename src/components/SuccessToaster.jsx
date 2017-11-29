import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CodeMirror from 'react-codemirror';
import 'codemirror/mode/yaml/yaml';
import {Toaster, Position} from '@blueprintjs/core';

export class SuccessToaster extends Component {
  static defaultProps = {
    title: '',
    resultYAML: '',
    onDismiss: () => {},
  };

  handleDismissClick = () => {
    this.props.onDismiss();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.resultYAML && nextProps.resultYAML !== this.props.resultYAML) {
      this.toaster.show({
        message: (<div style={{
          maxWidth: 415,
          minWidth: 215,
          maxHeight: '50vh',
          position: 'relative'
        }}>
          <span>{nextProps.title}</span>
          <CodeMirror value={nextProps.resultYAML}
            className="toaster-codemirror"
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
        onDismiss: this.handleDismissClick,
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
  SuccessToaster.propTypes = {
    title: PropTypes.string,
    resultYAML: PropTypes.string,
    onDismiss: PropTypes.func,
  };
}

export default SuccessToaster;
