import "./Pagination.css";

function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="pagination">

      {}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {}
      {Array.from(
        { length: totalPages },
        (_, index) => {
          const pageNumber = index + 1;

          return (
            <button
              key={pageNumber}
              className={
                currentPage === pageNumber
                  ? "active-page"
                  : ""
              }
              onClick={() =>
                handlePageChange(pageNumber)
              }
            >
              {pageNumber}
            </button>
          );
        }
      )}

      {}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>

    </div>
  );
}

export default Pagination;