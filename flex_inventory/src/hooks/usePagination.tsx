import { useMemo } from 'react';

interface UsePaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export const usePagination = ({ page, totalPages, setPage }: UsePaginationProps) => {
  const pagination = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;

    const start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    const adjustedStart = Math.max(1, end - maxVisible + 1);

    const baseBtn =
      'cursor-pointer px-3 py-1 rounded-md border text-sm hover:bg-blue-100 transition duration-200';
    const activeBtn = 'bg-blue-500 text-white font-semibold';

    pages.push(
      <button
        key="prev"
        onClick={() => setPage(page - 1)}
        disabled={isFirstPage}
        className={`${baseBtn} ${isFirstPage ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        ◀
      </button>
    );

    if (adjustedStart > 1) {
      pages.push(
        <button key={1} onClick={() => setPage(1)} className={baseBtn}>
          1
        </button>
      );
      if (adjustedStart > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2">
            ...
          </span>
        );
      }
    }

    for (let i = adjustedStart; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`${baseBtn} ${page === i ? activeBtn : ''}`}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2">
            ...
          </span>
        );
      }
      pages.push(
        <button key={totalPages} onClick={() => setPage(totalPages)} className={baseBtn}>
          {totalPages}
        </button>
      );
    }

    pages.push(
      <button
        key="next"
        onClick={() => setPage(page + 1)}
        disabled={isLastPage}
        className={`${baseBtn} ${isLastPage ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        ▶
      </button>
    );

    return <div className="flex gap-2 mt-4 flex-wrap">{pages}</div>;
  }, [page, totalPages, setPage]);

  return pagination;
};
