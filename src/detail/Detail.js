import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {clearData} from './../dynamicRoutes/DynamicActions';

class Detail extends Component {

  componentWillUnmount() {
    this.props.clearData();
  }

  render() {
    const {schema} = this.props.schema;
    const {data} = this.props;

    if (this.props.isLoading && typeof this.props.data !== 'object') {
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div>
        {schema.propertiesOrder.map((key, index) => {
          const property = schema.properties[key];
          const propertyValue = data[key];

          if (property.view && !property.view.includes('detail')) {
            return null;
          }

          return (
            <div key={index}>
              <div>{property.title}</div>
              <div>{typeof propertyValue === 'object' ? JSON.stringify(propertyValue) : propertyValue}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

Detail.contextTypes = {
  router: PropTypes.object
};

Detail.propTypes = {
  schema: PropTypes.object.isRequired,
  clearData: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    detailReducer: state.detailReducer
  };
}

export default connect(mapStateToProps, {
  clearData
})(Detail);
