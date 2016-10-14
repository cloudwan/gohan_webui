import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Paper, RefreshIndicator} from 'material-ui';

import {clearData} from './../dynamicRoutes/DynamicActions';

const detailStyle = {
  padding: 15
};

const loadingIndicatorStyle = {
  margin: 'auto',
  position: 'relative'
};

class Detail extends Component {

  componentWillUnmount() {
    this.props.clearData();
  }

  render() {
    const {schema} = this.props.schema;
    const {data, isLoading} = this.props;
    const titleStyle = {
      fontWeight: 'bold'
    };

    if (isLoading) {
      return (
        <RefreshIndicator size={60} left={0}
          top={0} status="loading"
          style={loadingIndicatorStyle}
        />
      );
    }

    return (
      <Paper style={detailStyle}>
        {schema.propertiesOrder.map((key, index) => {
          const property = schema.properties[key];
          const propertyValue = data[key];

          if (property.view && !property.view.includes('detail')) {
            return null;
          }

          return (
            <p key={index}>
              <span style={titleStyle}>{property.title}: </span>
              <span>{typeof propertyValue === 'object' ? JSON.stringify(propertyValue) : propertyValue}</span>
            </p>
          );
        })}
      </Paper>
    );
  }
}

Detail.contextTypes = {
  router: PropTypes.object
};

Detail.propTypes = {
  isLoading: PropTypes.bool.isRequired,
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
