import React from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';

const JsonEditor = ({
  text = '',
  onChange = () => {},
}) => (
  <div>
    <CodeMirror value={text}
      onChange={onChange}
      options={{
        lineNumbers: true,
        mode: 'application/json',
        theme: 'material',
        lineWiseCopyCut: true,
        autoCloseBrackets: true,
      }}
    />
    <span className="form-text text-muted">Put JSON here</span>
  </div>
);

export default JsonEditor;

if (process.env.NODE_ENV !== 'production') {
  JsonEditor.propTypes = {
    text: PropTypes.string,
    onChange: PropTypes.func,
  };
}
