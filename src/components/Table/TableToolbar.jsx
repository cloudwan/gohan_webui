import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Filter from './ToolbarComponents/Filter';

class TableToolbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterProperty: '',
      filterValue: ''
    };
  }

  handleDeleteSelectedClick = () => {
    this.props.deleteSelected.onClick();
  };

  handleNewResourceClick = () => {
    this.props.newResource.onClick();
  };

  render() {
    return (
      <div className="container-fluid gohan-table-header">
        <div className="row justify-content-between align-items-center">
          <div className="col-auto resource-name">
            <h3>{this.props.newResource.title}</h3>
          </div>
          <div className="col-auto">
            <div className="form-inline">
              <div className="form-group">
                <span className="filterby mr-sm-1">Filter by</span>
                <Filter properties={this.props.filters.properties}
                  onChange={this.props.filters.onChange}
                  by={this.props.filters.by}
                  value={this.props.filters.value}
                />
                <button className={(this.props.deleteSelected.disabled) ? 'd-none' : 'btn btn-danger mr-sm-1'}
                  onClick={this.handleDeleteSelectedClick}>
                  Delete Selected
                </button>
                <button className="btn btn-primary"
                  onClick={this.handleNewResourceClick}>
                  <strong>+</strong> New
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TableToolbar.defaultProps = {
  newResource: {
    title: 'resource',
    onClick: () => {
    }
  },
  deleteSelected: {
    disabled: true,
    onClick: () => {
    }
  },
  filters: {
    by: '',
    value: '',
    properties: [],
    onChange: () => {
    }
  }
};

TableToolbar.propTypes = {
  newResource: PropTypes.shape({
    title: PropTypes.string,
    onClick: PropTypes.func
  }),
  deleteSelected: PropTypes.shape({
    disabled: PropTypes.bool,
    onClick: PropTypes.func
  }),
  filters: PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string,
    properties: PropTypes.array,
    onChange: PropTypes.func
  })
};

export default TableToolbar;
