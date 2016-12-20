import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Table from '../components/Table';
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
    let filters;

    if (this.props.location.query.filters) {
      try {
        filters = JSON.parse(this.props.location.query.filters);
      } catch (error) {
        console.error(error);
      }
    }

    const {
      sortKey,
      sortOrder,
      limit,
      offset,
    } = this.props.location.query;

    this.state = {
      activeSchema: props.schemaReducer.data.find(
        object => object.plural === splitPathname[splitPathname.length - 1]
      )
    };

    props.initialize(this.state.activeSchema.url, this.state.activeSchema.plural, {
      sortKey,
      sortOrder,
      limit,
      offset,
      filters
    });
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

  setVisibleColumns(schema, exclude) {
    let headers = [];
    const schemaProperties = schema.properties;
    const schemaPropertiesOrder = schema.propertiesOrder;

    schemaPropertiesOrder.forEach(item => {
      const property = schemaProperties[item];

      if (property && property.view && !property.view.includes('list')) {
        return;
      }

      if (exclude && exclude.length) {
        if (exclude.includes(item)) {
          return;
        }
      }

      headers.push(item);
    });

    return headers;
  }

  render() {
    const {isLoading, data, totalCount, limit, offset} = this.props.tableReducer;
    const {pageLimit} = this.props.configReducer;
    const pageCount = Math.ceil(totalCount / (limit || pageLimit));
    const activePage = Math.ceil(offset / (limit || pageLimit)) + 1;
    const headers = this.setVisibleColumns(this.state.activeSchema.schema, ['id']);

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
        filterData={this.handleFilterData} visibleColumns={headers}
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
