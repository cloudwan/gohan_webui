import React, {Component} from 'react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import jsyaml from 'js-yaml';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/yaml/yaml';
import {Link} from 'react-router-dom';
import {
  Button
} from '@blueprintjs/core';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {faPencilAlt} from '@fortawesome/fontawesome-free-solid';
import {faTrashAlt} from '@fortawesome/fontawesome-free-regular';

import ApiRequest from '../apiRequest';
import CustomActions from '../CustomActions';
import Card from './Card';

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
      followableRelations,
      updatePermission,
      deletePermission,
    } = this.props;

    return (
      <div className="detail-container">
        <Card>
          <div className="container-fluid gohan-detail-header">
            <div className="row justify-content-between align-items-center">
              <div className="col-auto resource-name">
                <h3 className="text-muted">{title}</h3>
              </div>
              <div className="col-auto">
                <div className="actions pt-button-group pt-minimal">
                  {updatePermission && (
                    <Button className={'pt-minimal pt-intent-primary'}
                      onClick={this.handleEditClick}>
                      <FontAwesomeIcon className="faicon" icon={faPencilAlt} />Edit
                    </Button>
                  )}
                  {deletePermission && (
                    <Button className={'pt-minimal pt-intent-primary'}
                      onClick={this.handleRemoveClick}>
                      <FontAwesomeIcon className="faicon" icon={faTrashAlt} />Delete
                    </Button>
                  )}
                  {!isEmpty(actions) && (
                    <CustomActions actions={actions}
                      baseUrl={url}
                      id={id}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid gohan-detail-content">
            {schema.propertiesOrder.map((key, index) => {
              const property = schema.properties[key];
              const propertyValue = data[key];

              if (!property) {
                console.error(`Property key '${key}' doesn't exist in schema properties.`);
                return null;
              }

              if (property.view && !property.view.includes('detail')) {
                return null;
              }

              if (property.type.includes('string') && (property.format === 'yaml' || property.format === 'text')) {
                return (
                  <div className="row gohan-detail-property mb-4" key={index}>
                    <div className="property-name col-sm-3 text-right text-muted">{property.title}</div>
                    <div className="property-value col-sm-9">
                      <div className="codemirror-container">
                        <CodeMirror value={propertyValue}
                          options={{
                            mode: 'yaml',
                            theme: 'base16-light',
                            readOnly: true,
                            cursorBlinkRate: -1
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              }

              if (property.type === 'array' || property.type === 'object') {
                return (
                  <div className="row gohan-detail-property mb-4" key={index}>
                    <div className="property-name col-sm-3 text-right text-muted">{property.title}</div>
                    <div className="property-value col-sm-9">
                      <div className="codemirror-container">
                        <CodeMirror value={jsyaml.safeDump(propertyValue)}
                          options={{
                            mode: 'yaml',
                            theme: 'base16-light',
                            readOnly: true,
                            cursorBlinkRate: -1
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              }

              if (propertyValue && property.relation) {
                const {relation, relation_property: relationProperty} = property;
                const {name, url} = data[relationProperty || relation];
                const text = this.renderPropertyValueAsText(name || propertyValue);
                const value =
                  followableRelations ?
                    (<span className="relation-property"><Link to={url}>{text} »</Link></span>) :
                    <span className="relation-property">{text}</span>;

                return (
                  <div className="row gohan-detail-property mb-4" key={index}>
                    <div className="property-name col-sm-3 text-right text-muted">{property.title}</div>
                    <div className="property-value col-sm-9">
                      {value}
                    </div>
                  </div>
                );
              }

              return (
                <div className="row gohan-detail-property mb-4" key={index}>
                  <div className="property-name col-sm-3 text-right text-muted">{property.title}</div>
                  <div className={`property-value col-sm-9 ${(propertyValue === null) ? ' null' : ''}
                    ${(key === 'status') ? 'status ' + this.renderPropertyValueAsText(propertyValue) : ''}`}>
                    {this.renderPropertyValueAsText(propertyValue)}
                  </div>
                </div>
              );
            })}
            <div className="row">
              <div className="col text-right">
                <Button className={'pt-minimal pt-intent-primary toggle-request-form'}
                  iconName={isApiRequestFormOpen ? 'chevron-up' : 'chevron-down'}
                  text={'API Request Form'}
                  onClick={this.handleApiRequestFormToggle}
                />
              </div>
            </div>
          </div>
          {
            isApiRequestFormOpen && <div className="api-request-form-container">
              <ApiRequest baseUrl={`${gohanUrl}${this.props.schema.url}/${data.id}`} />
            </div>
          }
        </Card>
      </div>
    );
  }
}

Detail.propTypes = {
  schema: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  updatePermission: PropTypes.bool.isRequired,
  deletePermission: PropTypes.bool.isRequired,
};
