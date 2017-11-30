import React, {Component,} from 'react';
import PropTypes from 'prop-types';

import ObjectField from './fields/ObjectField';

export default class Form extends Component {
  static defaultProps = {};
  static propTypes = {
    schema: PropTypes.object.isRequired,
  };

  handleSubmitForm = event => {
    event.stopPropagation();
    event.preventDefault();

    console.log(this.object.value);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmitForm}>
        <ObjectField ref={c => {this.object = c;}}
          schema={this.props.schema}
          value={this.props.formData}
        />
        <button type={'submit'}>Submit</button>
        <button onClick={e => {e.preventDefault(); console.log(`Form is valid?: ${this.object.isValid}`);}}>VALID</button>
      </form>
    );
  }
}
