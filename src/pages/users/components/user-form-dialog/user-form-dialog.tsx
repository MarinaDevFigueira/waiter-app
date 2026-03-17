import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";
import { usersService } from "@/services/users/users.service";
import { logger } from "@/lib/logger";
import { useLanguage } from "@/shared/hooks/useLanguage";
import type {
  UserFormDialogProps,
  UserFormValues,
} from "./user-form-dialog.interface";

const USER_ROLE_VALUES = Object.values(UserRoleEnum) as [
  UserRoleEnum,
  ...UserRoleEnum[],
];

const createUserFormSchema = z.object({
  name: z.string().min(1, { error: "Nome é obrigatório" }),
  username: z
    .string()
    .min(3, { error: "Usuário deve ter no mínimo 3 caracteres" }),
  email: z.string().email({ error: "Email inválido" }).or(z.literal("")),
  password: z
    .string()
    .min(6, { error: "Senha deve ter no mínimo 6 caracteres" }),
  role: z.enum(USER_ROLE_VALUES),
});

const editUserFormSchema = z.object({
  name: z.string().min(1, { error: "Nome é obrigatório" }),
  username: z
    .string()
    .min(3, { error: "Usuário deve ter no mínimo 3 caracteres" }),
  email: z.string().email({ error: "Email inválido" }).or(z.literal("")),
  password: z.string(),
  role: z.enum(USER_ROLE_VALUES),
});

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserFormDialogProps) {
  const { t } = useTranslation();
  const { addLanguagePrefix } = useLanguage();
  const queryClient = useQueryClient();
  const isEditMode = user !== undefined;
  const formSchema = isEditMode ? editUserFormSchema : createUserFormSchema;

  const roleOptions = [
    { value: UserRoleEnum.TABLE, label: t("users.roles.table") },
    { value: UserRoleEnum.KITCHEN, label: t("users.roles.kitchen") },
    { value: UserRoleEnum.CUSTOMER, label: t("users.roles.customer") },
    { value: UserRoleEnum.ATTENDANT, label: t("users.roles.attendant") },
    { value: UserRoleEnum.WAITER, label: t("users.roles.waiter") },
  ];

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      role: UserRoleEnum.CUSTOMER,
    },
  });

  useEffect(() => {
    if (user) {
      const userRole = user.role as UserRoleEnum;
      form.reset({
        name: user.name,
        username: user.username,
        email: user.email || "",
        password: "",
        role: userRole,
      });
    } else {
      form.reset({
        name: "",
        username: "",
        email: "",
        password: "",
        role: UserRoleEnum.CUSTOMER,
      });
    }
  }, [user, form]);

  const updateMutation = useMutation({
    mutationFn: (data: UserFormValues) =>
      usersService.update(user!.id, {
        name: data.name,
        username: data.username,
        email: data.email || undefined,
        role: data.role,
      }),
    onSuccess: (result) => {
      const hasError = "error" in result;
      if (hasError) {
        logger.error(
          "[UserFormDialog] Erro ao atualizar usuário",
          new Error(result.error),
        );
        toast.error(result.error);
        return;
      }
      queryClient.invalidateQueries({ queryKey: addLanguagePrefix("users") });
      form.reset();
      toast.success(t("users.success.update"));
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : t("users.errors.update");
      logger.error(
        "[UserFormDialog] Erro ao atualizar usuário",
        error instanceof Error ? error : null,
      );
      toast.error(message);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: UserFormValues) => {
      const roleValue = data.role as
        | "table"
        | "waiter"
        | "kitchen"
        | "attendant"
        | "customer";
      return usersService.create({
        name: data.name,
        username: data.username,
        password: data.password,
        email: data.email || undefined,
        role: roleValue,
      });
    },
    onSuccess: (result) => {
      const hasError = "error" in result;
      if (hasError) {
        logger.error(
          "[UserFormDialog] Erro ao criar usuário",
          new Error(result.error),
        );
        toast.error(result.error);
        return;
      }
      queryClient.invalidateQueries({ queryKey: addLanguagePrefix("users") });
      form.reset();
      toast.success(t("users.success.create"));
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : t("users.errors.create");
      logger.error(
        "[UserFormDialog] Erro ao criar usuário",
        error instanceof Error ? error : null,
      );
      toast.error(message);
    },
  });

  const activeMutation = isEditMode ? updateMutation : createMutation;
  const isPending = activeMutation.isPending;

  const onSubmit = form.handleSubmit((data) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  });

  const formTitle = isEditMode
    ? t("users.form.editTitle")
    : t("users.form.createTitle");
  const hasNameError = Boolean(form.formState.errors.name);
  const hasUsernameError = Boolean(form.formState.errors.username);
  const hasEmailError = Boolean(form.formState.errors.email);
  const hasPasswordError = Boolean(form.formState.errors.password);
  const hasRoleError = Boolean(form.formState.errors.role);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <div className="flex flex-col gap-1.5">
            <Dialog.Title>{formTitle}</Dialog.Title>
          </div>
          <Dialog.Close />
        </Dialog.Header>

        <form onSubmit={onSubmit} className="space-y-6 p-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-medium">
              {t("users.form.fields.name")}
            </Label>
            <Input
              id="name"
              type="text"
              {...form.register("name")}
              placeholder="Ex: João Silva"
              disabled={isPending}
              data-testid="user-form-name-input"
            />
            {hasNameError && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name?.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="username" className="text-sm font-medium">
              {t("users.form.fields.username")}
            </Label>
            <Input
              id="username"
              type="text"
              {...form.register("username")}
              placeholder="Ex: joaosilva"
              disabled={isPending}
              data-testid="user-form-username-input"
            />
            {hasUsernameError && (
              <p className="text-xs text-destructive">
                {form.formState.errors.username?.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium">
              {t("users.form.fields.email")}
            </Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              placeholder="Ex: joao@example.com"
              disabled={isPending}
              data-testid="user-form-email-input"
            />
            {hasEmailError && (
              <p className="text-xs text-destructive">
                {form.formState.errors.email?.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-medium">
              {t("users.form.fields.password")}
              {isEditMode && (
                <span className="text-muted-foreground font-normal">
                  {" "}
                  ({t("users.form.fields.passwordOptional")})
                </span>
              )}
            </Label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
              placeholder="••••••••"
              disabled={isPending}
              data-testid="user-form-password-input"
            />
            {hasPasswordError && (
              <p className="text-xs text-destructive">
                {form.formState.errors.password?.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="role" className="text-sm font-medium">
              {t("users.form.fields.role")}
            </Label>
            <select
              id="role"
              {...form.register("role")}
              disabled={isPending}
              data-testid="user-form-role-select"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {hasRoleError && (
              <p className="text-xs text-destructive">
                {form.formState.errors.role?.message}
              </p>
            )}
          </div>
        </form>

        <Dialog.Footer>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            data-testid="user-form-cancel-button"
          >
            {t("users.form.cancel")}
          </Button>
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={isPending}
            data-testid="user-form-submit-button"
          >
            {t("users.form.save")}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
