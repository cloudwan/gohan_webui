import React from 'react';

export default class EditButton extends React.Component {
  constructor(params) {
    super(params);
  }

  render() {
    return (
      <td className = 'action_column'>
        <div className = 'btn-group'>
          <a className = 'btn btn-default btn-sm gohan_update btn-raised btn-material-blue-600'
            data-id = {this.props.id}
            onClick = {this.props.editModel.bind(this)} >
              Edit
          </a>
          <button type = 'button'
            className = 'btn btn-default btn-sm dropdown-toggle'
            data-toggle = 'dropdown'
            aria-expanded = 'true'
            data-container = 'body' >
            <span className = 'caret'></span>
            <span className = 'sr-only'>Toggle Dropdown</span>
          </button>
          <ul className = 'dropdown-menu pull-right' role = 'menu' >
            <li>
              <a className = 'gohan_delete'
                data-id = {this.props.id}
                onClick = {this.props.deleteModel.bind(this)} >
                  Delete
              </a>
            </li>
          </ul>
        </div>
      </td>
    );
  }
}
