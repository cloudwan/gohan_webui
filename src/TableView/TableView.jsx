import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import dialog from '../Dialog';
import {
  parse as queryParse,
  stringify as queryStringify
} from 'query-string';

import isEqual from 'lodash/isEqual';

import TableComponent from './TableComponent';

import {update as updateBreadcrumb} from './../breadcrumb/breadcrumbActions';

import {
  getSchema,
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
  getCollectionUrl,
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

export const getTableView = (schema, Table = TableComponent, isChildView = false, options = {}) => {
  const schemaId = schema.id;
  const schemaTitle = schema.title;
  const schemaPlural = schema.plural;

  class TableView extends Component {
    componentDidMount() {
      if (!isChildView) {
        const query = queryParse(this.props.location.search);

        this.props.updateBreadcrumb([
          {
            title: schemaTitle,
            url: this.props.url,
          }
        ]);
        let {filters} = query;
        if (filters) {
          try {
            filters = JSON.parse(filters);
          } catch (error) {
            console.error(error);
          }
        }

        const {
          sortKey,
          sortOrder,
          limit = 0,
          offset = 0,
        } = query;

        this.props.initialize(
          this.props.url,
          schemaPlural, {
            ...options,
            sortKey,
            sortOrder,
            limit,
            offset,
            filters
          }
        );
      } else {
        this.props.initialize(
          this.props.url,
          schemaPlural,
          {...options}
        );
      }
      this.props.fetchData(schemaPlural);

    }

    componentWillUnmount() {
      this.props.clearData(schemaPlural);
      if (!isChildView) {
        this.props.updateBreadcrumb();
      }
    }

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
      const {plural} = this.props.activeSchema;

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

      if (!isChildView) {
        this.props.history.replace({
          ...this.props.location,
          search: queryStringify({
            ...queryParse(this.props.location.search),
            offset: newOffset === 0 ? undefined : newOffset
          })
        });
      }
      const {plural} = this.props.activeSchema;

      this.props.setOffset(newOffset, plural);
      this.setState({
        checkedRowsIds: []
      });
    };

    handleFilterData = property => {
      const {plural} = this.props.activeSchema;

      this.props.filterData(property, plural);
      if (!isChildView) {
        this.props.history.replace({
          ...this.props.location,
          search: queryStringify({
            ...queryParse(this.props.location.search),
            filters: JSON.stringify(property)
          })
        });
      }
    };

    handleSortData = (sortKey, sortOrder) => {
      if (!isChildView) {
        this.props.history.replace({
          ...this.props.location,
          search: queryStringify({
            ...queryParse(this.props.location.search),
            sortKey: sortOrder === '' ? undefined : sortKey,
            sortOrder: sortOrder === '' ? undefined : sortOrder,
          })
        });
      }
      const {plural} = this.props.activeSchema;

      this.props.sortData(sortKey, sortOrder, plural);
    };

    handleOpenCreateDialog = () => {
      this.props.openCreateDialog();
    };

    handleCloseCreateDialog = () => {
      this.props.closeCreateDialog();
    };

    handleSubmitCreateDialog = data => {
      this.props.createData(data, schemaPlural, this.props.closeCreateDialog);
    };

    handleOpenUpdateDialog = item => {
      this.setState({dialogData: item}, this.props.openUpdateDialog);
    };

    handleCloseUpdateDialog = () => {
      this.props.closeUpdateDialog();
    };

    handleSubmitUpdateDialog = (data, id) => {
      this.props.updateData(id, data, schemaPlural, this.props.closeUpdateDialog);
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

      const CreateDialog = dialog({name: `${schemaId}_create`})(
        props => (
          <Dialog {...props}
            action={'create'}
            onClose={this.handleCloseCreateDialog}
            onSubmit={this.handleSubmitCreateDialog}
            baseSchema={this.props.activeSchema}
          />
        )
      );

      const UpdateDialog = dialog({name: `${schemaId}_update`})(
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

  function mapStateToProps(state, {match}) {
    return {
      url: getCollectionUrl(state, schemaId, match.params),
      activeSchema: getSchema(state, schemaId),
      headers: getHeaders(state, schemaId),
      pageCount: getPageCount(state, schemaPlural),
      activePage: getActivePage(state, schemaPlural),
      data: getData(state, schemaPlural),
      linkUrl: getLinkUrl(state, schemaPlural),
      sortOptions: getSortOptions(state, schemaPlural),
      resourceTitle: getResourceTitle(state, schemaId),
      filters: getFilters(state, schemaPlural),
      pageLimit: getPageLimit(state, schemaPlural),
      limit: getLimit(state, schemaPlural),
      totalCount: getTotalCount(state, schemaPlural),
      isLoading: getIsLoading(state, schemaPlural),
      createPermission: hasCreatePermission(state, schemaId),
      updatePermission: hasUpdatePermission(state, schemaId),
      deletePermission: hasDeletePermission(state, schemaId)
    };
  }

  function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      openCreateDialog: openDialog(`${schemaId}_create`),
      closeCreateDialog: closeDialog(`${schemaId}_create`),
      openUpdateDialog: openDialog(`${schemaId}_update`),
      closeUpdateDialog: closeDialog(`${schemaId}_update`),
      updateBreadcrumb,
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
