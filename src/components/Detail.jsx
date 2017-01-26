import React, {Component, PropTypes} from 'react';
import jsyaml from 'js-yaml';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/yaml/yaml';

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

          if (property.type === 'array' || property.type === 'object') {
            return (
              <div key={index}>
                <span className="property-title">{property.title}: </span>
                <CodeMirror value={jsyaml.safeDump(propertyValue)}
                  options={{
                    mode: 'yaml',
                    lineNumbers: true,
                    readOnly: true,
                    cursorBlinkRate: -1
                  }}
                />
              </div>
            );
          }

          return (
            <p key={index}>
              <span className="property-title">{property.title}: </span>
              <div>{typeof propertyValue === 'object' ? JSON.stringify(propertyValue) : propertyValue}</div>
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
