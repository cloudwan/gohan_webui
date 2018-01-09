import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import dialog from './../Dialog';
import {
  parse as queryParse,
  stringify as queryStringify
} from 'query-string';

import isEqual from 'lodash/isEqual';

import TableComponent from './components/Table';

import {update as updateBreadcrumb} from './../Breadcrumbs/breadcrumbsActions';

import {getSchema} from './../schema/schemaSelectors';

import {
  getHeaders,
  getPageCount,
  getActivePage,
  getData,
  getSortOptions,
  getResourceTitle,
  getFilters,
  getLimit,
  getTotalCount,
  getIsLoading
} from './tableSelectors';

import {
  getCollectionUrl,
  hasCreatePermission,
  hasUpdatePermission,
  hasDeletePermission
} from '../schema/schemaSelectors';
import {
  fetch,
  cancelFetch,
  clear,
  create,
  update,
  purge,
} from './tableActions';

import Dialog from '../Dialog/Dialog';

import {
  openDialog,
  closeDialog
} from '../Dialog/dialogActions';
import {Alert, Intent} from '@blueprintjs/core';

export const getTableView = (schema, Table = TableComponent, isChildView = false, options = {}) => {
  const schemaId = schema.id;
  const schemaTitle = schema.title;

  class TableView extends Component {
    componentDidMount() {
      if (!isChildView) {
        const query = queryParse(this.props.location.search, {arrayFormat: 'bracket'});
        this.props.updateBreadcrumb([
          {
            title: schemaTitle,
            url: this.props.url,
          }
        ]);

        if (query.filters) {
          try {
            query.filters = query.filters
              .map(item => queryParse(item))
              .map(item => ({
                key: Object.keys(item)[0],
                value: item[Object.keys(item)[0]]
              }));
          } catch (error) {
            console.error(error);
          }
        }
        this.props.fetch({...options, ...query});
      } else {
        this.props.fetch({...options});
      }
    }

    componentWillUnmount() {
      this.props.cancelFetch();
      this.props.clear();
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
      this.props.purge(this.state.removedItemId);
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

      if (checkedRowsIds.length > 0) {
        this.props.purge(checkedRowsIds);
      }

      if (this.state.removalSelectedItemsAlertOpen) {
        this.handleCloseRemovalSelectedItemsAlert();
      }
    };

    handleCheckItems = itemsIds => {
      this.setState({
        checkedRowsIds: itemsIds
      });
    };

    componentWillReceiveProps(nextProps) {
      this.setState({
        checkedRowsIds: this.state.checkedRowsIds.filter(id => Boolean(nextProps.data.find(item => item.id === id)))
      });
    }

    shouldComponentUpdate(nextProps, nextState) {
      return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
    }

    handlePageChange = page => {
      const {totalCount, limit} = this.props;
      const newOffset = page * limit;

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

      this.props.fetch({
        offset: newOffset
      });

      this.setState({
        checkedRowsIds: []
      });
    };

    handleFilterData = property => {
      if (!isChildView) {
        this.props.history.replace({
          ...this.props.location,
          search: queryStringify({
            ...queryParse(this.props.location.search, {arrayFormat: 'bracket'}),
            filters: property === undefined ? undefined : [queryStringify(property)]
          }, {arrayFormat: 'bracket'})
        });
        this.props.fetch({
          offset: 0,
          filters: property === undefined ? [] : [{
            key: Object.keys(property)[0],
            value: property[Object.keys(property)[0]]
          }]
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
      this.props.fetch({
        sortKey: sortOrder === '' ? '' : sortKey,
        sortOrder: sortOrder === '' ? '' : sortOrder,
      });
    };

    handleOpenCreateDialog = () => {
      this.props.openCreateDialog();
    };

    handleCloseCreateDialog = () => {
      this.props.closeCreateDialog();
    };

    handleSubmitCreateDialog = data => {
      this.props.create(data);
    };

    handleOpenUpdateDialog = item => {
      this.setState({dialogData: item}, this.props.openUpdateDialog);
    };

    handleCloseUpdateDialog = () => {
      this.props.closeUpdateDialog();
    };

    handleSubmitUpdateDialog = (data, id) => {
      this.props.update(data, id);
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
      const filterValue = filters && filters[0] ? filters[0].value : '';
      const filterBy = filters && filters[0] ? filters[0].key : '';

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
    url: PropTypes.string.isRequired,
    activeSchema: PropTypes.object.isRequired,
    headers: PropTypes.array.isRequired,
    pageCount: PropTypes.number.isRequired,
    activePage: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    linkUrl: PropTypes.string.isRequired,
    sortOptions: PropTypes.object.isRequired,
    resourceTitle: PropTypes.string.isRequired,
    filters: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
    createPermission: PropTypes.bool.isRequired,
    updatePermission: PropTypes.bool.isRequired,
    deletePermission: PropTypes.bool.isRequired,
    openCreateDialog: PropTypes.func.isRequired,
    closeCreateDialog: PropTypes.func.isRequired,
    openUpdateDialog: PropTypes.func.isRequired,
    closeUpdateDialog: PropTypes.func.isRequired,
    updateBreadcrumb: PropTypes.func.isRequired,
    fetch: PropTypes.func.isRequired,
    cancelFetch: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
    purge: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    limit: PropTypes.number
  };

  function mapStateToProps(state, {match}) {
    return {
      url: getCollectionUrl(state, schemaId, match.params),
      activeSchema: getSchema(state, schemaId),
      headers: getHeaders(state, schemaId),
      pageCount: getPageCount(state, schemaId),
      activePage: getActivePage(state, schemaId),
      data: getData(state, schemaId),
      linkUrl: getCollectionUrl(state, schemaId, match.params),
      sortOptions: getSortOptions(state, schemaId),
      resourceTitle: getResourceTitle(state, schemaId),
      filters: getFilters(state, schemaId),
      limit: getLimit(state, schemaId),
      totalCount: getTotalCount(state, schemaId),
      isLoading: getIsLoading(state, schemaId),
      createPermission: hasCreatePermission(state, schemaId),
      updatePermission: hasUpdatePermission(state, schemaId),
      deletePermission: hasDeletePermission(state, schemaId)
    };
  }

  function mapDispatchToProps(dispatch, {match}) {
    return bindActionCreators({
      openCreateDialog: openDialog(`${schemaId}_create`),
      closeCreateDialog: closeDialog(`${schemaId}_create`),
      openUpdateDialog: openDialog(`${schemaId}_update`),
      closeUpdateDialog: closeDialog(`${schemaId}_update`),
      updateBreadcrumb,
      fetch: fetch(schemaId, match.params),
      cancelFetch: cancelFetch(schemaId),
      create: create(schemaId, match.params),
      update: update(schemaId, match.params),
      clear: clear(schemaId, match.params),
      purge: purge(schemaId, match.params),
    }, dispatch);
  }

  return connect(mapStateToProps, mapDispatchToProps)(TableView);
};
