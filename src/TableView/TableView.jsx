import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import dialog from '../Dialog';

import isEqual from 'lodash/isEqual';

import TableComponent from './TableComponent';

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
  hasCreatePermission,
  hasUpdatePermission,
  hasDeletePermission
} from './../schema/SchemaSelectors';
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

import Dialog from '../Dialog/Dialog';

import {
  openDialog,
  closeDialog
} from '../Dialog/DialogActions';
import {Alert, Intent} from '@blueprintjs/core';

export const getTableView = (Table = TableComponent) => {
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

    shouldComponentUpdate(nextProps, nextState) {
      return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
    }

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
      const {
        data,
        linkUrl,
        resourceTitle,
        filters,
        createPermission,
        updatePermission,
        deletePermission
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

      const tableProps = {
        isLoading: this.props.isLoading,
        headers: this.props.headers,
        title: resourceTitle,
        url: linkUrl,
        toolbar: {
          filter: {
            onChange: this.handleFilterData,
            by: filterBy,
            value: filterValue
          },
          onDeleteSelectedClick: this.handleDeleteSelectedClick,
          onAddResourceClick: this.handleOpenCreateDialog,
        },
        table: {
          data,
          checkboxColumn: {
            onCheckboxClick: this.handleCheckItems,
            checkedItems: this.state.checkedRowsIds
          },
          optionsColumn: {
            edit: {
              onClick: this.handleOpenUpdateDialog
            },
            remove: {
              onClick: this.handleRemoveItemClick
            },
          },
          sort: {
            sortKey: this.props.sortOptions.sortKey,
            sortOrder: this.props.sortOptions.sortOrder,
            onChange: this.handleSortData
          }
        },
        pagination: {
          pageCount: this.props.pageCount,
          onChangePage: this.handlePageChange,
          activePage: this.props.activePage,
        },
        permissions: {
          create: createPermission,
          update: updatePermission,
          remove: deletePermission
        }
      };

      return (
        <Table {...tableProps}>
          <CreateDialog/>
          <UpdateDialog/>
          {this.renderRemovalSingleItemAlert()}
          {this.renderRemovalSelectedItemsAlert()}
        </Table>
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
      isLoading: getIsLoading(state, props),
      createPermission: hasCreatePermission(state, props.schemaId),
      updatePermission: hasUpdatePermission(state, props.schemaId),
      deletePermission: hasDeletePermission(state, props.schemaId)
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
