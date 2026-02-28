import { useState, useRef, useEffect, forwardRef, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CaretUpDownIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useLanguage } from "@/shared/hooks/useLanguage";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { businessService } from "@/services/business/business.service";
import type { BusinessComboboxProps, BusinessSelection } from "./business-combobox.interface";

export const BusinessCombobox = forwardRef<
  HTMLButtonElement,
  BusinessComboboxProps
>(
  (
    {
      value,
      onChange,
      placeholder = "Selecione uma empresa...",
      searchPlaceholder = "Buscar empresa...",
      emptyMessage = "Nenhuma empresa encontrada",
      disabled = false,
      className,
      name,
      dropdownPosition = "bottom",
      maxHeight = "max-h-60",
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedSearch = useDebounce(search, 300);
    const { addLanguagePrefix } = useLanguage();
    const { t } = useTranslation();

    const queryParams = useMemo(() => {
      return {
        page: 1,
        size: 10,
        filters: { search: debouncedSearch },
      };
    }, [debouncedSearch]);

    const { data, isLoading } = useQuery({
      queryKey: addLanguagePrefix("businesses", queryParams),
      queryFn: async () => {
        const result = await businessService.getAll(queryParams);
        const hasError = "error" in result;
        if (hasError) {
          return [];
        }
        return result.data.items;
      },
    });

    const businesses = data ?? [];
    const isEmptyList = businesses.length === 0;

    const selectedBusiness = useMemo(() => {
      return businesses.find((business) => business.id === value);
    }, [businesses, value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const isOutside =
          containerRef.current &&
          !containerRef.current.contains(event.target as Node);
        if (isOutside) {
          setOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      const shouldFocusInput = open && inputRef.current;
      if (shouldFocusInput) {
        inputRef.current?.focus();
      }
    }, [open]);

    const handleSelect = useCallback(
      (businessId: string) => {
        const selectedItem = businesses.find((business) => business.id === businessId);
        if (selectedItem) {
          const businessSelection: BusinessSelection = {
            id: selectedItem.id,
            name: selectedItem.name,
          };
          onChange?.(businessSelection);
        }
        setOpen(false);
        setSearch("");
      },
      [businesses, onChange]
    );

    const handleToggle = useCallback(() => {
      if (!disabled) {
        setOpen((prev) => !prev);
      }
    }, [disabled]);

    const businessList = useMemo(() => {
      return businesses.map((business) => {
        const isSelected = business.id === value;
        return (
          <button
            key={business.id}
            type="button"
            onClick={() => handleSelect(business.id)}
            className={cn(
              "flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors",
              "hover:bg-muted/50",
              isSelected && "bg-muted"
            )}
          >
            <CheckIcon
              className={cn(
                "size-4",
                isSelected ? "text-primary" : "text-transparent"
              )}
            />
            <span>{business.name}</span>
          </button>
        );
      });
    }, [businesses, value, handleSelect]);

    const loadingText = t("common.loading");

    const loadingState = useMemo(() => {
      return (
        <div className="px-3 py-2 text-center text-sm text-muted-foreground">
          {loadingText}
        </div>
      );
    }, [loadingText]);

    const emptyState = useMemo(() => {
      return (
        <div className="px-3 py-2 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      );
    }, [emptyMessage]);

    const shouldShowLoading = isLoading;
    const shouldShowEmpty = isEmptyList && !isLoading;
    const shouldShowList = !isLoading && !isEmptyList;

    const isTopPosition = dropdownPosition === "top";

    const dropdownContent = useMemo(() => {
      if (shouldShowLoading) {
        return loadingState;
      }
      if (shouldShowEmpty) {
        return emptyState;
      }
      if (shouldShowList) {
        return businessList;
      }
      return null;
    }, [shouldShowLoading, shouldShowEmpty, shouldShowList, loadingState, emptyState, businessList]);

    const dropdown = useMemo(() => {
      if (!open) return null;

      const positionClasses = isTopPosition ? "bottom-full mb-1" : "top-full mt-1";

      return (
        <div
          className={cn(
            "absolute z-50 w-full rounded-md border border-border bg-card shadow-lg",
            positionClasses
          )}
        >
          <div className="flex items-center border-b border-border px-3 py-2">
            <MagnifyingGlassIcon className="size-4 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="ml-2 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className={cn("overflow-auto p-1", maxHeight)}>{dropdownContent}</div>
        </div>
      );
    }, [open, search, searchPlaceholder, dropdownContent, isTopPosition, maxHeight]);

    const buttonLabel = selectedBusiness?.name || placeholder;
    const hasSelection = Boolean(selectedBusiness);

    return (
      <div ref={containerRef} className="relative">
        <input type="hidden" name={name} value={value || ""} />
        <button
          ref={ref}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-input/30 px-3 py-1 text-sm transition-colors",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[open=true]:border-ring data-[open=true]:ring-ring/50 data-[open=true]:ring-[3px]",
            className
          )}
          data-open={open}
        >
          <span
            className={cn(!hasSelection && "text-muted-foreground")}
          >
            {buttonLabel}
          </span>
          <CaretUpDownIcon className="size-4 text-muted-foreground" />
        </button>

        {dropdown}
      </div>
    );
  }
);

BusinessCombobox.displayName = "BusinessCombobox";
