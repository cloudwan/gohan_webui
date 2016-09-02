import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {fetchData, clearData} from './DetailActions';

class Detail extends Component {

  componentWillMount() {
    const {schema, splat} = this.props;

    this.props.fetchData(schema.url + '/' + splat[splat.length - 1], schema.singular);
  }

  componentWillUnmount() {
    this.props.clearData();
  }

  render() {
    const {schema} = this.props.schema;
    const {detailReducer} = this.props;

    return (
      <div>
        {schema.propertiesOrder.map((key, index) => {
          const property = schema.properties[key];
          const data = detailReducer[key];

          if (property.view && !property.view.includes('detail')) {
            return null;
          }

          return (
            <div key={index}>
              <div>{property.title}</div>
              <div>{typeof data === 'object' ? JSON.stringify(data) : data}</div>
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
  detailReducer: PropTypes.object,
  fetchData: PropTypes.func.isRequired,
  clearData: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    detailReducer: state.detailReducer
  };
}

export default connect(mapStateToProps, {
  fetchData,
  clearData
})(Detail);
