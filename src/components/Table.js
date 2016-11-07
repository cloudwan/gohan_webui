import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {Paper} from 'material-ui';

import Dialog from './../dialog/Dialog';

const detailStyle = {
  padding: 15
};

export default class Table extends Component {

  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
      actionModal: 'create'
    };
  }

  componentWillUnmount() {
    //
  }

  handleOpenModal = () => {
    this.setState({openModal: true, actionModal: 'create'});
  };

  handleCloseModal = () => {
    this.setState({openModal: false});
  };

  handleSubmit = data => {
    this.props.createData(this.props.schema.url, data, this.props.schema.singular);
  };

  render() {
    const {schema, singular} = this.props.schema;

    return (
      <Paper style={detailStyle}>
        <button onClick={this.handleOpenModal}>{'Add new ' + singular}</button>
        <Dialog isOpen={this.state.openModal} action={this.state.actionModal}
          onRequestClose={this.handleCloseModal} schema={this.props.schema}
          onSubmit={this.handleSubmit}>
          <button onClick={this.handleCloseModal}>Close</button>
        </Dialog>
        <table>
          <thead>
            <tr>
              {schema.propertiesOrder.map((item, index) => {
                if (item === 'id' || item === 'tenant_id') {
                  return null;
                }
                return (
                  <th key={index}>{schema.properties[item].title}</th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {this.props.data.map((item, index) => (
              <tr key={index}>
                {schema.propertiesOrder.map((key, i) => {
                  const data = item[key];

                  if (key === 'id' || key === 'tenant_id') {
                    return null;
                  }
                  if (typeof data === 'object') {
                    return (
                      <td key={i}>{JSON.stringify(data)}</td>
                    );
                  }
                  if (key === 'name') {
                    return (
                      <td key={i}>
                        <Link to={'/' + this.props.schema.singular + '/' + item.id}>{data}</Link>
                      </td>
                    );
                  }
                  return (
                    <td key={i}>{data}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>
    );
  }
}

Table.propTypes = {
  schema: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired
};
