import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import {fetchData, clearData} from './TableActions';

class Table extends Component {

  componentWillMount() {
    this.props.fetchData(this.props.schema.url, this.props.schema.plural);
  }

  componentWillUnmount() {
    this.props.clearData();
  }

  render() {
    const {schema} = this.props.schema;

    return (
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
  clearData
})(Table);
