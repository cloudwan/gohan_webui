import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import dialog from '../Dialog';

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

import {
  openDialog,
  closeDialog
} from '../Dialog/DialogActions';
import {Alert, Intent} from '@blueprintjs/core';

export const getTableView = (TableComponent = Table) => {
  class TableView extends Component {
    constructor(props) {
      super(props);

      this.state = {
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

    handleOpenCreateDialog = () => {
      this.props.openCreateDialog();
    };

    handleCloseCreateDialog = () => {
      this.props.closeCreateDialog();
    };

    handleSubmitCreateDialog = data => {
      const {plural} = this.props;
      this.props.createData(data, plural, this.props.closeCreateDialog);
    };

    handleOpenUpdateDialog = id => {
      this.setState({dialogData: id}, this.props.openUpdateDialog);
    };

    handleCloseUpdateDialog = () => {
      this.props.closeUpdateDialog();
    };

    handleSubmitUpdateDialog = (data, id) => {
      const {plural} = this.props;

      this.props.updateData(id, data, plural, this.props.closeUpdateDialog);
    };

    handleOpenAlert = item => {
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
          checkedRowsIds
        }
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

      const CreateDialog = dialog({name: `${this.props.schemaId}_create`})(
        props => (
          <Dialog {...props}
            action={'create'}
            onClose={this.handleCloseCreateDialog}
            onSubmit={this.handleSubmitCreateDialog}
            baseSchema={this.props.activeSchema}
          />
        )
      );

      const UpdateDialog = dialog({name: `${this.props.schemaId}_update`})(
        props => (
          <Dialog {...props}
            action={'update'}
            onClose={this.handleCloseUpdateDialog}
            onSubmit={this.handleSubmitUpdateDialog}
            data={this.state.dialogData}
            baseSchema={this.props.activeSchema}
          />
        )
      );

      return (
        <div className="table-container">
          <CreateDialog/>
          <UpdateDialog/>
          {this.showAlert()}
          {this.showDeleteSelectedAlert()}
          <TableComponent schema={{
            ...this.props.activeSchema,
            url: (this.props.parentUrl || this.props.activeSchema.prefix) + '/' + this.props.activeSchema.plural
          }}
            data={data}
            pageCount={this.props.pageCount}
            activePage={this.props.activePage}
            filterBy={filterBy}
            filterValue={filterValue}
            sortKey={this.props.tableReducer.sortKey}
            sortOrder={this.props.tableReducer.sortOrder}
            handlePageChange={this.handlePageChange}
            removeData={this.handleDeleteData}
            filterData={this.handleFilterData}
            visibleColumns={this.props.headers}
            openModal={this.handleOpenCreateDialog}
            closeModal={this.handleCloseCreateDialog}
            editData={this.handleOpenUpdateDialog}
            rowCheckboxChange={this.handleRowCheckboxChange}
            sortData={this.handleSortData}
            openDeleteSelectedAlert={this.handleOpenDeleteSelectedAlert}
            buttonDeleteSelectedDisabled={this.state.buttonDeleteSelectedDisabled}
            checkedAll={this.state.checkedAll}
            handleCheckAll={this.handleCheckAllChange}
            openAlert={this.handleOpenAlert}
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

  function mapDispatchToProps(dispatch, {schemaId}) {
    return bindActionCreators({
      openCreateDialog: openDialog(`${schemaId}_create`),
      closeCreateDialog: closeDialog(`${schemaId}_create`),
      openUpdateDialog: openDialog(`${schemaId}_update`),
      closeUpdateDialog: closeDialog(`${schemaId}_update`),
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
    }, dispatch);
  }
  return connect(mapStateToProps, mapDispatchToProps)(TableView);
};

export default getTableView();
