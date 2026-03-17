import { useState, useCallback } from "react";
import { CategoriesTable } from "@/pages/categories/components/categories-table";
import { CategoriesTableSkeleton } from "@/pages/categories/components/categories-table-skeleton";
import { CategoriesSearch } from "@/pages/categories/components/categories-search";
import { CategoryFormDialog } from "@/pages/categories/components/category-form-dialog/category-form-dialog";
import { Pagination } from "@/components/ui/pagination/pagination";
import { Button } from "@/components/ui/button/button";
import { useCategories } from "@/shared/hooks/useCategories";
import { usePagination } from "@/shared/hooks/usePagination";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { Category } from "@/shared/schemas/category.schema";

export function CategoriesPage() {
  const { t } = useTranslation();
  const {
    categories,
    total,
    page,
    size,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    isError,
    error,
    queryParams,
    updateSearch,
    updateSorting,
    updatePagination,
  } = useCategories(t("categories.errors.loadCategories"));

  const [formOpen, setFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  const handleNewCategory = useCallback(() => {
    setSelectedCategory(undefined);
    setFormOpen(true);
  }, []);

  const handleEditCategory = useCallback((category: Category) => {
    setSelectedCategory(category);
    setFormOpen(true);
  }, []);

  const pagination = usePagination({
    page,
    size,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    onPageChange: updatePagination,
  });

  const sortingState = {
    orderBy: queryParams.orderBy,
    direction: queryParams.direction,
  };

  const hasError = isError;
  const isLoadingData = isLoading;
  const hasNoCategories = categories.length === 0;
  const errorMessage = error?.message;
  const showTable = !hasError && !isLoadingData && !hasNoCategories;
  const showSkeleton = !hasError && isLoadingData;
  const showEmpty = !hasError && !isLoadingData && hasNoCategories;

  const pageHeader = (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("categories.pageTitle")}
        </h1>
        <p className="text-muted-foreground">{t("categories.pageSubtitle")}</p>
      </div>
      <Button onClick={handleNewCategory} data-testid="new-category-button">
        {t("common.buttons.new")} {t("categories.pageTitle")}
      </Button>
    </div>
  );

  const errorContent = (
    <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
      <p className="text-sm text-destructive">
        {t("categories.errors.loadCategories")} {errorMessage}
      </p>
    </div>
  );

  const emptyContent = (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <p className="text-muted-foreground">
        {t("categories.emptyState.title")}
      </p>
    </div>
  );

  const errorSection = hasError ? errorContent : null;
  const skeletonSection = showSkeleton ? <CategoriesTableSkeleton /> : null;
  const emptySection = showEmpty ? emptyContent : null;
  const tableSection = showTable ? (
    <div className="flex-1 min-h-0 flex flex-col gap-3">
      <div className="flex-1 min-h-0">
        <CategoriesTable
          categories={categories}
          sorting={sortingState}
          onSortingChange={updateSorting}
          onEdit={handleEditCategory}
        />
      </div>

      <Pagination>
        <div className="flex items-center gap-4">
          <Pagination.Info
            startItem={pagination.startItem}
            endItem={pagination.endItem}
            total={pagination.total}
          />
          <Pagination.SizeSelect
            size={pagination.size}
            setPageSize={pagination.setPageSize}
          />
        </div>
        <Pagination.Controls
          page={pagination.page}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          pageRange={pagination.pageRange}
          nextPage={pagination.nextPage}
          prevPage={pagination.prevPage}
          goToPage={pagination.goToPage}
        />
      </Pagination>
    </div>
  ) : null;

  return (
    <div className="flex flex-col h-full gap-6">
      {pageHeader}

      <CategoriesSearch onSearch={updateSearch} />

      {errorSection}

      {skeletonSection}

      {emptySection}

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={selectedCategory}
      />

      {tableSection}
    </div>
  );
}
