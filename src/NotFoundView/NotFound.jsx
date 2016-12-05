import React, {Component} from 'react';
import {Paper} from 'material-ui';

const detailStyle = {
  padding: 15
};

export default class NotFound extends Component {
  render() {
    return (
      <Paper style={detailStyle}>
        <p style={{fontWeight: 'bold'}}>Occurred, a 404 error has...</p>
        <p>Lost a page i have. How embarrassing...</p>
      </Paper>
    );
  }
}
