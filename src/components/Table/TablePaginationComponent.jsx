import React, {Component} from 'react';
import ReactPaginate from 'react-paginate';

class TablePaginationComponent extends Component {

  handlePageChange = ({selected}) => {
    this.props.handlePageClick(selected);
  };

  render() {
    let pagination = null;

    if (this.props.pageCount > 1) {
      pagination = (
        <ReactPaginate className="pagination" previousLabel={'previous'}
          nextLabel={'next'} breakLabel={<span>...</span>}
          breakClassName={'break-me'} initialPage={this.props.activPage}
          pageCount={this.props.pageCount} marginPagesDisplayed={2}
          pageRangeDisplayed={5} onPageChange={this.handlePageChange}
          containerClassName={'pagination'} subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
      );
    }

    return (
      <div>
        {pagination}
      </div>
    );
  }
}

export default TablePaginationComponent;
