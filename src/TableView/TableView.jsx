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
import Dialog from '../Dialog/Dialog';

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
      limit = 0,
      offset = 0,
    } = this.props.location.query;

    this.state = {
      activeSchema: props.schemaReducer.data.find(
        object => object.plural === splitPathname[splitPathname.length - 1]
      ),
      openModal: false,
      actionModal: 'create',
      dialogData: {}
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

  componentWillUnmount() {
    this.props.clearData();
  }

  handleDeleteData = id => {
    this.props.deleteData(this.state.activeSchema.url, id, this.state.activeSchema.plural);
  };

  handlePageChange = page => {
    const {totalCount, limit} = this.props.tableReducer;
    const {pageLimit} = this.props.configReducer;
    const newOffset = page * (limit || pageLimit);

    if (newOffset > totalCount) {
      console.error('newOffset > totalCount');
      return;
    }
    this.props.setOffset(newOffset);
  };

  handleFilterData = (property, value) => {
    this.props.filterData(property, value);
  };

  handleSortData = (sortKey, sortOrder) => {
    this.props.sortData(sortKey, sortOrder);
  };

  handleOpenModal = () => {
    this.setState({openModal: true, actionModal: 'create', dialogData: {}});
  };

  handleCloseModal = () => {
    this.setState({openModal: false});
  };

  handleSubmit = (data, id) => {
    switch (this.state.actionModal) {
      case 'create':
        this.props.createData(data);
        break;
      case 'update':
        this.props.updateData(id, data);
        break;
    }
  };

  handleEditItem = id => {
    this.setState({openModal: true, actionModal: 'update', dialogData: id});
  };

  showModal = () => {
    if (this.state.openModal) {
      return (
        <Dialog isOpen={this.state.openModal} action={this.state.actionModal}
          data={this.state.dialogData} onClose={this.handleCloseModal}
          onSubmit={this.handleSubmit} schema={this.state.activeSchema}
        />
      );
    }

    return null;
  };

  getVisibleColumns(schema, exclude) {
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
    const {isLoading} = this.props.tableReducer;

    const headers = this.getVisibleColumns(this.state.activeSchema.schema, ['id']);

    if (isLoading) {
      return (
        <LoadingIndicator />
      );
    }
    const {data, totalCount, limit, offset} = this.props.tableReducer;
    const {pageLimit} = this.props.configReducer;
    const pageCount = Math.ceil(totalCount / (limit || pageLimit));
    const activePage = Math.ceil(offset / (limit || pageLimit));

    return (
      <div className="table-container">
        {this.showModal()}
        <Table schema={this.state.activeSchema} data={data}
          pageCount={pageCount} activePage={activePage}
          sortKey={this.props.sortKey} sortOrder={this.props.sortOrder}
          handlePageChange={this.handlePageChange} createData={this.props.createData}
          removeData={this.handleDeleteData} updateData={this.props.updateData}
          filterData={this.handleFilterData} visibleColumns={headers}
          sortData={this.handleSortData} openModal={this.handleOpenModal}
          closeModal={this.handleCloseModal} editData={this.handleEditItem}
        />
      </div>
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
