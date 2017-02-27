import React, {Component} from 'react';
import {connect} from 'react-redux';

export class Sample extends Component {
  static onEnter() {
    console.log('onEnter');
  }

  static onLeave() {
    console.log('onLeave');
  }

  render() {
    return (
      <div className="pt-card pt-elevation-3 detail">
        <h2>Sample Gohan webUI Component.</h2>
      </div>
    );
  }
}

Sample.contextTypes = {
};

Sample.propTypes = {
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
})(Sample);
