import React, {Component, PropTypes} from 'react';
import {Paper} from 'material-ui';

const detailStyle = {
  padding: 15
};

export default class Detail extends Component {

  componentWillUnmount() {
  }

  render() {
    const {schema} = this.props.schema;
    const {data} = this.props;
    const titleStyle = {
      fontWeight: 'bold'
    };

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

Detail.propTypes = {
  schema: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};
