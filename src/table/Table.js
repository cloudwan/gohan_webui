import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Dialog from './../dialog/Dialog';

import {fetchData, clearData, createData} from './TableActions';

class Table extends Component {

  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
      actionModal: 'create'
    };
  }

  componentWillMount() {
    this.props.fetchData(this.props.schema.url, this.props.schema.plural);
  }

  componentWillUnmount() {
    this.props.clearData();
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
      <div>
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
                if (item === 'id') {
                  return null;
                }
                return (
                  <th key={index}>{schema.properties[item].title}</th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {this.props.tableReducer.map((item, index) => (
              <tr key={index}>
                {schema.propertiesOrder.map((key, i) => {
                  const data = item[key];

                  if (key === 'id') {
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
      </div>
    );
  }
}

Table.contextTypes = {
  router: PropTypes.object
};

function mapStateToProps(state) {
  return {
    tableReducer: state.tableReducer
  };
}

Table.propTypes = {
  schema: PropTypes.object.isRequired,
  tableReducer: PropTypes.array,
  fetchData: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  fetchData,
  clearData,
  createData
})(Table);
