import React, {Component,} from 'react';

import Asterisk from '../../components/Asterisk';
import Select from '../../components/Select';
import Label from '../../components/Label';
import Description from '../../components/Description';
import Errors from '../../components/Errors';

import validator from './../../Validator';

export default class SelectField extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      value: this.props.value === undefined && this.props.isNullable ? null : this.props.value,
      errors: [],
    };
  }

  get value() {
    return this.state.value;
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

  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.value === undefined && nextProps.isNullable ? null : nextProps.value});
  }

  handleChangeInput = value => {
    const {
      isRequired,
      type,
    } = this.props;
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
      haystack,
      isNullable,
    } = this.props;

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
        <div>test</div>
        <Select id={name}
          value={value}
          haystack={haystack}
          type={type}
          nullable={isNullable}
          ref={c => {this.select = c;}}
          onChange={this.handleChangeInput}
        />
        <Errors errors={errors} />
      </div>
    );
  }
}
