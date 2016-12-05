import React, {Component, PropTypes} from 'react';
import {
  Paper,
  RefreshIndicator,
  Table,
  TableHeader,
  TableBody,
  RaisedButton,
  Toolbar,
  ToolbarGroup,
  SelectField,
  TextField,
  MenuItem
} from 'material-ui';
import PaginationComponent from 'react-ultimate-pagination-material-ui';
import TableHeaderComponent from './TableHeaderComponent.jsx';
import TableRowComponent from './TableRowComponent.jsx';

import Dialog from '../../dialog/Dialog';

const detailStyle = {
  padding: 15
};
const loadingIndicatorStyle = {
  margin: 'auto',
  position: 'relative'
};

class TableComponent extends Component {

  constructor(props) {
    super(props);

    const {schema} = props.schema;
    const propertiesOrderLen = schema.propertiesOrder.length;
    let filterProperty = '';

    for(let i = 0; i < propertiesOrderLen; i += 1) {
      const item = schema.propertiesOrder[i];
      const property = schema.properties[item];

      if (property && property.view && !property.view.includes('list') || item === 'id') {
        continue;
      }

      filterProperty = item;
      break;
    }

    this.state = {
      data: {},
      openModal: false,
      actionModal: 'create',
      filterProperty,
      filterValue: ''
    };
  }

  filterTimeoutId = null;

  handleOpenModal = () => {
    this.setState({openModal: true, actionModal: 'create', data: {}});
  };

  handleCloseModal = () => {
    this.setState({openModal: false});
  };

  handleSubmit = (data, id) => {
    if (this.state.actionModal === 'create') {
      this.props.createData(data);
    } else if (this.state.actionModal === 'update') {
      this.props.updateData(id, data);
    }
  };
  handlePageClick = page => {
    this.props.handleChangePage(page);
  };

  handleRemoveItem = id => {
    this.props.removeData(this.props.schema.url, id);
  };

  handleEditItem = id => {
    this.setState({openModal: true, actionModal: 'update', data: id});
  };

  ifShowModal = () => {
    if (this.state.openModal) {
      return (
        <Dialog open={this.state.openModal} action={this.state.actionModal}
          onRequestClose={this.handleCloseModal} schema={this.props.schema}
          onSubmit={this.handleSubmit} data={this.state.data}
        />
      );
    }
    return null;
  };

  filterData = () => {
    let value = this.state.filterValue;
    const property = this.state.filterProperty;

    if(value === undefined || value === '') {
      value = null;
    }

    const filters = {};
    filters[property] = value;

    this.props.filterData(filters);
  };

  handleMenuItemSelected = (event, index, filterProperty) => {
    if(event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({filterProperty}, this.filterData);
  };

  handleSearchChange = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    clearTimeout(this.filterTimeoutId);

    this.setState({filterValue: event.target.value});

    this.filterTimeoutId = setTimeout(() => {
      this.filterData();
    }, 2000);

  };

  render() {
    const {schema, singular} = this.props.schema;

    if (this.props.isLoading) {
      return (
        <RefreshIndicator size={60} left={0}
          top={0} status="loading"
          style={loadingIndicatorStyle}
        />
      );
    }
    return (
      <Paper style={detailStyle}>
        <Toolbar>
          <ToolbarGroup>
          <RaisedButton onClick={this.handleOpenModal}
            label={'Add new ' + singular}
            style={{margin: '8px 8px 8px 8px', marginRight: 'auto'}}
            primary={true}
          />
          </ToolbarGroup>
          <ToolbarGroup>
            <SelectField floatingLabelText={'Filter by'} value={this.state.filterProperty} onChange={this.handleMenuItemSelected}>
              {
                schema.propertiesOrder.map((item, index) => {
                  const property = schema.properties[item];

                  if (property && property.view && !property.view.includes('list')) {
                    return null;
                  }
                  if (item === 'id') {
                    return null;
                  }

                  return <MenuItem key={index} value={item} primaryText={schema.properties[item].title} />;
                })
              }
            </SelectField>
            <TextField floatingLabelText={'Search'} value={this.state.filterValue} onChange={this.handleSearchChange} />
          </ToolbarGroup>
        </Toolbar>
        {this.ifShowModal()}
        <Table fixedHeader={true}>
          <TableHeader>
            <TableHeaderComponent schema={schema}/>
          </TableHeader>
          <TableBody displayRowCheckbox={false} showRowHover={true}>
            {this.props.data.map((item, index) => (
              <TableRowComponent key={index} schema={this.props.schema}
                item={item} onRemoveClick={this.handleRemoveItem}
                onEditClick={this.handleEditItem}
              />
            ))}
          </TableBody>
        </Table>
        {(() => {
          if (this.props.pageCount > 1) {
            return (
              <PaginationComponent currentPage={this.props.activePage} totalPages={this.props.pageCount}
                onChange={this.handlePageClick}
              />
            );
          }
          return null;
        })()}
      </Paper>
    );
  }
}

TableComponent.contextTypes = {
  router: PropTypes.object
};

TableComponent.propTypes = {
  schema: PropTypes.object.isRequired,
  pageCount: PropTypes.number,
  activePage: PropTypes.number
};

export default TableComponent;
