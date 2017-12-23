import React, {Component} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import {Inspector} from 'react-inspector';

import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import {Toaster, Position} from '@blueprintjs/core';

export class SuccessToaster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDetailOpen: false
    };
  }

  static defaultProps = {
    title: '',
    result: '',
    onDismiss: () => {},
  };

  handleDetailOpenToggle = () => this.setState(prevState => ({
    isDetailOpen: !prevState.isDetailOpen,
  }));

  handleDismissClick = () => {
    this.props.onDismiss();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.result && !isEqual(nextProps.result,this.props.result)) {
      this.toaster.show({
        message: (<div style={{
          overflow: 'auto',
          maxWidth: 480,
          minWidth: 480,
          maxHeight: '50vh',
          position: 'relative'
        }}>
          <h5 className="custom-action-success">{nextProps.title}</h5>
          {typeof nextProps.result === 'object' && (
            <Inspector data={nextProps.result}/>
          )}
          {typeof nextProps.result !== 'object' && (
            <CodeMirror value={nextProps.result}
              className="toaster-codemirror"
              options={{
                mode: 'javascript',
                theme: 'base16-light',
                readOnly: true,
                cursorBlinkRate: -1
               }}
            />
          )}
        </div>),
        className: 'success-toaster',
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
    result: PropTypes.oneOf(
      PropTypes.object,
      PropTypes.string
    ),
    onDismiss: PropTypes.func,
  };
}

export default SuccessToaster;
