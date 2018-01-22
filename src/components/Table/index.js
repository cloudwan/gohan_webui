import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Checkbox, ProgressBar, Intent} from '@blueprintjs/core';
import {Tooltip2} from '@blueprintjs/labs';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {faLink, faPencilAlt} from '@fortawesome/fontawesome-free-solid';
import {faTrashAlt} from '@fortawesome/fontawesome-free-regular';

import Table from './Table';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableRow from './TableRow';
import TableHeaderCell from './CellComponents/TableHeaderCell';
import TableDataCell from './CellComponents/TableDataCell';
import TableDataBooleanCell from './CellComponents/TableDataBooleanCell';
import TableDataCodeCell from './CellComponents/TableDataCodeCell';
import TableDataLinkCell from './CellComponents/TableDataLinkCell';
import SortIcon from './CellComponents/SortIcon';
import InputCheckRow from './CellComponents/InputCheckRow';

class TableComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedAll: false,
      sortKey: props.sortOptions.sortKey,
      sortOrder: props.sortOptions.sortOrder
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.length !== 0 && nextProps.data.length === nextProps.checkboxColumn.checkedItems.length) {
      this.setState({checkedAll: true});
    } else {
      this.setState({checkedAll: false});
    }
  }

  extractIdsFromData = () => {
    const {data} = this.props;

    return data.map(item => item.id);
  };

  handleCheckAllChange = () => {
    const {checkedAll: checkboxValue} = this.state;
    const {checkboxColumn} = this.props;

    if (!checkboxValue) {
      checkboxColumn.onCheckboxClick(this.extractIdsFromData());
    } else {
      checkboxColumn.onCheckboxClick([]);
    }

    this.setState({checkedAll: checkboxValue});
  };

  handleRowCheckboxChange = id => {
    if (this.props.checkboxColumn.checkedItems.includes(id)) {
      this.props.checkboxColumn.onCheckboxClick(this.props.checkboxColumn.checkedItems.filter(i => i !== id));
    } else {
      this.props.checkboxColumn.onCheckboxClick([...this.props.checkboxColumn.checkedItems, id]);
    }
  };

  handleSortClick = newSortKey => {
    const {sortKey, sortOrder} = this.state;
    let newSortOrder = 'asc';

    if (sortKey === newSortKey) {
      switch (sortOrder) {
        case 'asc':
          newSortOrder = 'desc';
          break;
        case 'desc':
          newSortOrder = '';
          break;
        default:
          newSortOrder = 'asc';
      }
    } else {
      newSortOrder = 'asc';
    }

    this.setState({
      sortKey: newSortKey,
      sortOrder: newSortOrder
    }, this.props.sortOptions.onChange(newSortKey, newSortOrder));
  };

  render() {
    const {
      columns,
      data,
      optionsColumn,
      checkboxColumn,
      url
    } = this.props;
    const {
      sortKey,
      sortOrder,
      checkedAll
    } = this.state;
    const {checkedItems} = checkboxColumn;
    let columnsLength = columns.length;
    if (checkboxColumn && checkboxColumn.visible) columnsLength++;
    if (optionsColumn) columnsLength++;

    return (
      <Table className={'gohan-table table'}>
        <TableHeader>
          <TableRow>
            {checkboxColumn && checkboxColumn.visible && (
              <TableHeaderCell className={'checkbox'}>
                <Checkbox indeterminate={
                  (checkboxColumn.checkedItems.length > 0) &&
                  (data.length !== checkboxColumn.checkedItems.length)
                }
                  onChange={this.handleCheckAllChange}
                  checked={checkedAll}
                />
              </TableHeaderCell>
            )}

            {columns && columns.length > 0 && columns.map((column, index) => {
              return (
                <TableHeaderCell key={index}
                  className={(sortKey === (column.sortingKey || column.id) && sortOrder !== '') ? 'active' : ''}>
                  <a onClick={() => this.handleSortClick(column.sortingKey || column.id)}>
                    {column.title}
                    {(sortKey === (column.sortingKey || column.id)) && (
                      <SortIcon sortOrder={sortOrder}/>
                    )}
                  </a>
                </TableHeaderCell>
              );
            })}
            {optionsColumn && (
              <TableHeaderCell className="text-right column-action" />
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 && data.map(item => {
            return (
              <TableRow key={item.id}
                active={item.deleting}>
                {checkboxColumn && checkboxColumn.visible && (
                  <TableDataCell>
                    <InputCheckRow id={item.id}
                      onChange={this.handleRowCheckboxChange}
                      checked={checkedItems.includes(item.id)}
                      disabled={Boolean(item.deleting)}
                    />
                  </TableDataCell>
                )}

                {columns && columns.length > 0 && columns.map((column, index) => {
                  if (item[column.id] === undefined) {
                    return (
                      <TableDataCell />
                    );
                  }

                  if (column.type.includes('boolean')) {
                    return (
                      <TableDataBooleanCell key={index}>
                        {item[column.id]}
                      </TableDataBooleanCell>
                    );
                  } else if (column.type.includes('link')) {
                    return (
                      <TableDataLinkCell url={item[column.id].url}
                        id={item[column.id].id}
                        key={index}>
                        {item[column.id].name}
                      </TableDataLinkCell>
                    );
                  } else if (column.type.includes('array') || column.type.includes('object')) {
                    return (
                      <TableDataCodeCell key={index}>
                        {item[column.id]}
                      </TableDataCodeCell>
                    );
                  }

                  if (column.id === 'name') {
                    return (
                      <TableDataLinkCell url={url} id={item.id}
                        key={index}>
                        {item[column.id]}
                      </TableDataLinkCell>
                    );
                  }

                  if (item[column.id] !== null && typeof item[column.id] === 'object') {
                    return (
                      <TableDataCell key={index}>
                        {item[column.id].name}
                      </TableDataCell>
                    );
                  }

                  if (column.id === 'status') {
                    return (
                      <TableDataCell key={index}
                        className={`${column.id} ${item[column.id]}`}>
                        {item[column.id]}
                      </TableDataCell>
                    );
                  }

                  return (
                    <TableDataCell key={index}>
                      {item[column.id]}
                    </TableDataCell>
                  );
                })}

                {item.deleting && (
                  <TableDataCell>
                    <ProgressBar intent={Intent.PRIMARY} />
                  </TableDataCell>
                )}
                {!item.deleting && optionsColumn && (
                  <TableDataCell className="text-right column-action">
                    <Tooltip2 content="Detail" placement="auto">
                      <Link to={`${url}/${item.id}`}
                        className="action-icon link mr-2">
                        <FontAwesomeIcon className="faicon" icon={faLink} />
                      </Link>
                    </Tooltip2>
                    {optionsColumn.edit && optionsColumn.edit.visible && (
                      <Tooltip2 content="Edit" placement="auto">
                        <span onClick={() => optionsColumn.edit.onClick(item)} className="action-icon edit mr-2">
                          <FontAwesomeIcon className="faicon" icon={faPencilAlt} />
                        </span>
                      </Tooltip2>
                    )}
                    {optionsColumn.remove && optionsColumn.remove.visible && (
                      <Tooltip2 content="Delete" placement="auto">
                        <span onClick={() => optionsColumn.remove.onClick(item.id)} className="action-icon delete mr-2">
                          <FontAwesomeIcon className="faicon" icon={faTrashAlt} />
                        </span>
                      </Tooltip2>
                    )}
                  </TableDataCell>
                )}

              </TableRow>
            );
          })
          }
          {data && data.length === 0 && (
            <TableRow>
              <TableDataCell className="no-data" colSpan={columnsLength}>
                No Data
              </TableDataCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  }
}

TableComponent.propTypes = {
  sortOptions: PropTypes.shape({
    sortKey: PropTypes.string,
    sortOrder: PropTypes.string,
    onChange: PropTypes.func
  }),
  data: PropTypes.array,
  columns: PropTypes.array,
  checkboxColumn: PropTypes.shape({
    visible: PropTypes.bool,
    onCheckboxClick: PropTypes.func,
    checkedItems: PropTypes.array
  }),
  optionsColumn: PropTypes.shape({
    edit: PropTypes.shape({
      visible: PropTypes.bool,
      onClick: PropTypes.func
    }),
    remove: PropTypes.shape({
      visible: PropTypes.bool,
      onClick: PropTypes.func
    })
  })
};

export default TableComponent;
