import React from 'react';
import PropTypes from 'prop-types';

import jsyaml from 'js-yaml';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/yaml/yaml';
import {
  Popover,
  PopoverInteractionKind,
  Position
} from '@blueprintjs/core';

const TableDataCodeCell = ({children}) => {
  const popoverContent = <CodeMirror className="cm-s-monokai" value={jsyaml.safeDump(children)}
    options={{
      mode: 'yaml',
      lineNumbers: true,
      readOnly: true,
      cursorBlinkRate: -1
    }}
  />;

  return (
    <td>
      {
        children === null ? '' : <Popover content={popoverContent}
          interactionKind={PopoverInteractionKind.CLICK}
          popoverClassName="pt-popover-content-sizing"
          position={Position.RIGHT}
          tetherOptions={{constraints: [{attachment: 'together', to: 'scrollParent'}]}}>
          <button className="pt-button">view</button>
        </Popover>
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
