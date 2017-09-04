import React, {Component} from 'react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import jsyaml from 'js-yaml';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/yaml/yaml';
import {
  Button
} from '@blueprintjs/core';

import CustomActions from '../CustomActions';

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
    const {
      schema,
      title,
    } = this.props.schema;
    const {actions} = this.props.schema;
    const {
      data,
      url,
      id,
    } = this.props;

    return (
      <div className="pt-card pt-elevation-3 detail">
        <div className="detail-header">
          <h2 className="title">{title}</h2>
          <div className='actions pt-button-group pt-minimal'>
            <Button className={'pt-minimal'}
              iconName="edit"
              text={'Edit'}
              onClick={this.handleEditClick}
            />
            <Button className={'pt-minimal'}
              iconName="trash"
              text={'Delete'}
              onClick={this.handleRemoveClick}
            />
            {!isEmpty(actions) && (
              <CustomActions actions={actions}
                baseUrl={url}
                id={id}
              />
            )}
          </div>
        </div>
        <div className="detail-content">
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
      </div>
    );
  }
}

Detail.propTypes = {
  schema: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};
