import React from 'react';

import {Inspector} from 'react-inspector';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';

import IFrame from '../../components/IFrame';
import WebSocketTerminal from './WebSocketTerminal';

export const ToasterContent = ({data, responseFormat, url, authToken}) => {
  if (responseFormat === 'html') {
    return (
      <IFrame src={url} authToken={authToken}/>
    );
  }

  if (responseFormat === 'websocket-terminal') {
    return (
      <WebSocketTerminal url={url} authToken={authToken}/>
    );
  }

  if (typeof data === 'object') {
    return (
      <Inspector data={data}/>
    );
  } else if (typeof data !== 'object') {
    return (
      <CodeMirror value={data}
        className="toaster-codemirror"
        options={{
          mode: 'javascript',
          theme: 'base16-light',
          readOnly: true,
          cursorBlinkRate: -1
        }}
      />
    );
  }

  return null;
};

export default ToasterContent;
