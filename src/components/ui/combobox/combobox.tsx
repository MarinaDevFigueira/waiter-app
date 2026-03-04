import { useState, useRef, useEffect, forwardRef, useMemo, useCallback } from "react";
import { CaretUpDownIcon, CheckIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  name?: string;
}

export const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Selecione...",
      searchPlaceholder = "Buscar...",
      emptyMessage = "Nenhum resultado encontrado",
      disabled = false,
      className,
      isLoading = false,
      name,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedOption = useMemo(
      () => options.find((option) => option.value === value),
      [options, value]
    );

    const filteredOptions = useMemo(
      () => options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase())),
      [options, search]
    );

    const isEmptyFilter = filteredOptions.length === 0;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const isOutside = containerRef.current && !containerRef.current.contains(event.target as Node);
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

    const handleSelect = useCallback((optionValue: string) => {
      onChange?.(optionValue);
      setOpen(false);
      setSearch("");
    }, [onChange]);

    const handleToggle = useCallback(() => {
      if (!disabled) {
        setOpen(!open);
      }
    }, [disabled, open]);

    const optionsList = useMemo(() => {
      return filteredOptions.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            data-selected={isSelected}
            className={cn(
              "flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors",
              "hover:bg-muted/50",
              "data-[selected=true]:bg-muted"
            )}
          >
            <CheckIcon
              data-selected={isSelected}
              className={cn(
                "size-4",
                "data-[selected=true]:text-primary data-[selected=false]:text-transparent"
              )}
            />
            <span>{option.label}</span>
          </button>
        );
      });
    }, [filteredOptions, value]);

    const emptyState = (
      <div className="px-3 py-2 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );

    const dropdownContent = isEmptyFilter ? emptyState : optionsList;

    const dropdown = useMemo(() => {
      if (!open) return null;

      return (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
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

          <div className="max-h-60 overflow-auto p-1">
            {dropdownContent}
          </div>
        </div>
      );
    }, [open, search, searchPlaceholder, dropdownContent]);

    const buttonLabel = useMemo(() => {
      if (isLoading) return "Carregando...";
      return selectedOption?.label || placeholder;
    }, [isLoading, selectedOption, placeholder]);

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
          <span className={cn(!selectedOption && "text-muted-foreground")}>
            {buttonLabel}
          </span>
          <CaretUpDownIcon className="size-4 text-muted-foreground" />
        </button>

        {dropdown}
      </div>
    );
  }
);

Combobox.displayName = "Combobox";
