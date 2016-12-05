import React, {Component, PropTypes} from 'react';

const errorStyle = {
  backgroundColor: '#e9e9e9',
  color: '#d50000',
  padding: 15,
  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  zIndex: 10000,
  position: 'relative',
  width: '100%',
  fontFamily: 'Roboto, sans-serif',
  boxSizing: 'border-box'
};

export default class Alert extends Component {
  handleDismissClick = () => {
    this.props.dismissClick();
  };

  render() {
    const {message} = this.props;

    return (
      <div style={errorStyle}>
        <div style={{textAlign: 'left', fontSize: 16}}>
          {message}
        </div>
        <div style={{textAlign: 'right', fontSize: 12, fontWeight: 600}}>
          <a href="#" onClick={this.handleDismissClick}
            style={{textDecoration: 'none', color: errorStyle.color}}>
            DISMISS
          </a>
        </div>
      </div>
    );
  }
}

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  dismissClick: PropTypes.func.isRequired
};
