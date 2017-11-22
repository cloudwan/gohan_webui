import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Button} from '@blueprintjs/core';
import {Row, Col} from 'react-flexbox-grid';

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
      <Row between={'xs'}
        middle={'xs'}>
        <Col>
          <Button text={`New ${this.props.newResource.title}`}
            iconName={'plus'}
            className={'pt-intent-primary'}
            onClick={this.handleNewResourceClick}
          />
          <Button text={'Delete selected'}
            iconName={'trash'}
            onClick={this.handleDeleteSelectedClick}
            disabled={this.props.deleteSelected.disabled}
          />
        </Col>
        <Col>
          <Filter properties={this.props.filters.properties}
            onChange={this.props.filters.onChange}
            by={this.props.filters.by}
            value={this.props.filters.value}
          />
        </Col>
      </Row>
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
