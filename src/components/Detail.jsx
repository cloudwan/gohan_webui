import React, {Component} from 'react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import jsyaml from 'js-yaml';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/yaml/yaml';
import {
  Button
} from '@blueprintjs/core';

import ApiRequest from '../apiRequest';
import CustomActions from '../CustomActions';

export default class Detail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isApiRequestFormOpen: false,
    };
  }

  handleApiRequestFormToggle = () => this.setState(prevState => ({
    isApiRequestFormOpen: !prevState.isApiRequestFormOpen,
  }));

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
    const {isApiRequestFormOpen} = this.state;
    const {actions} = this.props.schema;
    const {
      data,
      url,
      id,
      gohanUrl,
    } = this.props;

    return (
      <div className="pt-card pt-elevation-0 detail">
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
                <div className="gohan-detail-property" key={index}>
                  <div className="property-title">{property.title}: </div>
                  <CodeMirror className="cm-s-monokai" value={jsyaml.safeDump(propertyValue)}
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
              <div className="gohan-detail-property" key={index}>
                <div className="property-title">{property.title}: </div>
                <div className="property-value">{this.renderPropertyValueAsText(propertyValue)}</div>
              </div>
            );
          })}
          <Button className={'pt-minimal toggle-request-form'}
            iconName={isApiRequestFormOpen ? 'chevron-up' : 'chevron-down'}
            text={'API Request Form'}
            onClick={this.handleApiRequestFormToggle}
          />
          {
            isApiRequestFormOpen && <div className="detail-request-form">
              <ApiRequest baseUrl={`${gohanUrl}${this.props.schema.url}/${data.id}`} />
            </div>
          }
        </div>
      </div>
    );
  }
}

Detail.propTypes = {
  schema: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};
