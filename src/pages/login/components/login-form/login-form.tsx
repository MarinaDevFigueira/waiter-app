import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { UserCircleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { authService } from "@/services/auth/auth.service";
import { useTranslation } from "@/shared/hooks/useTranslation";

export function LoginForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const loginSchema = z.object({
    username: z.string().min(1, { message: t("login.form.usernameRequired") }),
    password: z.string().min(1, { message: t("login.form.passwordRequired") }),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (formData: LoginFormValues) => {
      const result = await authService.login(formData.username, formData.password);

      const hasError = result.error !== undefined;
      if (hasError) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      navigate({ to: "/" });
    },
  });

  const onSubmit = (validData: LoginFormValues) => {
    loginMutation.mutate(validData);
  };

  const hasUsernameError = Boolean(errors.username);
  const usernameErrorElement = hasUsernameError ? (
    <span className="text-xs text-destructive">{errors.username?.message}</span>
  ) : null;

  const hasPasswordError = Boolean(errors.password);
  const passwordErrorElement = hasPasswordError ? (
    <span className="text-xs text-destructive">{errors.password?.message}</span>
  ) : null;

  const hasMutationError = loginMutation.isError;
  const mutationErrorElement = hasMutationError ? (
    <div className="space-y-2" data-testid="login-error-container">
      <p
        className="text-sm text-destructive"
        data-testid="login-error-message"
      >
        {loginMutation.error.message}
      </p>
    </div>
  ) : null;

  const isLoading = loginMutation.isPending;
  const submitButtonText = isLoading
    ? t("login.form.submittingButton")
    : t("login.form.submitButton");

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-3">
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-2xl font-bold font-title uppercase">
            <span className="text-primary">Waiter</span>
            <span className="font-extralight">App</span>
          </h1>
        </div>
        <CardTitle className="text-xl text-center">
          {t("login.pageTitle")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("login.pageSubtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="username" className="block mb-2">
              {t("login.form.usernameLabel")}
            </Label>
            <Input
              {...register("username")}
              id="username"
              type="text"
              placeholder={t("login.form.usernamePlaceholder")}
              required
              disabled={isLoading}
              data-testid="login-username-input"
            />
            {usernameErrorElement}
          </div>
          <div>
            <Label htmlFor="password" className="block mb-2">
              {t("login.form.passwordLabel")}
            </Label>
            <Input
              {...register("password")}
              id="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isLoading}
              data-testid="login-password-input"
            />
            {passwordErrorElement}
          </div>
          {mutationErrorElement}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
            data-testid="login-submit-button"
          >
            <UserCircleIcon />
            {submitButtonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
