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
import type { UserFormDialogProps, UserFormValues } from "./user-form-dialog.interface";

const USER_ROLE_VALUES = Object.values(UserRoleEnum) as [UserRoleEnum, ...UserRoleEnum[]];

const userFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  username: z.string().min(3, "Usuário deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  role: z.enum(USER_ROLE_VALUES),
});

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const { t } = useTranslation();

  const roleOptions = [
    { value: UserRoleEnum.ADMIN, label: t("users.roles.admin") },
    { value: UserRoleEnum.TABLE, label: t("users.roles.table") },
    { value: UserRoleEnum.KITCHEN, label: t("users.roles.kitchen") },
    { value: UserRoleEnum.CUSTOMER, label: t("users.roles.customer") },
    { value: UserRoleEnum.ATTENDANT, label: t("users.roles.attendant") },
    { value: UserRoleEnum.WAITER, label: t("users.roles.waiter") },
  ];

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
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
        role: userRole,
      });
    } else {
      form.reset({
        name: "",
        username: "",
        email: "",
        role: UserRoleEnum.CUSTOMER,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: UserFormValues) => {
    toast.info("Funcionalidade de atualização de usuário ainda não implementada");
    console.log("Form data:", data);
    onOpenChange(false);
  };

  const formTitle = user ? t("users.form.editTitle") : t("users.form.editTitle");

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
