import { useState } from "react";
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

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await authService.login(username, password);

    const hasError = result.error !== undefined;
    if (hasError) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    navigate({ to: "/" });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-secondary/30 p-4">
      <div className="w-full h-full max-w-7xl max-h-[720px] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-3">
            <div className="flex flex-col items-center space-y-2">
              <h1 className="text-2xl font-bold font-title uppercase">
                <span className="text-primary">Waiter</span>
                <span className="font-extralight">App</span>
              </h1>
            </div>
            <CardTitle className="text-xl text-center">
              Acesse sua conta
            </CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username" className="block mb-2">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  data-testid="login-username-input"
                />
              </div>
              <div>
                <Label htmlFor="password" className="block mb-2">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  data-testid="login-password-input"
                />
              </div>
              {error && (
                <div className="space-y-2" data-testid="login-error-container">
                  <p
                    className="text-sm text-destructive"
                    data-testid="login-error-message"
                  >
                    {error}
                  </p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
                data-testid="login-submit-button"
              >
                <UserCircleIcon />
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
