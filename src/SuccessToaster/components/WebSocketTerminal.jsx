import React, {Component} from 'react';

import Console from '../../components/Console';

import {createWebSocket} from '../../api';

export const decomposeObjectToArray = obj => {
  const arr = [];

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key].length > 0) {
        arr.push(obj[key]);
      }
    }
  }

  return arr;
};

export const wsMessageParser = message => {
  if (typeof message === 'object') {
    return decomposeObjectToArray(message);
  } else if (typeof message === 'string') {
    return message;
  }

  return message;
};

export class WebSocketTerminal extends Component {
  ws = null;

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      error: false,
      connectionOpened: false,
      errorMessage: ''
    };
  }

  componentDidMount() {
    const {url, authToken} = this.props;

    document.cookie = `Auth-Token=${authToken}; path=/`; // eslint-disable-line no-undef

    this.setConnection(url);
  }

  componentWillUnmount() {
    this.closeConnection();
  }

  setConnection = url => {
    try {
      if (this.ws === null) {
        this.ws = createWebSocket(url, {
          onOpen: () => {
            this.setState({
              connectionOpened: true,
              error: false,
              errorMessage: ''
            });
          },
          onMessage: evt => {
            this.addMessage(wsMessageParser(evt.data));
          },
          onClose: evt => {
            if (this.ws !== null) {
              this.setState({
                error: false,
                connectionOpened: false,
                errorMessage: evt.reason || 'WebSocket closed'
              }, () => {
                this.ws = null;
              });
            }
          },
          onError: () => {
            this.setState({
              error: true,
              connectionOpened: false,
              errorMessage: 'WebSocket connection error'
            });
          }
        });
      }
    } catch (e) {
      this.setState({
        error: true,
        errorMessage: e
      });
    }
  };

  closeConnection = () => {
    if (this.ws !== null) {
      this.ws.close();
      this.ws = null;
    }
  };

  addMessage = message => {
    if (this.ws !== null) {
      const {messages} = this.state;

      if (typeof message === 'string') {
        messages.push(message);
      } else { // array
        messages.push(...message);
      }

      this.setState({
        messages
      });
    }
  };

  render() {
    const {messages, errorMessage, error} = this.state;

    return (
      <div className="gohan-websocket">
        <Console data={messages}
          error={error}
          errorMessage={errorMessage}
        />
      </div>
    );
  }
}

export default WebSocketTerminal;
