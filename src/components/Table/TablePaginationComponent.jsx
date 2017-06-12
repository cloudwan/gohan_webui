import React, {Component} from 'react';
import ReactPaginate from 'react-paginate';

import './TablePagination.scss';

class TablePaginationComponent extends Component {

  handlePageChange = ({selected}) => {
    this.props.handlePageClick(selected);
  };

  render() {
    let pagination = null;

    if (this.props.pageCount > 1) {
      pagination = (
        <ReactPaginate className="table__pagination" previousLabel={''}
          nextLabel={''} breakLabel={<a>...</a>}
          breakClassName={'pt-button pt-disabled'} initialPage={this.props.activePage}
          pageCount={this.props.pageCount} marginPagesDisplayed={2}
          pageRangeDisplayed={5} onPageChange={this.handlePageChange}
          containerClassName={'table__pagination pt-button-group'}
          activeClassName={'pt-active'} pageClassName={'pt-button'}
          previousClassName={'pt-button'} nextClassName={'pt-button'}
          previousLinkClassName={'pt-icon-chevron-left'} nextLinkClassName={'pt-icon-chevron-right'}
          disabledClassName={'pt-disabled'} disableInitialCallback={true}
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
