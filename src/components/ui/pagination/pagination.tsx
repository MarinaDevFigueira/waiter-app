import { CaretLeftIcon, CaretRightIcon, DotsThree } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import { cn } from "@/lib/utils";
import type { UsePaginationReturn } from "@/shared/hooks/usePagination";

const DEFAULT_SIZE_OPTIONS = [5, 10, 20];

interface PaginationProps {
  children: React.ReactNode;
  className?: string;
}

interface PaginationInfoProps {
  startItem: number;
  endItem: number;
  total: number;
  className?: string;
}

interface PaginationSizeSelectProps {
  size: number;
  setPageSize: (size: number) => void;
  options?: number[];
  className?: string;
}

interface PaginationControlsProps
  extends Pick<
    UsePaginationReturn,
    | "page"
    | "totalPages"
    | "hasNextPage"
    | "hasPreviousPage"
    | "pageRange"
    | "nextPage"
    | "prevPage"
    | "goToPage"
  > {
  className?: string;
}

function Pagination({ children, className }: PaginationProps) {
  return (
    <div
      data-testid="pagination"
      className={cn("flex items-center justify-between gap-4 px-1", className)}
    >
      {children}
    </div>
  );
}

function PaginationInfo({ startItem, endItem, total, className }: PaginationInfoProps) {
  const hasItems = total > 0;
  return (
    <p
      data-testid="pagination-info"
      className={cn("text-sm text-muted-foreground shrink-0", className)}
    >
      {hasItems ? `${startItem}–${endItem} de ${total}` : "0 itens"}
    </p>
  );
}

function PaginationControls({
  page,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  pageRange,
  nextPage,
  prevPage,
  goToPage,
  className,
}: PaginationControlsProps) {
  return (
    <div
      data-testid="pagination-controls"
      className={cn("flex items-center gap-1", className)}
    >
      <Button
        variant="outline"
        size="icon-sm"
        onClick={prevPage}
        disabled={!hasPreviousPage}
        data-testid="pagination-prev"
        aria-label="Página anterior"
      >
        <CaretLeftIcon />
      </Button>

      {pageRange.map((item, index) => {
        const isDots = item === "...";
        if (isDots) {
          return (
            <span
              key={`dots-${index}`}
              className="flex size-8 items-center justify-center text-muted-foreground"
            >
              <DotsThree />
            </span>
          );
        }

        const pageNumber = item as number;
        const isActive = pageNumber === page;

        return (
          <Button
            key={pageNumber}
            variant={isActive ? "default" : "outline"}
            size="icon-sm"
            onClick={() => goToPage(pageNumber)}
            data-active={isActive}
            data-testid={`pagination-page-${pageNumber}`}
            aria-label={`Página ${pageNumber}`}
            aria-current={isActive ? "page" : undefined}
          >
            {pageNumber}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon-sm"
        onClick={nextPage}
        disabled={!hasNextPage}
        data-testid="pagination-next"
        aria-label="Próxima página"
      >
        <CaretRightIcon />
      </Button>
    </div>
  );
}

function PaginationSizeSelect({
  size,
  setPageSize,
  options = DEFAULT_SIZE_OPTIONS,
  className,
}: PaginationSizeSelectProps) {
  return (
    <div
      data-testid="pagination-size-select"
      className={cn("flex items-center gap-2", className)}
    >
      <span className="text-sm text-muted-foreground shrink-0">Itens por página</span>
      <select
        value={size}
        onChange={(e) => setPageSize(Number(e.target.value))}
        data-testid="pagination-size-input"
        className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

Pagination.Info = PaginationInfo;
Pagination.Controls = PaginationControls;
Pagination.SizeSelect = PaginationSizeSelect;

export { Pagination };
export type { PaginationProps, PaginationInfoProps, PaginationSizeSelectProps, PaginationControlsProps };
