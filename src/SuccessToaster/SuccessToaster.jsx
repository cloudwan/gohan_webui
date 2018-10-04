import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Inspector} from 'react-inspector';

import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import {Toaster, Position} from '@blueprintjs/core';

import {getData, getTitle} from './SuccessToasterSelectors';
import {dismiss} from './SuccessToasterActions';

export class SuccessToaster extends Component {
  static defaultProps = {
    dismiss: () => {},
    title: '',
  }

  handleDismissClick = () => {
    this.props.dismiss();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      this.toaster.show({
        message: (<div style={{
          overflow: 'auto',
          maxWidth: 480,
          minWidth: 480,
          maxHeight: '50vh',
          position: 'relative'
        }}>
          <h5 className="custom-action-success">{nextProps.title}</h5>
          {typeof nextProps.data === 'object' && (
            <Inspector data={nextProps.data}/>
          )}
          {typeof nextProps.data !== 'object' && (
            <CodeMirror value={nextProps.data}
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
    data: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string
    ]),
    title: PropTypes.string,
    dismiss: PropTypes.func
  };
}

const mapStateToProps = state => ({
  data: getData(state),
  title: getTitle(state),
});

export default connect(mapStateToProps, {
  dismiss,
})(SuccessToaster);
