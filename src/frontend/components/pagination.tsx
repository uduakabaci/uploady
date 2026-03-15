import { useMemo } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
};

type PaginationButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  ariaCurrent?: "page";
};

const paginationButtonBaseClass =
  "min-w-9 border px-3 py-2 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-45 rounded-[10px] cursor-pointer";

function PaginationButton({ label, onClick, disabled, active, ariaCurrent }: PaginationButtonProps) {
  const classes = [
    paginationButtonBaseClass,
    active ? "border-ui-7 bg-ui-8 text-ui-1" : "border-ui-6 bg-ui-7 text-ui-2 hover:bg-ui-6",
  ].join(" ");

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={classes} aria-current={ariaCurrent}>
      {label}
    </button>
  );
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  maxVisible = 5,
}: PaginationProps) {
  const safePage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, totalItems);

  const visiblePages = useMemo(() => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const windowStart = Math.max(1, Math.min(safePage - 2, totalPages - (maxVisible - 1)));
    return Array.from({ length: maxVisible }, (_, index) => windowStart + index);
  }, [maxVisible, safePage, totalPages]);

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[10px]  bg-ui-8 px-3 py-2">
      <p className="text-ui-4 text-sm">
        Showing <span className="text-ui-1">{startIndex}</span>-<span className="text-ui-1">{endIndex}</span> of{" "}
        <span className="text-ui-1">{totalItems}</span>
      </p>

      <div className="flex items-center gap-1">
        <PaginationButton
          label="Prev"
          onClick={() => onPageChange(Math.max(1, safePage - 1))}
          disabled={safePage === 1}
        />

        {visiblePages.map(page => (
          <PaginationButton
            key={page}
            label={String(page)}
            onClick={() => onPageChange(page)}
            active={page === safePage}
            ariaCurrent={page === safePage ? "page" : undefined}
          />
        ))}

        <PaginationButton
          label="Next"
          onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
          disabled={safePage === totalPages}
        />
      </div>
    </div>
  );
}
