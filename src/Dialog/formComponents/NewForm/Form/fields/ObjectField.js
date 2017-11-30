import React, {Component,} from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';

import Input from './Input';
import Checkbox from './Checkbox';
import Select from './Select';
import ArrayField from './ArrayField';

import Fieldset from '../../components/Fieldset';
import Legend from '../../components/Legend';
import Description from '../../components/Description';
import Asterisk from '../../components/Asterisk';
import Button from '../../components/Button';

export default class ObjectField extends Component {
  static defaultProps = {};
  static propTypes = {
    schema: PropTypes.object.isRequired,
  };

  properties = {};

  constructor(props, context) {
    super(props, context);

    this.state = {
      value: this.props.value
    };
  }

  get value() {
    const {properties} = this.props.schema;

    if (this.state.value === null) {
      return this.state.value;
    }
    return Object.keys(properties).reduce((result, key) => {
      result[key] = this.properties[key].value;
      return result;
    }, {});
  }

  get isValid() {
    return Object.keys(this.properties).reduce((result, key) => {
      const testedField = this.properties[key].isValid;

      if (result === false) {
        return result;
      } else if (testedField === false) {
        return false;
      }

      return result;
    }, true);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.value});
  }

  handleAddRemoveButton = () => {
    const {value} = this.state;

    if (value === null) {
      this.setState({value: {}});
    } else {
      this.setState({value: null});
    }
  };

  renderFields() {
    const {
      properties,
      propertiesOrder = [],
      required,
    } = this.props.schema;

    return uniq(propertiesOrder.concat(Object.keys(properties)))
      .map(key => {
        const property = properties[key];
        const type = Array.isArray(property.type) ? property.type[0] : property.type;
        const isNullable = Array.isArray(property.type) && property.type.includes('null');
        const value = (this.state.value && this.state.value[key]) ? this.state.value[key] : property.default;
        const isRequired = Array.isArray(required) && required.includes(key);

        if (type === 'object') {
          return (
            <ObjectField key={key}
              ref={c => {this.properties[key] = c;}}
              schema={property}
              isRequired={isRequired}
              isNullable={isNullable}
            />
          );
        } else if (type === 'array') {
          return (
            <ArrayField key={key}
              ref={c => {this.properties[key] = c;}}
              name={property.title || key}
              description={property.description}
              schema={property}
              type={type}
              value={value}
              isNullable={isNullable}
              isRequired={isRequired}
            />
          );
        } else if (type === 'boolean') {
          return (
            <Checkbox key={key}
              ref={c => {this.properties[key] = c;}}
              name={property.title || key}
              description={property.description}
              schema={property}
              type={type}
              value={value}
              isRequired={isRequired}
            />
          );
        } else if (property.enum) {
          let haystack = [];
          if (property.options) {
            haystack = Object.keys(property.options).map(key => ({value: key, label: property.options[key]}));
          } else {
            haystack = property.enum;
          }

          return (
            <Select key={key}
              ref={c => {this.properties[key] = c;}}
              name={property.title || key}
              description={property.description}
              schema={property}
              haystack={haystack}
              type={type}
              value={value}
              isNullable={isNullable}
              isRequired={isRequired}
            />
          );
        }
        return (
          <Input key={key}
            ref={c => {this.properties[key] = c;}}
            name={property.title || key}
            description={property.description}
            schema={property}
            type={type}
            value={value}
            isNullable={isNullable}
            isRequired={isRequired}
          />
        );

      });
  }

  render() {
    const {
      isRequired,
      isNullable
    } = this.props;

    const {
      value
    } = this.state;
    const {
      title,
      description,
    } = this.props.schema;

    return (
      <Fieldset>
        {title && <Legend>
          {title}
          {isRequired && <Asterisk />}
          {isNullable && (
            <Button iconName={value === null ? 'add' : 'remove'}
              isMinimal={true}
              onClick={this.handleAddRemoveButton}
            />
          )}
          </Legend>}
        {description && <Description>{description}</Description>}
        {value !== null && this.renderFields()}
      </Fieldset>
    );
  }
}
