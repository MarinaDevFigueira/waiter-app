import { useMemo, useCallback } from "react";

interface UsePaginationOptions {
  page: number;
  size: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number, size: number) => void;
}

export interface UsePaginationReturn {
  page: number;
  size: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
  pageRange: (number | "...")[];
  startItem: number;
  endItem: number;
}

function buildPageRange(page: number, totalPages: number): (number | "...")[] {
  const SIBLINGS = 1;
  const BOUNDARIES = 1;

  const totalPageNumbers = SIBLINGS * 2 + 5;

  const isSmallEnoughToShowAll = totalPages <= totalPageNumbers;
  if (isSmallEnoughToShowAll) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(page - SIBLINGS, BOUNDARIES + 1);
  const rightSiblingIndex = Math.min(page + SIBLINGS, totalPages - BOUNDARIES);

  const showLeftDots = leftSiblingIndex > BOUNDARIES + 2;
  const showRightDots = rightSiblingIndex < totalPages - BOUNDARIES - 1;

  if (!showLeftDots && showRightDots) {
    const leftCount = 3 + SIBLINGS * 2;
    return [
      ...Array.from({ length: leftCount }, (_, i) => i + 1),
      "...",
      totalPages,
    ];
  }

  if (showLeftDots && !showRightDots) {
    const rightCount = 3 + SIBLINGS * 2;
    return [
      1,
      "...",
      ...Array.from({ length: rightCount }, (_, i) => totalPages - rightCount + i + 1),
    ];
  }

  return [
    1,
    "...",
    ...Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    ),
    "...",
    totalPages,
  ];
}

export function usePagination({
  page,
  size,
  total,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: UsePaginationOptions): UsePaginationReturn {
  const goToPage = useCallback(
    (targetPage: number) => {
      const clampedPage = Math.max(1, Math.min(targetPage, totalPages));
      onPageChange(clampedPage, size);
    },
    [totalPages, size, onPageChange]
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) goToPage(page + 1);
  }, [hasNextPage, goToPage, page]);

  const prevPage = useCallback(() => {
    if (hasPreviousPage) goToPage(page - 1);
  }, [hasPreviousPage, goToPage, page]);

  const setPageSize = useCallback(
    (newSize: number) => {
      onPageChange(1, newSize);
    },
    [onPageChange]
  );

  const pageRange = useMemo(
    () => buildPageRange(page, totalPages),
    [page, totalPages]
  );

  const startItem = total === 0 ? 0 : (page - 1) * size + 1;
  const endItem = Math.min(page * size, total);

  return {
    page,
    size,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    pageRange,
    startItem,
    endItem,
  };
}
