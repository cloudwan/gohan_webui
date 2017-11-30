import React, {Component,} from 'react';

import Asterisk from '../../components/Asterisk';
import Input from '../../components/Input';
import Label from '../../components/Label';
import Description from '../../components/Description';
import Errors from '../../components/Errors';

import validator from './../../Validator';

export default class InputField extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      value: this.props.value === undefined ? '' : this.props.value,
      errors: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.value === undefined ? '' : nextProps.value});
  }

  get value() {
    const {isNullable,} = this.props;
    const {value,} = this.state;

    if (isNullable && !value) {
      return null;
    }

    return value;
  }

  get isValid() {
    const {
      isRequired,
      type,
    } = this.props;
    const {value,} = this.state;
    const errors = [];

    if (isRequired && !value) {
      errors.push({
        message: 'required',
      });
    }

    if (type === 'string') {
      validator.validate(this.props.schema, value);
    } else {
      validator.validate(this.props.schema, Number(value));
    }

    if (validator.errors) {
      errors.push(...validator.errors);
    }

    if (errors.length === 0) {
      return true;
    }

    this.setState({errors,});

    return false;
  }

  handleChangeInput = () => {
    const {
      isRequired,
      type,
    } = this.props;
    const value = this.input.value;
    const errors = [];

    if (isRequired && !value) {
      errors.push({
        message: 'required',
      });
    }

    if (type === 'string') {
      validator.validate(this.props.schema, value);
    } else {
      validator.validate(this.props.schema, Number(value));
    }

    if (validator.errors) {
      errors.push(...validator.errors);
    }

    this.setState({value: type === 'string' ? value : Number(value), errors,});
  };

  render() {
    const {
      name,
      description,
      type,
      isRequired,
      schema,
    } = this.props;

    const additionalProps = {};

    if (type === 'number') {
      additionalProps.max = schema.maximum;
      additionalProps.min = schema.min;
      additionalProps.step = schema.step || 0.00001;

    } else if (type === 'integer') {
      additionalProps.max = schema.maximum;
      additionalProps.min = schema.min;
      additionalProps.step = schema.step || 1;
    } else {
      additionalProps.maxLength = schema.maxLength;
    }

    const {
      value,
      errors,
    } = this.state;

    return (
      <div>
        <Label htmlFor={name}>
          {name}{isRequired && <Asterisk />}
        </Label>
        <Description>
          {description}
        </Description>
        <Input id={name}
          value={value}
          type={type}
          ref={c => {this.input = c;}}
          onChange={this.handleChangeInput}
          {...additionalProps}
        />
        <Errors errors={errors} />
      </div>
    );
  }
}
