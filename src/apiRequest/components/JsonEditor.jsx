import React from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';

const JsonEditor = ({
  text = '',
  onChange = () => {},
}) => {
  return (
    <div>
      <CodeMirror value={text}
        onChange={onChange}
        options={{
          lineNumbers: true,
          mode: 'application/json',
          theme: 'monokai',
          lineWiseCopyCut: true,
          autoCloseBrackets: true,
        }}
      />
      <span className="editor-description">Put JSON here</span>
    </div>
  );
};

export default JsonEditor;

if (process.env.NODE_ENV !== 'production') {
  JsonEditor.propTypes = {
    text: PropTypes.string,
    onChange: PropTypes.func,
  };
}
