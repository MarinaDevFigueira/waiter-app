import { useState, useCallback, useMemo } from "react";
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
import { usersFiltersObservable } from "@/shared/subjects/users-filters.subject";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useRoles } from "@/shared/hooks/useRoles";

const USER_ROLE_VALUES = Object.values(UserRoleEnum) as [UserRoleEnum, ...UserRoleEnum[]];

const filterFormSchema = z.object({
  role: z.array(z.enum(USER_ROLE_VALUES)).optional(),
  includeDeleted: z.boolean().optional(),
});

type FilterFormValues = z.infer<typeof filterFormSchema>;

export function UsersFilters() {
  const { t } = useTranslation();
  const { isOwner } = useRoles();

  const ROLE_OPTIONS: { value: UserRoleEnum; label: string }[] = useMemo(() => {
    const allOptions = [
      { value: UserRoleEnum.ADMIN, label: t("users.roles.admin") },
      { value: UserRoleEnum.TABLE, label: t("users.roles.table") },
      { value: UserRoleEnum.KITCHEN, label: t("users.roles.kitchen") },
      { value: UserRoleEnum.CUSTOMER, label: t("users.roles.customer") },
      { value: UserRoleEnum.ATTENDANT, label: t("users.roles.attendant") },
      { value: UserRoleEnum.WAITER, label: t("users.roles.waiter") },
      { value: UserRoleEnum.SYSTEM_MANAGER, label: t("users.roles.system_manager")}
    ];

    if (isOwner) {
      return allOptions.filter((option) => option.value !== UserRoleEnum.ADMIN);
    }

    return allOptions;
  }, [t, isOwner]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(() => usersFiltersObservable.getValue().search || "");

  const currentFilters = usersFiltersObservable.getValue();

  const { register, handleSubmit, watch, setValue } = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      role: currentFilters.role || [],
      includeDeleted: currentFilters.includeDeleted || false,
    },
  });

  const roleValue = watch("role");
  const includeDeletedValue = watch("includeDeleted");

  const activeFilterCount = useMemo(() => {
    const hasRole = roleValue && roleValue.length > 0;
    const hasIncludeDeleted = includeDeletedValue === true;

    const filtersArray = [hasRole, hasIncludeDeleted];
    return filtersArray.filter(Boolean).length;
  }, [roleValue, includeDeletedValue]);

  const handleSearch = useCallback(() => {
    usersFiltersObservable.updateFilter("search", searchValue);
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
      role: data.role || [],
      includeDeleted: data.includeDeleted || false,
    };

    usersFiltersObservable.setFilters(updatedFilters);
    setIsModalOpen(false);
  }, [currentFilters, searchValue]);

  const handleClearFilters = useCallback(() => {
    setValue("role", []);
    setValue("includeDeleted", false);
    setSearchValue("");
    usersFiltersObservable.resetFilters();
    setIsModalOpen(false);
  }, [setValue]);

  const handleRoleChange = useCallback((newRoles: string[]) => {
    setValue("role", newRoles as UserRoleEnum[]);
  }, [setValue]);

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={t("users.filters.searchPlaceholder")}
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
            {t("users.filters.title")}
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </Dialog.Trigger>

        <Dialog.Content>
          <Dialog.Header>
            <div className="flex flex-col gap-1.5">
              <Dialog.Title>{t("users.filters.title")}</Dialog.Title>
            </div>
            <Dialog.Close />
          </Dialog.Header>

          <form onSubmit={handleSubmit(handleApplyFilters)} className="space-y-6 p-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {t("users.filters.role")}
              </Label>
              <MultiSelect
                options={ROLE_OPTIONS}
                value={roleValue || []}
                onChange={handleRoleChange}
                placeholder={t("users.filters.selectRoles")}
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  {...register("includeDeleted")}
                  checked={includeDeletedValue}
                  onCheckedChange={(checked) => setValue("includeDeleted", checked === true)}
                />
                <span className="text-sm">{t("users.filters.includeDeleted")}</span>
              </label>
            </div>
          </form>

          <Dialog.Footer>
            <Button type="button" variant="outline" onClick={handleClearFilters}>
              {t("users.filters.clear")}
            </Button>
            <Button type="submit" onClick={handleSubmit(handleApplyFilters)}>
              {t("users.filters.apply")}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}
