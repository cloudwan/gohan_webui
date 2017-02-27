import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Table from '../components/Table';
import {
  getActiveSchema,
  getHeaders,
  getPageCount,
  getActivePage
} from './TableSelectors';
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
import {Alert, Intent} from '@blueprintjs/core';

export class TableView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      alertOpen: false,
      alertDeleteSelectedOpen: false,
      actionModal: 'create',
      dialogData: {},
      checkedRowsIds: [],
      checkedAll: {
        checked: false,
        changedByRow: false
      },
      buttonDeleteSelectedDisabled: true
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tableReducer.deletedMultipleResources === true &&
      nextProps.tableReducer.deletedMultipleResources !== this.props.tableReducer.deletedMultipleResources) {
      this.setState({
        checkedRowsIds: [],
        buttonDeleteSelectedDisabled: true,
        checkedAll: {checked: false, changedByRow: false}
      });
    }
  }

  handlePageChange = page => {
    const {totalCount, limit} = this.props.tableReducer;
    const {pageLimit} = this.props.configReducer;
    const newOffset = page * (limit || pageLimit);

    if (newOffset > totalCount) {
      console.error('newOffset > totalCount');
      return;
    }

    if (this.props.location) {
      this.context.router.replace({
        pathname: this.props.location.pathname,
        query: {
          ...this.props.location.query,
          offset: newOffset
        }
      });
    }
    const {plural} = this.props;

    this.props.setOffset(newOffset, plural);
    this.setState({
      checkedRowsIds: [],
      buttonDeleteSelectedDisabled: true,
      checkedAll: {checked: false, changedByRow: false}
    });
  };

  handleFilterData = property => {
    const {plural} = this.props;

    this.props.filterData(property, plural);
    if (this.props.location) {
      this.context.router.replace({
        pathname: this.props.location.pathname,
        query: {
          ...this.props.location.query,
          filters: JSON.stringify(property)
        }
      });
    }
  };

  handleSortData = (sortKey, sortOrder) => {
    if (this.props.location) {
      this.context.router.replace({
        pathname: this.props.location.pathname,
        query: {
          ...this.props.location.query,
          sortKey,
          sortOrder
        }
      });
    }
    const {plural} = this.props;

    this.props.sortData(sortKey, sortOrder, plural);
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

  handleOpenDeleteSelectedAlert = () => {
    this.setState({alertDeleteSelectedOpen: true});
  };

  handleCloseDeleteSelectedAlert = () => {
    this.setState({alertDeleteSelectedOpen: false});
  };

  handleDeleteData = () => {
    this.props.deleteData(this.state.markedForDeletion.id, this.props.activeSchema.plural);
    this.handleCloseAlert();
  };

  handleSubmit = (data, id) => {
    const {plural} = this.props;

    switch (this.state.actionModal) {
      case 'create':
        this.props.createData(data, plural);
        break;
      case 'update':
        this.props.updateData(id, data, plural);
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
    const {plural} = this.props;

    if (checkedRowsIds.length > 0) {
      this.props.deleteMultipleResources(checkedRowsIds, plural);
    }

    if (this.state.alertDeleteSelectedOpen) {
      this.handleCloseDeleteSelectedAlert();
    }
  };

  showDeleteSelectedAlert = () => {
    if (this.state.alertDeleteSelectedOpen) {
      return (
        <Alert isOpen={this.state.alertDeleteSelectedOpen}
          onConfirm={this.handleDeleteMultipleResources}
          onCancel={this.handleCloseDeleteSelectedAlert}
          intent={Intent.PRIMARY}
          confirmButtonText={'Delete'}
          cancelButtonText={'Cancel'}>
          <p>Delete selected rows?</p>
        </Alert>
      );
    }
  };

  showModal = () => {
    if (this.state.modalOpen) {
      return (
        <Dialog isOpen={this.state.modalOpen} action={this.state.actionModal}
          data={this.state.dialogData} onClose={this.handleCloseModal}
          onSubmit={this.handleSubmit} baseSchema={this.props.activeSchema}
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
  };

  render() {
    if (!this.props.tableReducer || this.props.tableReducer.isLoading) {
      return (
        <LoadingIndicator />
      );
    }

    const {data, filters} = this.props.tableReducer;
    const filterValue = filters ? filters[Object.keys(filters)[0]] : '';
    const filterBy = filters ? Object.keys(filters)[0] : '';

    return (
      <div className="table-container">
        {this.showModal()}
        {this.showAlert()}
        {this.showDeleteSelectedAlert()}
        <Table schema={{
          ...this.props.activeSchema,
          url: (this.props.parentUrl || this.props.activeSchema.prefix) + '/' + this.props.activeSchema.plural
        }} data={data}
          pageCount={this.props.pageCount} activePage={this.props.activePage}
          filterBy={filterBy} filterValue={filterValue}
          sortKey={this.props.tableReducer.sortKey} sortOrder={this.props.tableReducer.sortOrder}
          handlePageChange={this.handlePageChange} createData={this.props.createData}
          removeData={this.handleDeleteData} updateData={this.props.updateData}
          filterData={this.handleFilterData} visibleColumns={this.props.headers}
          openModal={this.handleOpenModal} closeModal={this.handleCloseModal}
          editData={this.handleEditItem} rowCheckboxChange={this.handleRowCheckboxChange}
          sortData={this.handleSortData} openDeleteSelectedAlert={this.handleOpenDeleteSelectedAlert}
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
  tableReducer: PropTypes.object,
  fetchData: PropTypes.func.isRequired,
  clearData: PropTypes.func.isRequired
};

function mapStateToProps(state, props) {
  return {
    activeSchema: getActiveSchema(state, props),
    headers: getHeaders(state, props),
    pageCount: getPageCount(state, props),
    activePage: getActivePage(state, props),
    configReducer: state.configReducer,
    schemaReducer: state.schemaReducer,
    tableReducer: state.tableReducer[props.plural]
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
