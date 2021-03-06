import React, {Component} from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import CustomActions from '../../CustomActions';

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
    const {filters} = this.props;
    let currentFilters = !filters.includeRelations ?
      filters.properties.filter(item => !item.hasRelation) :
      filters.properties;

    if (filters.onlyStringTypes) {
      currentFilters = currentFilters.filter(item => {
        const {type} = item;

        if (Array.isArray(type) && type.includes('string')) {
          return true;
        } else if (typeof type === 'string' && type === 'string') {
          return true;
        }

        return false;
      });
    }

    if (!currentFilters.some(item => item.id === 'id')) {
      currentFilters.push({
        id: 'id',
        title: 'ID',
        type: 'string',
        hasRelation: false
      });
    }

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
                <Filter properties={currentFilters}
                  onChange={this.props.filters.onChange}
                  by={this.props.filters.by}
                  value={this.props.filters.value}
                />
                <button className={(this.props.deleteSelected.disabled) ? 'd-none' : 'btn btn-danger mr-sm-1'}
                  onClick={this.handleDeleteSelectedClick}>
                  Delete Selected
                </button>
                {this.props.newResource.visible && (
                  <button className={`btn btn-primary${!isEmpty(this.props.actions) ? ' mr-sm-1' : ''}`}
                    onClick={this.handleNewResourceClick}>
                    <strong>+</strong> New
                  </button>
                )}
                {!isEmpty(this.props.actions) && (
                  <CustomActions actions={this.props.actions}
                    baseUrl={this.props.url}
                    id={this.props.id}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {filters.substringSearchSupport === false && (
          <div className="row substring-search-no-support text-right">
            Substring search is not supported for this resource
          </div>
        )}
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
    },
    onlyStringTypes: true,
    includeRelations: false
  }
};

TableToolbar.propTypes = {
  newResource: PropTypes.shape({
    visible: PropTypes.bool,
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
    onChange: PropTypes.func,
    onlyStringTypes: PropTypes.bool,
    substringSearchSupport: PropTypes.bool,
    includeRelations: PropTypes.bool
  }),
  actions: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default TableToolbar;
