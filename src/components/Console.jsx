import React, {Component} from 'react';

import {ansiToJson} from 'anser';
import PropTypes from 'prop-types';

export default class Console extends Component {
  static defaultProps = {
    data: [],
    error: undefined,
  };

  render() {
    const {
      data,
      error,
      errorMessage
    } = this.props;

    return (
      <div className="console">
        {(error || errorMessage) && (
          <span className="sse-error">
            {error && (<span>Error: </span>)} {errorMessage}
          </span>
        )}
        {data.map((item, index) => {
          const ansiJson = ansiToJson(item);

          return (
            <div className="console-container" key={index}>
              {ansiJson.map((item, i) => (
                <span key={i}
                  style={{
                    color: `rgb(${item.fg})`
                  }}>
                  {item.content}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    );
  }
}

Console.propTypes = {
  data: PropTypes.array,
  error: PropTypes.bool,
  errorMessage: PropTypes.string
};
