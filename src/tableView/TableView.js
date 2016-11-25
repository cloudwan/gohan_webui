import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Table from '../components/table';
import {initialize, fetchData, clearData, createData, deleteData} from './TableActions';
import LoadingIndicator from '../components/LoadingIndicator';

class TableView extends Component {

  constructor(props) {
    super(props);

    const splitPathname = props.location.pathname.split('/');

    this.state = {
      activeSchema: props.schemaReducer.data.find(
        object => object.plural === splitPathname[splitPathname.length - 1]
      )
    };
    props.initialize(this.state.activeSchema.url, this.state.activeSchema.plural);
    props.fetchData();
  }

  componentWillUnmount() {
    this.props.clearData();
  }

  handleDeleteData = (url, id) => {
    this.props.deleteData(url, id, this.state.activeSchema.plural);
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.props.clearData();

      const splitPathname = nextProps.location.pathname.split('/');

      this.state = {
        activeSchema: this.props.schemaReducer.data.find(
          object => object.plural === splitPathname[splitPathname.length - 1]
        )
      };
      this.props.initialize(this.state.activeSchema.url, this.state.activeSchema.plural);
      this.props.fetchData();
    }
  }

  render() {
    const {isLoading, data} = this.props.tableReducer;

    if (isLoading) {
      return (
        <LoadingIndicator />
      );
    }
    return (
      <Table schema={this.state.activeSchema} data={data}
        createData={this.props.createData} removeData={this.handleDeleteData}
      />
    );
  }
}

TableView.propTypes = {
  schemaReducer: PropTypes.object.isRequired,
  tableReducer: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
  clearData: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    schemaReducer: state.schemaReducer,
    tableReducer: state.tableReducer
  };
}

export default connect(mapStateToProps, {
  initialize,
  fetchData,
  clearData,
  createData,
  deleteData
})(TableView);
