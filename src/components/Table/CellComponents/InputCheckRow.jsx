import React, {Component} from 'react';
import PropTypes from 'prop-types';

class InputCheckRow extends Component {
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
      <input type={'checkbox'}
        ref={input => {this.input = input;}}
        checked={this.state.checked}
        onChange={this.handleCheckOnChange}
      />
    );
  }
}

InputCheckRow.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  id: PropTypes.string
};

export default InputCheckRow;
