import React, {Component} from 'react';
import PropTypes from 'prop-types';

export class IFrame extends Component {
  componentDidMount() {
    this.updateIFrameContent();
  }

  componentDidUpdate() {
    this.updateIFrameContent();
  }

  updateIFrameContent() {
    const doc = this.iframe.contentDocument;
    doc.open('text/html', 'replace');
    doc.write(this.props.content);
    doc.close();
  }

  render() {
    return (
      <iframe ref={node => {this.iframe = node;}}
        className="gohan-iframe"
      />
    );
  }
}

export default IFrame;

IFrame.propTypes = {
  content: PropTypes.string.isRequired,
};
