import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class IFrame extends Component {
  componentDidMount() {
    const {authToken} = this.props;

    document.cookie = `Auth-Token=${authToken}; path=/`; // eslint-disable-line no-undef
  }

  render() {
    const {src} = this.props;
    return (
      <iframe className="gohan-iframe"
        src={src}
      />
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  IFrame.propTypes = {
    src: PropTypes.string.isRequired,
  };
}
