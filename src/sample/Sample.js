import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Paper} from 'material-ui';

import {clearData} from './../dynamicRoutes/DynamicActions';

const detailStyle = {
  padding: 15
};

class Sample extends Component {
  componentWillUnmount() {
    this.props.clearData();
  }

  render() {
    return (
      <Paper style={detailStyle}>
        test
      </Paper>
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
  clearData
})(Sample);
