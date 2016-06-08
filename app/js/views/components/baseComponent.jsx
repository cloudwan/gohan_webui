import React from 'react';

export default class BaseComponent extends React.Component {

  constructor(...params) {
    super(...params);

    this.state = {
      data: this.props.collection || this.props.model || {}
    };
  }

  componentWillMount() {
    if (this.props.collection !== undefined) {
      this.props.collection.on('sync', () => {
        this.setState({data: this.props.collection});
      });
    }
    if (this.props.model !== undefined) {
      this.props.model.on('sync', () => {
        this.setState({data: this.props.model});
      });
    }
  }

  componentWillUnmount() {
    if (this.props.collection !== undefined) {
      this.props.collection.off('sync');
    }
    if (this.props.model !== undefined) {
      this.props.model.off('sync');
    }
  }

  render() {
    return <div><h4>Error: Component needs a render method.</h4></div>;
  }
}
