import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Button, Classes} from '@blueprintjs/core';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/yaml/yaml';

import jsyaml from 'js-yaml';

class SchemaHint extends Component {
  static defaultProps() {
    return {
      uiSchema: {}
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      show: false
    };
  }

  handleShowHideClick = () => {
    this.setState({show: !this.state.show});
  }

  render() {
    const {schema} = this.props;
    const {show} = this.state;

    return (
      <div>
        <div className="pt-button-group pt-minimal">
          <Button text={`${show ? 'Hide' : 'Show'} schema definition`}
            onClick={this.handleShowHideClick}
            className={[Classes.MINIMAL, Classes.SMALL]}
          />
        </div>
        {show && (
          <CodeMirror value={jsyaml.safeDump(schema)}
            options={{
              mode: 'yaml',
              lineNumbers: false,
              theme: 'base16-light',
              readOnly: true,
              cursorBlinkRate: -1
            }}
          />
        )}
      </div>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  SchemaHint.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
  };
}

export default SchemaHint;
