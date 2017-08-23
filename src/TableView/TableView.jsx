import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import dialog from '../Dialog';

import Table from '../components/Table';
import TableToolbar from '../components/Table/TableToolbar';
import TablePagination from '../components/Table/TablePagination';

import {
  getActiveSchema,
  getHeaders,
  getPageCount,
  getActivePage,
  getData,
  getLinkUrl,
  getSortOptions,
  getResourceTitle,
  getFilters,
  getPageLimit,
  getLimit,
  getTotalCount,
  getIsLoading
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
        dialogData: {},
        checkedRowsIds: [],
        removalSingleItemAlertOpen: false,
        removedItemId: null,
        removalSelectedItemsAlertOpen: false
      };
    }

    clearCheckedRows = () => {
      this.setState({checkedRowsIds: []});
    };

    handleRemoveItemClick = id => {
      this.setState({removalSingleItemAlertOpen: true, removedItemId: id});
    };

    handleCloseRemovalSingleItemAlert = () => {
      this.setState({removalSingleItemAlertOpen: false, removedItemId: null});
    };

    handleDeleteItem = () => {
      this.props.deleteData(this.state.removedItemId, this.props.activeSchema.plural);
      this.handleCloseRemovalSingleItemAlert();
    };

    handleDeleteSelectedClick = () => {
      this.setState({removalSelectedItemsAlertOpen: true});
    };

    handleCloseRemovalSelectedItemsAlert = () => {
      this.setState({removalSelectedItemsAlertOpen: false});
    };

    handleDeleteSelected = () => {
      const {checkedRowsIds} = this.state;
      const {plural} = this.props;

      if (checkedRowsIds.length > 0) {
        this.props.deleteMultipleResources(checkedRowsIds, plural, this.clearCheckedRows);
      }

      if (this.state.removalSelectedItemsAlertOpen) {
        this.handleCloseRemovalSelectedItemsAlert();
      }
    };

    handleCheckItems = (itemsIds, checkedAll) => {
      const {checkedRowsIds} = this.state;
      if (checkedAll) {
        this.setState({
          checkedRowsIds: itemsIds
        });
      } else {
        itemsIds.forEach(id => {
          const idPosition = checkedRowsIds.indexOf(id);
          if (idPosition === -1) {
            checkedRowsIds.push(id);
          } else {
            checkedRowsIds.splice(idPosition, 1);
          }
        });

        this.setState({checkedRowsIds});
      }
    };

    handlePageChange = page => {
      const {totalCount, limit} = this.props;
      const {pageLimit} = this.props;
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
        checkedRowsIds: []
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

    handleOpenUpdateDialog = item => {
      this.setState({dialogData: item}, this.props.openUpdateDialog);
    };

    handleCloseUpdateDialog = () => {
      this.props.closeUpdateDialog();
    };

    handleSubmitUpdateDialog = (data, id) => {
      const {plural} = this.props;

      this.props.updateData(id, data, plural, this.props.closeUpdateDialog);
    };

    renderRemovalSingleItemAlert = () => {
      if (this.state.removalSingleItemAlertOpen) {
        return (
          <Alert intent={Intent.PRIMARY}
            isOpen={this.state.removalSingleItemAlertOpen}
            confirmButtonText='Delete'
            cancelButtonText='Cancel'
            onConfirm={this.handleDeleteItem}
            onCancel={this.handleCloseRemovalSingleItemAlert}>
            <p>Delete item?</p>
          </Alert>
        );
      }
    };

    renderRemovalSelectedItemsAlert = () => {
      if (this.state.removalSelectedItemsAlertOpen) {
        return (
          <Alert intent={Intent.PRIMARY}
            isOpen={this.state.removalSelectedItemsAlertOpen}
            confirmButtonText='Delete'
            cancelButtonText='Cancel'
            onConfirm={this.handleDeleteSelected}
            onCancel={this.handleCloseRemovalSelectedItemsAlert}>
            <p>Delete item(s)?</p>
          </Alert>
        );
      }
    };

    render() {
      if (this.props.isLoading) {
        return (
          <LoadingIndicator/>
        );
      }

      const {
        data,
        linkUrl,
        resourceTitle,
        filters
      } = this.props;
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
          {this.renderRemovalSingleItemAlert()}
          {this.renderRemovalSelectedItemsAlert()}
          <div className={'pt-card pt-elevation-3'}>
            <TableToolbar deleteSelected={{
              disabled: this.state.checkedRowsIds.length === 0,
              onClick: this.handleDeleteSelectedClick
            }}
              newResource={{
              onClick: this.handleOpenCreateDialog,
              title: resourceTitle
            }}
              filters={{
                properties: this.props.headers,
                onChange: this.handleFilterData,
                by: filterBy,
                value: filterValue
              }}
            />
            <TableComponent data={data}
              url={linkUrl}
              columns={this.props.headers}
              checkboxColumn={{
                visible: true,
                onCheckboxClick: this.handleCheckItems,
                checkedItems: this.state.checkedRowsIds
              }}
              optionsColumn={{
                edit: {
                  visible: true,
                  onClick: this.handleOpenUpdateDialog
                },
                remove: {
                  visible: true,
                  onClick: this.handleRemoveItemClick
                }
              }}
              sortOptions={{
                sortKey: this.props.sortOptions.sortKey,
                sortOrder: this.props.sortOptions.sortOrder,
                onChange: this.handleSortData
              }}
            />
            <TablePagination pageCount={this.props.pageCount}
              activePage={this.props.activePage}
              handlePageClick={this.handlePageChange}
            />
          </div>
        </div>
      );
    }
  }

  TableView.contextTypes = {
    router: PropTypes.object
  };

  TableView.propTypes = {
    errorMessage: PropTypes.string,
    fetchData: PropTypes.func.isRequired,
    clearData: PropTypes.func.isRequired
  };

  function mapStateToProps(state, props) {
    return {
      activeSchema: getActiveSchema(state, props),
      headers: getHeaders(state, props),
      pageCount: getPageCount(state, props),
      activePage: getActivePage(state, props),
      data: getData(state, props),
      linkUrl: getLinkUrl(state, props),
      sortOptions: getSortOptions(state, props),
      resourceTitle: getResourceTitle(state, props),
      filters: getFilters(state, props),
      pageLimit: getPageLimit(state, props),
      limit: getLimit(state, props),
      totalCount: getTotalCount(state, props),
      isLoading: getIsLoading(state, props)
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
