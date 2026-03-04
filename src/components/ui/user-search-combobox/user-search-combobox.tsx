import { useState, useRef, useEffect, forwardRef, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { CaretUpDownIcon, CheckIcon, MagnifyingGlassIcon, SpinnerIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { usersService } from "@/services/users/users.service";
import { useLanguage } from "@/shared/hooks/useLanguage";
import type { UserSearchComboboxProps, UserSelection } from "./user-search-combobox.interface";

const SEARCH_DEBOUNCE_MS = 300;

export const UserSearchCombobox = forwardRef<HTMLButtonElement, UserSearchComboboxProps>(
  (
    {
      value,
      onChange,
      roles,
      placeholder = "Selecione um usuário...",
      searchPlaceholder = "Buscar usuário...",
      emptyMessage = "Nenhum usuário encontrado",
      disabled = false,
      className,
      name,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { addLanguagePrefix } = useLanguage();

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearch(search);
      }, SEARCH_DEBOUNCE_MS);

      return () => clearTimeout(timer);
    }, [search]);

    const queryParams = useMemo(() => ({
      page: 1,
      size: 20,
      filters: {
        search: debouncedSearch || undefined,
        role: roles,
      },
    }), [debouncedSearch, roles]);

    const { data, isLoading } = useQuery({
      queryKey: addLanguagePrefix("users-search", queryParams),
      queryFn: async () => {
        const result = await usersService.getAll(queryParams);
        const hasError = "error" in result;
        if (hasError) {
          throw new Error(result.error);
        }
        return result.data;
      },
      enabled: open,
    });

    const users = data?.items ?? [];

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

    const handleSelect = useCallback((user: UserSelection) => {
      onChange?.(user);
      setOpen(false);
      setSearch("");
    }, [onChange]);

    const handleToggle = useCallback(() => {
      if (!disabled) {
        setOpen(!open);
      }
    }, [disabled, open]);

    const valueId = value?.id;
    const valueName = value?.name;

    const optionsList = useMemo(() => {
      return users.map((user) => {
        const isSelected = user.id === valueId;
        return (
          <button
            key={user.id}
            type="button"
            onClick={() => handleSelect({ id: user.id, name: user.name })}
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
            <div className="flex flex-col items-start">
              <span>{user.name}</span>
              <span className="text-xs text-muted-foreground">@{user.username}</span>
            </div>
          </button>
        );
      });
    }, [users, valueId, handleSelect]);

    const dropdownContent = useMemo(() => {
      if (isLoading) {
        return (
          <div className="flex items-center justify-center px-3 py-4 text-sm text-muted-foreground">
            <SpinnerIcon className="size-4 animate-spin mr-2" />
            Carregando...
          </div>
        );
      }

      const isEmpty = users.length === 0;
      if (isEmpty) {
        return (
          <div className="px-3 py-2 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        );
      }

      return optionsList;
    }, [isLoading, users.length, emptyMessage, optionsList]);

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
      if (valueName) {
        return valueName;
      }
      return placeholder;
    }, [valueName, placeholder]);

    const hasValue = valueId !== null && valueId !== undefined;

    return (
      <div ref={containerRef} className="relative">
        <input type="hidden" name={name} value={valueId || ""} />
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
          <span className={cn(!hasValue && "text-muted-foreground")}>
            {buttonLabel}
          </span>
          <CaretUpDownIcon className="size-4 text-muted-foreground" />
        </button>

        {dropdown}
      </div>
    );
  }
);

UserSearchCombobox.displayName = "UserSearchCombobox";
