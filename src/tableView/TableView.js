import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Table from '../components/table';
import {
  initialize,
  fetchData,
  clearData,
  createData,
  updateData,
  deleteData,
  sortData,
  setOffset,
  filterData
} from './TableActions';
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

  handleChangePage = page => {
    const {totalCount, limit} = this.props.tableReducer;
    const {pageLimit} = this.props.configReducer;
    const newOffset = (page - 1) * (limit || pageLimit);

    if (newOffset > totalCount) {
      console.error('newOffset > totalCount');
      return;
    }
    this.props.setOffset(newOffset);
  };

  handleFilterData = (property, value) => {
    this.props.filterData(property, value);
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
    const {isLoading, data, totalCount, limit, offset} = this.props.tableReducer;
    const {pageLimit} = this.props.configReducer;
    const pageCount = Math.ceil(totalCount / (limit || pageLimit));
    const activePage = Math.ceil(offset / (limit || pageLimit)) + 1;

    if (isLoading) {
      return (
        <LoadingIndicator />
      );
    }
    return (
      <Table schema={this.state.activeSchema} data={data}
        pageCount={pageCount} activePage={activePage}
        handleChangePage={this.handleChangePage} createData={this.props.createData}
        removeData={this.handleDeleteData} updateData={this.props.updateData}
        filterData={this.handleFilterData}
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
    configReducer: state.configReducer,
    schemaReducer: state.schemaReducer,
    tableReducer: state.tableReducer
  };
}

export default connect(mapStateToProps, {
  initialize,
  fetchData,
  clearData,
  createData,
  deleteData,
  sortData,
  setOffset,
  filterData,
  updateData
})(TableView);
