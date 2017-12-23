import React from 'react';
import PropTypes from 'prop-types';

import jsyaml from 'js-yaml';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/yaml/yaml';

import {Popover2} from '@blueprintjs/labs';

const TableDataCodeCell = ({children}) => {
  const popoverContent = <CodeMirror value={jsyaml.safeDump(children)}
    options={{
      mode: 'yaml',
      lineNumbers: false,
      theme: 'base16-light',
      readOnly: true,
      cursorBlinkRate: -1
    }}
  />;

  return (
    <td>
      {
        children === null ? '' : <Popover2 content={popoverContent}
          placement="auto">
          <button type="button" className="btn btn-outline-secondary btn-sm">detail</button>
        </Popover2>
      }
    </td>
  );
};

TableDataCodeCell.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ])
};

export default TableDataCodeCell;
