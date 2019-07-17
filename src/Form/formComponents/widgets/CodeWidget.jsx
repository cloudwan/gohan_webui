import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'react-codemirror';
import jsyaml from 'js-yaml';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/mode/javascript/javascript';

class CodeWidget extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.editor.getCodeMirror().refresh();
    }, 200);
  }

  render() {
    const {
      readonly,
      value,
      onChange,
      schema
    } = this.props;
    const {format} = schema;

    return (
      <CodeMirror onChange={onChange}
        value={typeof value !== 'string' && format === 'yaml' ? jsyaml.safeDump(value) : value}
        ref={editor => {this.editor = editor;}}
        options={{
          mode: format,
          lineNumbers: true,
          theme: 'material',
          readonly
        }}
      />
    );
  }
}

CodeWidget.defaultProps = {
  value: '',
  readonly: true,
};

if (process.env.NODE_ENV !== 'production') {
  CodeWidget.propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    readonly: PropTypes.bool,
    schema: PropTypes.object.isRequired
  };
}

export default CodeWidget;
