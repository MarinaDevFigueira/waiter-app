import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { SearchBarProps } from "@/pages/orders/kitchen-orders/components/search-bar/search-bar.interface";

export function SearchBar({ onSearch }: SearchBarProps) {
  const { t } = useTranslation();

  const searchSchema = z.object({
    query: z.string().min(1, { message: t("common.validation.searchRequired") }),
  });

  type SearchFormValues = z.infer<typeof searchSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: "" },
  });

  const onSubmit = useCallback((validData: SearchFormValues) => {
    onSearch(validData.query);
  }, [onSearch]);

  const hasQueryError = Boolean(errors.query);
  const queryErrorElement = hasQueryError ? (
    <span className="text-xs text-destructive">{errors.query?.message}</span>
  ) : null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-2 w-full justify-center"
      data-testid="kitchen-search-form"
    >
      <div className="flex-1 max-w-md">
        <Input
          {...register("query")}
          type="text"
          placeholder={t("orders.kitchen.searchPlaceholder")}
          className="w-full shadow-sm"
          data-testid="kitchen-search-input"
        />
        {queryErrorElement}
      </div>
      <Button type="submit" size="icon" data-testid="kitchen-search-button" className="shrink-0 shadow-sm hover:shadow-md transition-shadow">
        <MagnifyingGlassIcon className="w-5 h-5" />
      </Button>
    </form>
  );
}
