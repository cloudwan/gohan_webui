import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

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

  extractIdsFromData = () => {
    const {data} = this.props;

    return data.map(item => item.id);
  };

  handleCheckAllChange = () => {
    const {checked: checkboxValue} = this.checkAllCheckbox;
    const {checkboxColumn} = this.props;

    if (checkboxValue) {
      checkboxColumn.onCheckboxClick(this.extractIdsFromData(), true);
    } else {
      checkboxColumn.onCheckboxClick([], true);
    }

    this.setState({checkedAll: checkboxValue});
  };

  handleRowCheckboxChange = id => {
    const {checked: checkboxValue} = this.checkAllCheckbox;
    this.props.checkboxColumn.onCheckboxClick([id], false);
    if (checkboxValue) {
      this.setState({checkedAll: false});
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

    return (
      <Table className={'table pt-table pt-interactive'}>
        <TableHeader>
          <TableRow>
            {checkboxColumn && checkboxColumn.visible && (
              <TableHeaderCell>
                <input type="checkbox"
                  onChange={this.handleCheckAllChange}
                  ref={input => {this.checkAllCheckbox = input;}}
                  checked={checkedAll}
                />
              </TableHeaderCell>
            )}

            {columns && columns.length > 0 && columns.map((column, index) => {
              return (
                <TableHeaderCell key={index}>
                  <a onClick={() => this.handleSortClick(column.id)}>
                    {column.title}
                    {(sortKey === column.id) && (
                      <SortIcon sortOrder={sortOrder}/>
                    )}
                  </a>
                </TableHeaderCell>
              );
            })}
            {optionsColumn && (
              <TableHeaderCell>
                Options
              </TableHeaderCell>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 && data.map(item => {
            return (
              <TableRow key={item.id}>
                {checkboxColumn && checkboxColumn.visible && (
                  <TableDataCell>
                    <InputCheckRow id={item.id}
                      onChange={this.handleRowCheckboxChange}
                      checked={checkedItems.includes(item.id)}
                    />
                  </TableDataCell>
                )}

                {columns && columns.length > 0 && columns.map((column, index) => {
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

                  return (
                    <TableDataCell key={index}>
                      {item[column.id]}
                    </TableDataCell>
                  );
                })}

                {optionsColumn && (
                  <TableDataCell>
                    <Link to={`${url}/${item.id}`}>
                      <span className="pt-icon-standard pt-icon-link" />
                    </Link>
                    {optionsColumn.edit && optionsColumn.edit.visible && (
                      <span onClick={() => optionsColumn.edit.onClick(item)}
                        className="pt-icon-standard pt-icon-edit"
                      />
                    )}
                    {optionsColumn.remove && optionsColumn.remove.visible && (
                    <span onClick={() => optionsColumn.remove.onClick(item.id)}
                      className="pt-icon-standard pt-icon-trash"
                      style={{marginLeft: 3}}
                    />
                    )}
                  </TableDataCell>
                )}

              </TableRow>
            );
          })
          }
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
