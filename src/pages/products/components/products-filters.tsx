import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SlidersHorizontalIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { MultiSelect } from "@/components/ui/multi-select/multi-select";
import { productsFiltersObservable } from "@/shared/subjects/products-filters.subject";
import { ProductStatusEnum } from "@/shared/enums/product-status.enum";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useCategories } from "@/shared/hooks/useCategories";

const PRODUCT_STATUS_VALUES = Object.values(ProductStatusEnum) as [ProductStatusEnum, ...ProductStatusEnum[]];

const filterFormSchema = z.object({
  categoria: z.array(z.string()).optional(),
  precoMin: z.number().optional(),
  precoMax: z.number().optional(),
  status: z.array(z.enum(PRODUCT_STATUS_VALUES)).optional(),
});

type FilterFormValues = z.infer<typeof filterFormSchema>;

export function ProductsFilters() {
  const { t } = useTranslation();
  const { categories } = useCategories({ initialSize: 100 });

  const categoryOptions = useMemo(
    () => categories.map((cat) => ({ value: cat.id, label: cat.name })),
    [categories]
  );

  const STATUS_OPTIONS: { value: ProductStatusEnum; label: string }[] = [
    { value: ProductStatusEnum.ACTIVE, label: t("common.status.active") },
    { value: ProductStatusEnum.INACTIVE, label: t("common.status.inactive") },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const currentFilters = productsFiltersObservable.getValue();

  const { register, handleSubmit, watch, setValue } = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      categoria: currentFilters.categoria || [],
      precoMin: currentFilters.precoMin,
      precoMax: currentFilters.precoMax,
      status: currentFilters.status || [ProductStatusEnum.ACTIVE, ProductStatusEnum.INACTIVE],
    },
  });

  const categoriaValue = watch("categoria");
  const statusValue = watch("status");

  useEffect(() => {
    const currentFilters = productsFiltersObservable.getValue();
    setSearchValue(currentFilters.search || "");

    const hasCategories = currentFilters.categoria && currentFilters.categoria.length > 0;
    const hasMinPrice = currentFilters.precoMin !== undefined;
    const hasMaxPrice = currentFilters.precoMax !== undefined;
    const hasCustomStatus = currentFilters.status && currentFilters.status.length !== 2;

    const filtersArray = [hasCategories, hasMinPrice, hasMaxPrice, hasCustomStatus];
    const count = filtersArray.filter(Boolean).length;
    setActiveFilterCount(count);
  }, []);

  const handleSearch = useCallback(() => {
    productsFiltersObservable.updateFilter("search", searchValue);
  }, [searchValue]);

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const isEnterKey = e.key === "Enter";

    if (isEnterKey) {
      e.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);

  const handleApplyFilters = useCallback((data: FilterFormValues) => {
    const updatedFilters = {
      ...currentFilters,
      search: searchValue,
      categoria: data.categoria || [],
      precoMin: data.precoMin,
      precoMax: data.precoMax,
      status: data.status || [ProductStatusEnum.ACTIVE, ProductStatusEnum.INACTIVE],
    };

    productsFiltersObservable.setFilters(updatedFilters);
    setIsModalOpen(false);
  }, [currentFilters, searchValue]);

  const handleClearFilters = useCallback(() => {
    setValue("categoria", []);
    setValue("status", [ProductStatusEnum.ACTIVE, ProductStatusEnum.INACTIVE]);
    setValue("precoMin", undefined);
    setValue("precoMax", undefined);
    setSearchValue("");
    setActiveFilterCount(0);
    productsFiltersObservable.resetFilters();
    setIsModalOpen(false);
  }, [setValue]);

  const handleCategoryChange = useCallback((newValue: string[]) => {
    setValue("categoria", newValue);
  }, [setValue]);

  const handleStatusToggle = useCallback((statusOption: ProductStatusEnum) => {
    const currentStatus = statusValue || [];
    const isSelected = currentStatus.includes(statusOption);

    const newStatus = isSelected
      ? currentStatus.filter((s) => s !== statusOption)
      : [...currentStatus, statusOption];

    setValue("status", newStatus);
  }, [statusValue, setValue]);

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={t("products.filters.searchPlaceholder")}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="pl-9 pr-20"
        />
        <Button
          size="sm"
          onClick={handleSearch}
          className="absolute right-1 top-1/2 -translate-y-1/2"
        >
          {t("common.buttons.search")}
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Trigger asChild>
          <Button variant="outline" className="relative">
            <SlidersHorizontalIcon className="size-4" />
            {t("products.filters.title")}
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </Dialog.Trigger>

        <Dialog.Content>
          <Dialog.Header>
            <div className="flex flex-col gap-1.5">
              <Dialog.Title>{t("products.filters.modalTitle")}</Dialog.Title>
              <Dialog.Description>
                {t("products.filters.modalSubtitle")}
              </Dialog.Description>
            </div>
            <Dialog.Close />
          </Dialog.Header>

          <form onSubmit={handleSubmit(handleApplyFilters)} className="space-y-6 p-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {t("products.filters.fields.category")}
              </Label>
              <MultiSelect
                options={categoryOptions}
                value={categoriaValue || []}
                onChange={handleCategoryChange}
                placeholder="Selecione as categorias"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {t("products.filters.fields.priceRange")}
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="precoMin" className="text-xs text-muted-foreground">
                    {t("products.filters.fields.minPrice")}
                  </Label>
                  <Input
                    id="precoMin"
                    type="number"
                    step="0.01"
                    placeholder="R$ 0,00"
                    {...register("precoMin", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="precoMax" className="text-xs text-muted-foreground">
                    {t("products.filters.fields.maxPrice")}
                  </Label>
                  <Input
                    id="precoMax"
                    type="number"
                    step="0.01"
                    placeholder="R$ 999,99"
                    {...register("precoMax", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {t("products.filters.fields.status")}
              </Label>
              <div className="flex gap-4">
                {STATUS_OPTIONS.map((option) => {
                  const isChecked = statusValue?.includes(option.value);
                  return (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => handleStatusToggle(option.value)}
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </form>

          <Dialog.Footer>
            <Button type="button" variant="outline" onClick={handleClearFilters}>
              {t("common.buttons.clear")}
            </Button>
            <Button type="submit" onClick={handleSubmit(handleApplyFilters)}>
              {t("common.buttons.apply")}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}
