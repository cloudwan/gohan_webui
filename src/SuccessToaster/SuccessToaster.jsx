import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Inspector} from 'react-inspector';

import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import {Toaster, Position, Button} from '@blueprintjs/core';

import IFrame from '../components/IFrame';

import {getData, getTitle, getFormat} from './SuccessToasterSelectors';
import {dismiss} from './SuccessToasterActions';

export class SuccessToaster extends Component {
  static defaultProps = {
    dismiss: () => {},
    title: '',
  }

  handleDismissClick = () => {
    this.toaster.dismiss(this.toasterKey);
    this.props.dismiss();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      this.toasterKey = this.toaster.show({
        message: (<div style={{
          overflow: 'auto',
          maxWidth: 480,
          minWidth: 480,
          maxHeight: '50vh',
          position: 'relative'
        }}>
          <div className="success-toaster-header">
            <h5 className="success-toaster-title">{nextProps.title}</h5>
            <div className="pt-button-group pt-minimal success-toaster-dismiss">
              <Button iconName="cross"
                onClick={this.handleDismissClick}
              />
            </div>
          </div>
          {this.renderToasterContent(nextProps.data, nextProps.format)}
        </div>),
        className: 'success-toaster',
        timeout: 0,
      });
    }
  }

  renderToasterContent = (data, format) => {
    if (format === 'html') {
      return (
        <IFrame content={data}/>
      );
    }

    if (!format) {
      if (typeof data === 'object') {
        return (
          <Inspector data={data}/>
        );
      } else if (typeof data !== 'object') {
        return (
          <CodeMirror value={data}
            className="toaster-codemirror"
            options={{
              mode: 'javascript',
              theme: 'base16-light',
              readOnly: true,
              cursorBlinkRate: -1
            }}
          />
        );
      }
    }

    return null;
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
    dismiss: PropTypes.func,
    format: PropTypes.string,
  };
}

const mapStateToProps = state => ({
  data: getData(state),
  title: getTitle(state),
  format: getFormat(state),
});

export default connect(mapStateToProps, {
  dismiss,
})(SuccessToaster);
