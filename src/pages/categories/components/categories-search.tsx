import { useState, useCallback } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface CategoriesSearchProps {
  onSearch: (search: string) => void;
}

export function CategoriesSearch({ onSearch }: CategoriesSearchProps) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = useCallback(() => {
    onSearch(searchValue);
  }, [searchValue, onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const isEnterKey = e.key === "Enter";

    if (isEnterKey) {
      e.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={t("categories.filters.searchPlaceholder")}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
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
    </div>
  );
}
