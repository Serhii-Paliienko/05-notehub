import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className={css.wrapper}>
      <ReactPaginate
        forcePage={currentPage - 1}
        pageCount={pageCount}
        onPageChange={(e) => onPageChange(e.selected + 1)}
        containerClassName={css.pagination}
        pageClassName={css.page}
        activeClassName={css.active}
        previousClassName={css.prev}
        nextClassName={css.next}
        breakClassName={css.break}
        nextLabel="&raquo;"
        previousLabel="&laquo;"
      />
    </div>
  );
};

export default Pagination;
