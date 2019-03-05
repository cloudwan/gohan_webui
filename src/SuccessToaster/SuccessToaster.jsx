import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {Toaster, Position, Button} from '@blueprintjs/core';


import {/* ToasterMessage, */ToasterContent} from './components/';
import {getData, getTitle, getUrl, isHtml, getResponseFormat} from './SuccessToasterSelectors';
import {dismiss} from './SuccessToasterActions';
import {getStoragePrefix} from '../config/ConfigSelectors';

export class SuccessToaster extends Component {
  static defaultProps = {
    dismiss: () => {},
    title: '',
  };

  handleDismissClick = () => {
    this.toaster.dismiss(this.toasterKey);
    this.props.dismiss();
  };

  componentWillReceiveProps({data, title, url, responseFormat, storagePrefix}) {
    if (data || responseFormat && responseFormat.includes('websocket')) {
      this.toasterKey = this.toaster.show({
        message: (
          <div className="success-toaster-content">
            <div className="success-toaster-header">
              <h5 className="success-toaster-title">{title}</h5>
              <div className="pt-button-group pt-minimal success-toaster-dismiss">
                <Button iconName="cross"
                  onClick={this.handleDismissClick}
                />
              </div>
            </div>
            <div className="success-toaster-body">
              <ToasterContent data={data}
                url={url}
                responseFormat={responseFormat}
                storagePrefix={storagePrefix}
              />
            </div>
          </div>
        ),
        className: responseFormat === 'html' ? 'success-toaster success-toaster-big' : 'success-toaster',
        timeout: 0,
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
    dismiss: PropTypes.func,
    url: PropTypes.string,
    isHtml: PropTypes.bool,
    responseFormat: PropTypes.string
  };
}

const mapStateToProps = state => ({
  data: getData(state),
  title: getTitle(state),
  url: getUrl(state),
  isHtml: isHtml(state),
  responseFormat: getResponseFormat(state),
  storagePrefix: getStoragePrefix(state),
});

export default connect(mapStateToProps, {
  dismiss,
})(SuccessToaster);
