import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import jsyaml from 'js-yaml';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/yaml/yaml';

import {Tooltip, Popover, PopoverInteractionKind, Position} from '@blueprintjs/core';

class TableRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedRow: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.rowItem.id !== nextProps.rowItem.id) {
      this.setState({checkedRow: false});
    }

    if (this.props.checkedAll.checked !== nextProps.checkedAll.checked && nextProps.checkedAll.changedByRow === false) {
      this.setState({checkedRow: nextProps.checkedAll.checked});
    }
  }

  handleRemoveClick = () => {
    const {rowItem} = this.props;

    this.props.onRemoveClick(rowItem);
  };

  handleEditClick = () => {
    const {rowItem} = this.props;

    this.props.onEditClick(rowItem);
  };

  handleCheckboxChange = () => {
    const {rowItem} = this.props;

    this.setState({checkedRow: !this.state.checkedRow}, () => {
      this.props.onCheckboxChange(rowItem.id, this.state.checkedRow);
    });
  };

  buildPopover = data => {
    const popoverContent = <CodeMirror value={jsyaml.safeDump(data)}
      options={{
        mode: 'yaml',
        lineNumbers: true,
        readOnly: true,
        cursorBlinkRate: -1
      }}
    />;
    return (
      data === null ? '' : <Popover content={popoverContent}
        interactionKind={PopoverInteractionKind.CLICK}
        popoverClassName="pt-popover-content-sizing"
        position={Position.RIGHT}
        useSmartPositioning={true}>
        <button className="pt-button">view</button>
      </Popover>
    );
  };

  buildTableRow = () => {
    const {visibleColumns, rowItem} = this.props;
    const {url} = this.props.schema;
    return visibleColumns.map((column, index) => {
      const data = rowItem[column];

      if (typeof data === 'object') {
        const popover = this.buildPopover(data);

        return (
          <td key={index}>
            {popover}
          </td>
        );
      }
      if (column === 'name') {
        return (
          <td key={index}>
            <Link to={`${url}/${rowItem.id}`}>{data}</Link>
          </td>
        );
      }

      return (
        <td key={index}>
          {String(data)}
        </td>
      );
    });
  };


  render() {
    return (
      <tr className="row">
        <td key={this.props.rowItem.id}>
          <input type="checkbox" onChange={this.handleCheckboxChange}
            checked={this.state.checkedRow}
          />
        </td>
        {this.buildTableRow()}
        <td>
          <Tooltip content='Edit' hoverOpenDelay={50}>
            <span className="pt-icon-standard pt-icon-edit" onClick={this.handleEditClick}/>
          </Tooltip>
          <Tooltip content='Delete' hoverOpenDelay={50}>
            <span className="pt-icon-standard pt-icon-trash" onClick={this.handleRemoveClick}
              style={{marginLeft: '15px'}}
            />
          </Tooltip>
        </td>
      </tr>
    );
  }
}

TableRow.contextTypes = {
  router: PropTypes.object
};

TableRow.propTypes = {
  schema: PropTypes.object.isRequired,
  visibleColumns: PropTypes.array.isRequired,
  rowItem: PropTypes.object.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  checkedAll: PropTypes.object.isRequired
};

export default TableRow;
