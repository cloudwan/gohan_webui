import React, {Component} from 'react';
import {connect} from 'react-redux';


class Detail extends Component {
  render() {
    console.log(this.props);
    return (
      <div>
        Detail View
      </div>
    );
  }
}

Detail.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {
  };
}

export default connect(mapStateToProps, {
})(Detail);
