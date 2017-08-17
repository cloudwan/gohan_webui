import React, {Component} from 'react';
import PropTypes from 'prop-types';
import jsyaml from 'js-yaml';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/yaml/yaml';
import {Tooltip, Position} from '@blueprintjs/core';

export default class Detail extends Component {
  handleEditClick = () => {
    this.props.onEdit(this.props.data);
  };

  handleRemoveClick = () => {
    this.props.onDelete(this.props.data);
  };

  renderPropertyValueAsText = propertyValue => {
    if (typeof propertyValue === 'object') {
        return JSON.stringify(propertyValue);
    }

    return String(propertyValue);
  };

  render() {
    const {schema, title} = this.props.schema;
    const {data} = this.props;

    return (
      <div className="pt-card pt-elevation-3 detail">
        <h2>{title}</h2>
        <div className='icons'>
          <Tooltip content='Edit' hoverOpenDelay={50}
            position={Position.BOTTOM}>
            <span className="pt-icon-standard pt-icon-edit" onClick={this.handleEditClick}/>
          </Tooltip>
          <Tooltip content='Delete' hoverOpenDelay={50}
            position={Position.BOTTOM}>
            <span className="pt-icon-standard pt-icon-trash delete" onClick={this.handleRemoveClick}
              style={{marginLeft: '15px'}}
            />
          </Tooltip>
        </div>
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
              <span>{this.renderPropertyValueAsText(propertyValue)}</span>
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
