import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Table from '../components/Table';
import TableToolbar from '../components/Table/TableToolbar';
import TablePagination from '../components/Table/TablePagination';
import LoadingIndicator from '../components/LoadingIndicator';

class TableComponent extends Component {
  render() {
    const {isLoading} = this.props;

    if (isLoading) {
      return (
        <LoadingIndicator/>
      );
    }
    const {
      headers,
      title,
      url,
      toolbar,
      table,
      pagination,
      children,
      permissions
    } = this.props;

    return (
      <div className="table-container">
        {children}
        <div className={'pt-card pt-elevation-0'}>
          <TableToolbar deleteSelected={{
            disabled: table.checkboxColumn.checkedItems.length === 0,
            onClick: toolbar.onDeleteSelectedClick
          }}
            newResource={{
              onClick: toolbar.onAddResourceClick,
              title
            }}
            filters={{
              properties: headers,
              onChange: toolbar.filter.onChange,
              by: toolbar.filter.by,
              value: toolbar.filter.value
            }}
          />
          <Table data={table.data}
            url={url}
            columns={headers}
            checkboxColumn={{
              visible: permissions.remove,
              onCheckboxClick: table.checkboxColumn.onCheckboxClick,
              checkedItems: table.checkboxColumn.checkedItems
            }}
            optionsColumn={{
              edit: {
                visible: permissions.update,
                onClick: table.optionsColumn.edit.onClick
              },
              remove: {
                visible: permissions.remove,
                onClick: table.optionsColumn.remove.onClick
              }
            }}
            sortOptions={{
              sortKey: table.sort.sortKey,
              sortOrder: table.sort.sortOrder,
              onChange: table.sort.onChange
            }}
          />
          <TablePagination pageCount={pagination.pageCount}
            activePage={pagination.activePage}
            handlePageClick={pagination.onChangePage}
          />
        </div>
      </div>
    );
  }
}

TableComponent.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    }),
  ),
  title: PropTypes.string,
  url: PropTypes.string,
  toolbar: PropTypes.shape(),
  table: PropTypes.shape({
    data: PropTypes.array,
    checkboxColumn: PropTypes.shape({
      onCheckboxClick: PropTypes.func,
      checkedItems: PropTypes.arrayOf(
        PropTypes.string
      )
    }),
    optionsColumn: PropTypes.shape({
      edit: PropTypes.shape({
        onClick: PropTypes.func
      }),
      remove: PropTypes.shape({
        onClick: PropTypes.func
      })
    }),
    sort: PropTypes.shape({
      sortKey: PropTypes.string,
      sortOrder: PropTypes.string,
      onChange: PropTypes.func
    })
  }),
  pagination: PropTypes.shape({
    activePage: PropTypes.number,
    onChangePage: PropTypes.func,
    pageCount: PropTypes.number
  }),
  permissions: PropTypes.shape({
    create: PropTypes.bool,
    update: PropTypes.bool,
    remove: PropTypes.bool
  }),
  children: PropTypes.node,
};

export default TableComponent;
