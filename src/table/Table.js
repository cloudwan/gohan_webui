import React, {Component} from 'react';
import {connect} from 'react-redux';


class Table extends Component {
  render() {
    console.log(this.props);
    return (
      <div>
        Table component.
      </div>
    );
  }
}

Table.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps() {
  return {
  };
}

Table.propTypes = {
  schema: React.PropTypes.object.isRequired
};
export default connect(mapStateToProps, {
})(Table);
