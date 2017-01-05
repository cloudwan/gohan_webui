import React, {Component, PropTypes} from 'react';

export default class Detail extends Component {
  render() {
    const {schema} = this.props.schema;
    const {data} = this.props;

    return (
      <div className="pt-card pt-elevation-3 detail">
        {schema.propertiesOrder.map((key, index) => {
          const property = schema.properties[key];
          const propertyValue = data[key];

          if (property.view && !property.view.includes('detail')) {
            return null;
          }

          return (
            <p key={index}>
              <span className="property-title">{property.title}: </span>
              <span>{typeof propertyValue === 'object' ? JSON.stringify(propertyValue) : propertyValue}</span>
            </p>
          );
        })}
      </div>
    );
  }
}

Detail.propTypes = {
  schema: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};
