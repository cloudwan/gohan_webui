import React, {Component,} from 'react';

import Checkbox from '../../components/Checkbox';
import Description from '../../components/Description';


export default class CheckboxField extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      checked: Boolean(this.props.value),
    };
  }

  get value() {
    return this.state.checked;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({checked: Boolean(nextProps.value)});
  }

  handleChangeCheckbox = () => {
    this.setState({checked: this.select.checked,});
  };

  render() {
    const {name, description} = this.props;
    const {checked,} = this.state;

    return (
      <div>
        <Checkbox id={name}
          label={name}
          value={checked}
          onChange={this.handleChangeCheckbox}
          ref={c => {this.select = c;}}
        />
        <Description>{description}</Description>
      </div>
    );
  }
}
