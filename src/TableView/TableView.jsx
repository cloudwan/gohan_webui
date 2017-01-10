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
  filterData,
  deleteMultipleResources
} from './TableActions';
import LoadingIndicator from '../components/LoadingIndicator';
import Dialog from '../Dialog/Dialog';
import {Toaster, Position, Alert, Intent} from '@blueprintjs/core';

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
      modalOpen: false,
      alertOpen: false,
      actionModal: 'create',
      dialogData: {},
      checkedRowsIds: [],
      checkedAll: {
        checked: false,
        changedByRow: false
      },
      buttonDeleteSelectedDisabled: true
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

  componentDidMount() {
    this.toaster = Toaster.create({
      position: Position.TOP
    });
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

    if (nextProps.tableReducer.deletedMultipleResources === true &&
      nextProps.tableReducer.deletedMultipleResources !== this.props.tableReducer.deletedMultipleResources) {
      this.setState({
        checkedRowsIds: [],
        buttonDeleteSelectedDisabled: true,
        checkedAll: {checked: false, changedByRow: false}
      });
    }
  }

  componentWillUpdate(nextProps) {
    const {errorMessage} = nextProps;

    if (errorMessage) {
      this.toaster.show({
        message: errorMessage,
        className: 'pt-intent-danger',
        timeout: 0,
        onDismiss: () => {}
      });
    }

  }

  componentWillUnmount() {
    this.toaster.getToasts().forEach(toast => this.toaster.dismiss(toast.key));
    this.props.clearData();
  }

  handlePageChange = page => {
    const {totalCount, limit} = this.props.tableReducer;
    const {pageLimit} = this.props.configReducer;
    const newOffset = page * (limit || pageLimit);

    if (newOffset > totalCount) {
      console.error('newOffset > totalCount');
      return;
    }

    this.context.router.replace({
      pathname: this.props.location.pathname,
      query: {
        ...this.props.location.query,
        offset: newOffset
      }
    });

    this.props.setOffset(newOffset);
    this.setState({
      checkedRowsIds: [],
      buttonDeleteSelectedDisabled: true,
      checkedAll: {checked: false, changedByRow: false}
    });
  };

  handleFilterData = property => {
    this.context.router.replace({
      pathname: this.props.location.pathname,
      query: {
        ...this.props.location.query,
        filters: JSON.stringify(property)
      }
    });

    this.props.filterData(property);
  };

  handleSortData = (sortKey, sortOrder) => {
    this.context.router.replace({
      pathname: this.props.location.pathname,
      query: {
        ...this.props.location.query,
        sortKey,
        sortOrder
      }
    });

    this.props.sortData(sortKey, sortOrder);
  };

  handleOpenModal = () => {
    this.setState({modalOpen: true, actionModal: 'create', dialogData: {}});
  };

  handleCloseModal = () => {
    this.setState({modalOpen: false});
  };

  handleOpenAlert = (item) => {
    this.setState({alertOpen: true, markedForDeletion: item});
  };

  handleCloseAlert = () => {
    this.setState({alertOpen: false});
  };

  handleDeleteData = () => {
    this.props.deleteData(this.state.activeSchema.url, this.state.markedForDeletion.id, this.state.activeSchema.plural);
    this.handleCloseAlert();
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
    this.setState({modalOpen: true, actionModal: 'update', dialogData: id});
  };

  handleCheckAllChange = checkedAll => {
    let {checkedRowsIds} = this.state;
    const {data} = this.props.tableReducer;

    if (checkedAll.checked === true && checkedAll.changedByRow === false) {
      if (data.length > 0) {
        data.forEach(item => {
          const itemId = item.id;
          if (checkedRowsIds.includes(itemId) === false) {
            checkedRowsIds.push(itemId);
          }
        });
      } else {
        checkedAll.checked = false;
      }
    } else {
      checkedRowsIds = [];
      checkedAll.checked = false;
    }

    this.setState({checkedAll, checkedRowsIds, buttonDeleteSelectedDisabled: !checkedAll.checked});
  };

  handleRowCheckboxChange = id => {
    let {checkedRowsIds, checkedAll} = this.state;
    const idIndex = checkedRowsIds.indexOf(id);

    if (idIndex > -1) {
      checkedRowsIds.splice(idIndex, 1);
      checkedAll = {
        checked: false,
        changedByRow: true
      };
    } else {
      checkedRowsIds.push(id);
    }

    if (checkedRowsIds.length > 0) {
      this.setState({buttonDeleteSelectedDisabled: false, checkedAll, checkedRowsIds});
    } else {
      this.setState({
        buttonDeleteSelectedDisabled: true,
        checkedAll: {
          checked: false,
          changedByRow: true
        },
        checkedRowsIds}
      );
    }

  };

  handleDeleteMultipleResources = () => {
    const {checkedRowsIds} = this.state;

    if (checkedRowsIds.length > 0) {
      this.props.deleteMultipleResources(checkedRowsIds);
    }
  };


  showModal = () => {
    if (this.state.modalOpen) {
      return (
        <Dialog isOpen={this.state.modalOpen} action={this.state.actionModal}
          data={this.state.dialogData} onClose={this.handleCloseModal}
          onSubmit={this.handleSubmit} schema={this.state.activeSchema}
        />
      );
    }

    return null;
  };
  showAlert = () => {
    if (this.state.alertOpen) {
      return (
        <Alert intent={Intent.PRIMARY}
          isOpen={this.state.alertOpen}
          confirmButtonText='Delete'
          cancelButtonText='Cancel'
          onConfirm={this.handleDeleteData}
          onCancel={this.handleCloseAlert}>
          <p>Delete {this.state.markedForDeletion.name} ?</p>
        </Alert>
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
    const {data, totalCount, limit, offset, filters} = this.props.tableReducer;
    const {pageLimit} = this.props.configReducer;
    const pageCount = Math.ceil(totalCount / (limit || pageLimit));
    const activePage = Math.ceil(offset / (limit || pageLimit));
    const filterValue = filters ? filters[Object.keys(filters)[0]] : '';
    const filterBy = filters ? Object.keys(filters)[0] : '';

    return (
      <div className="table-container">
        {this.showModal()}
        {this.showAlert()}
        <Table schema={this.state.activeSchema} data={data}
          pageCount={pageCount} activePage={activePage}
          filterBy={filterBy} filterValue={filterValue}
          sortKey={this.props.tableReducer.sortKey} sortOrder={this.props.tableReducer.sortOrder}
          handlePageChange={this.handlePageChange} createData={this.props.createData}
          removeData={this.handleDeleteData} updateData={this.props.updateData}
          filterData={this.handleFilterData} visibleColumns={headers}
          openModal={this.handleOpenModal} closeModal={this.handleCloseModal}
          editData={this.handleEditItem} rowCheckboxChange={this.handleRowCheckboxChange}
          sortData={this.handleSortData} deleteMultipleResources={this.handleDeleteMultipleResources}
          buttonDeleteSelectedDisabled={this.state.buttonDeleteSelectedDisabled} checkedAll={this.state.checkedAll}
          handleCheckAll={this.handleCheckAllChange} openAlert={this.handleOpenAlert}
        />
      </div>
    );
  }
}

TableView.contextTypes = {
  router: PropTypes.object
};

TableView.propTypes = {
  errorMessage: PropTypes.string,
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
  updateData,
  deleteMultipleResources
})(TableView);
