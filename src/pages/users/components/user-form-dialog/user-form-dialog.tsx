import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";
import { usersService } from "@/services/users/users.service";
import { logger } from "@/lib/logger";
import type { UserFormDialogProps, UserFormValues } from "./user-form-dialog.interface";

const USER_ROLE_VALUES = Object.values(UserRoleEnum) as [UserRoleEnum, ...UserRoleEnum[]];

const createUserFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  username: z.string().min(3, "Usuário deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido").or(z.literal("")),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.enum(USER_ROLE_VALUES),
});

const editUserFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  username: z.string().min(3, "Usuário deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido").or(z.literal("")),
  password: z.string(),
  role: z.enum(USER_ROLE_VALUES),
});

export function UserFormDialog({ open, onOpenChange, user, onSuccess }: UserFormDialogProps) {
  const { t } = useTranslation();
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

  const onSubmit = async (data: UserFormValues) => {
    if (isEditMode) {
      const result = await usersService.update(user.id, {
        name: data.name,
        username: data.username,
        email: data.email || undefined,
        role: data.role,
      });

      const hasError = "error" in result;
      if (hasError) {
        logger.error("[UserFormDialog] Erro ao atualizar usuário", new Error(result.error));
        toast.error(result.error);
        return;
      }

      toast.success(t("users.success.update"));
      onOpenChange(false);
      onSuccess?.();
      return;
    }

    const roleValue = data.role as "table" | "waiter" | "kitchen" | "attendant" | "customer";
    const result = await usersService.create({
      name: data.name,
      username: data.username,
      password: data.password,
      email: data.email || undefined,
      role: roleValue,
    });

    const hasError = "error" in result;
    if (hasError) {
      logger.error("[UserFormDialog] Erro ao criar usuário", new Error(result.error));
      toast.error(result.error);
      return;
    }

    toast.success(t("users.success.create"));
    onOpenChange(false);
    onSuccess?.();
  };

  const formTitle = isEditMode ? t("users.form.editTitle") : t("users.form.createTitle");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <div className="flex flex-col gap-1.5">
            <Dialog.Title>{formTitle}</Dialog.Title>
          </div>
          <Dialog.Close />
        </Dialog.Header>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-medium">
              {t("users.form.fields.name")}
            </Label>
            <Input
              id="name"
              type="text"
              {...form.register("name")}
              placeholder="Ex: João Silva"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
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
            />
            {form.formState.errors.username && (
              <p className="text-xs text-destructive">{form.formState.errors.username.message}</p>
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
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-medium">
              {t("users.form.fields.password")}
              {isEditMode && (
                <span className="text-muted-foreground font-normal"> ({t("users.form.fields.passwordOptional")})</span>
              )}
            </Label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
              placeholder="••••••••"
            />
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="role" className="text-sm font-medium">
              {t("users.form.fields.role")}
            </Label>
            <select
              id="role"
              {...form.register("role")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {form.formState.errors.role && (
              <p className="text-xs text-destructive">{form.formState.errors.role.message}</p>
            )}
          </div>
        </form>

        <Dialog.Footer>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("users.form.cancel")}
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            {t("users.form.save")}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
