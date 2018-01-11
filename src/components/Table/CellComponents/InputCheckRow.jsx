import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '@blueprintjs/core';

class InputCheckRow extends Component {
  static defaultProps = {
    disabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      checked: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.state.checked) {
      this.setState({checked: nextProps.checked});
    }
  }

  handleCheckOnChange = () => {
    this.setState({checked: this.input.checked}, () => {
      this.props.onChange(this.props.id);
    });
  };

  render() {
    return (
      <Checkbox inputRef={input => {this.input = input;}}
        checked={this.state.checked}
        disabled={this.props.disabled}
        onChange={this.handleCheckOnChange}
      />
    );
  }
}

InputCheckRow.propTypes = {
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  id: PropTypes.string
};

export default InputCheckRow;
