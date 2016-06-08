import React from 'react';

import {
  Pagination
} from 'react-bootstrap';

import BaseComponent from './baseComponent.jsx';
import TableRow from './tableRow.jsx';
import SearchInput from './searchInput.jsx';

export default class TableComponent extends BaseComponent {
  constructor(params) {
    super(params);

    this.searchInput = this.props.searchInput || SearchInput;
    this.tableRow = this.props.tableRow || TableRow;

    this.searchQuery = {
      sortKey: '',
      propField: ''
    };
    this.activePage = 1;
  }


  componentDidMount() {
    this.fetchByQuery();
  }

  createButtonHandler(event) {
    this.props.makeDialog(event);
  }

  onEffectiveInputChange(searchQuery) {
    this.searchQuery = Object.assign(this.searchQuery, searchQuery);
    this.fetchData();
  }

  fetchData() {
    const property = this.searchQuery.propField;
    const value = this.searchQuery.sortKey;

    if (value === '') {
      this.fetchByQuery();
    } else {
      this.fetchByQuery(property, value);
    }
  }

  fetchByQuery(property, value) {
    this.props.collection.resetFilters();
    this.activePage = 1;
    this.props.collection.filter(property, value).then(() => {

      if ( this.props.polling ) {
        this.props.collection.startLongPolling();
      }

    }, (...param) => {
      this.props.errorView.render(param[1]);
    });
  }

  fetchByPageNumber(pageNo = this.state.currentPage) {
    this.props.collection.getPage(pageNo).then(() => {

      if (this.props.polling) {
        this.props.collection.startLongPolling();
      }
    }, (...param) => {
      this.props.errorView.render(param[1]);
    });
  }

  getTableHeader() {
    const schema = this.props.schema;

    return schema.schema.propertiesOrder.map(key => {
      const property = schema.schema.properties[key];
      const view = property['view'];

      if (view && !view.includes('list')) {
        return null;
      }
      if (!this.searchQuery.propField) {
        this.searchQuery.propField = key;
      }

      return (
        <th key = {key} >
          <a href = {'#' + schema.url.substring(1)}
            className = 'title'
            data-id = {key} >
            {property.title}
          </a>
        </th>
      );
    });
  }

  getItemList() {
    let list = this.props.collection.map(model => {
      const data = model.toJSON();
      const result = Object.assign({}, data);

      return result;
    });

    return list;
  }

  changeActivePage(pageNo) {
    this.activePage = pageNo;
    this.fetchByPageNumber(pageNo - 1);
  }

  getPageList() {
    const pageList = [];
    for (let i = 0; i < Math.ceil(this.props.collection.total / this.props.collection.pageLimit); i++) {
      pageList.push(i);
    }
    return pageList;
  }

  render() {
    const schema = this.props.schema;
    const tableHeader = this.getTableHeader();
    const list = this.getItemList();
    const pageList = this.getPageList(list);
    const itemList = list.map((item, index) => {
      return <this.tableRow key = {'row' + index}
        schema = {schema}
        item = {item}
        index = {index}
        editModel = {this.props.editModel.bind(this)}
        deleteModel = {this.props.deleteModel.bind(this)}
      />;
    });

    if (this.props.app && !this.props.childview) { // try not doing this on every render??
      this.props.app.breadCrumb.update([this.props.collection]);
    }

    return (
      <div id = 'main_body'>
        <div className = 'tableview'>
          <div className = 'container-fluid table_search'>
            <div className = 'row'>
              <div className = 'col-xs-6 resource_name'>
                <h2>{schema.title}</h2>
              </div>
              <div className = 'col-xs-6 func'>
                <form className = 'form-inline'>
                  <div className = 'form-group'>
                    <span>Filter by:</span>
                    <this.searchInput changeCallback = {this.onEffectiveInputChange.bind(this)}
                      delay = {500}
                      schema = {schema}
                    />
                    <a className = 'btn btn-primary gohan_create'
                      onClick = {this.createButtonHandler.bind(this)}>
                      <strong>+</strong>
                      {' New'}
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className = 'card'>
            <table className = 'table table-hover gohan-table'>
              <thead>
                <tr>
                  {tableHeader}
                  <th></th>
                </tr>
              </thead>
              <tbody id = {this.activePage}>
                {itemList}
              </tbody>
            </table>
          </div>
        </div>
        <nav>
          {(() => {
            if (pageList.length > 1) {
              return <Pagination prev = {true} next = {true}
                first = {true} last = {true}
                ellipsis = {true} boundaryLinks = {true}
                items = {pageList.length} maxButtons = {5}
                activePage = {this.activePage}
                onSelect = {this.changeActivePage.bind(this)}
                onClick = {event => event.preventDefault()}
              />;
            }
          })()}
        </nav>
      </div>
    );
  }
}

TableComponent.propTypes = {
  collection: React.PropTypes.object,
  model: React.PropTypes.object,
  app: React.PropTypes.object,
  schema: React.PropTypes.object.isRequired,
  polling: React.PropTypes.bool
};
