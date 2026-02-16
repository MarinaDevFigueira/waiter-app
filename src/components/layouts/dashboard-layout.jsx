import { useState, useMemo } from "react";
import { useNavigate, useLocation, Link } from "@tanstack/react-router";
import {
  SignOutIcon,
  HouseIcon,
  UsersIcon,
  ChartBarIcon,
  GearIcon,
  PackageIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CookingPotIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import { Logo } from "@/components/ui/logo/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle/theme-toggle";
import { authService } from "@/services/auth/auth.service";
import { useAuth } from "@/shared/hooks/useAuth";
import { UserProfileEnum } from "@/shared/constants/user-profile";
import { StorageKeys } from "@/shared/constants/storage-keys";

export function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const [isMinimized, setIsMinimized] = useState(() => {
    const stored = localStorage.getItem(StorageKeys.SIDEBAR_MINIMIZED);
    return stored === "true";
  });

  const handleLogout = async () => {
    await authService.logout();
    navigate({ to: "/login" });
  };

  const toggleSidebar = () => {
    setIsMinimized((prev) => {
      const newValue = !prev;
      localStorage.setItem(StorageKeys.SIDEBAR_MINIMIZED, String(newValue));
      return newValue;
    });
  };

  const userProfile = auth?.profile;
  const isAdmin = userProfile === UserProfileEnum.ADMIN;

  const menuItems = useMemo(() => {
    const baseItems = [
      { icon: HouseIcon, label: "Dashboard", path: "/dashboard" },
      { icon: CookingPotIcon, label: "Pedidos", path: "/dashboard/orders" },
      { icon: ChartBarIcon, label: "Relatórios", path: "/dashboard/reports" },
      { icon: PackageIcon, label: "Produtos", path: "/dashboard/products" },
    ];

    const adminOnlyItems = [
      { icon: UsersIcon, label: "Usuários", path: "/dashboard/users" },
      {
        icon: GearIcon,
        label: "Configurações",
        path: "/dashboard/settings",
      },
    ];

    const shouldShowAdminItems = isAdmin;
    if (shouldShowAdminItems) {
      return [...baseItems, ...adminOnlyItems];
    }

    return baseItems;
  }, [isAdmin]);

  const pathname = location.pathname;
  const normalizedPathname = pathname.endsWith("/") && pathname !== "/"
    ? pathname.slice(0, -1)
    : pathname;

  const breadcrumbs = useMemo(() => {
    const isExactlyDashboard = normalizedPathname === "/dashboard";
    if (isExactlyDashboard) {
      return [];
    }

    const segments = normalizedPathname.split("/").filter(Boolean);

    const shouldSkipDashboard =
      segments.length > 1 && segments[0] === "dashboard";
    if (shouldSkipDashboard) {
      segments.shift();
    }

    const labelMap = {
      dashboard: "Dashboard",
      orders: "Pedidos",
      users: "Usuários",
      reports: "Relatórios",
      settings: "Configurações",
      products: "Produtos",
      edit: "Editar",
      new: "Novo",
    };

    return segments.map((segment, index) => {
      const label = labelMap[segment] || segment;
      const path = `/dashboard/${segments.slice(0, index + 1).join("/")}`;
      const isLast = index === segments.length - 1;
      return { label, path, isLast };
    });
  }, [normalizedPathname]);

  return (
    <div className="w-screen h-screen flex bg-background">
      <aside
        data-minimized={isMinimized}
        className="hidden md:flex flex-col bg-background border-r border-border data-[minimized=false]:w-64 data-[minimized=true]:w-16 transition-all duration-300 shadow-lg"
      >
        <div className="flex items-center justify-center h-14 sm:h-16 px-4 sm:px-6 md:px-8 border-b border-border relative">
          <Logo
            data-minimized={isMinimized}
            className="text-lg data-[minimized=true]:hidden"
          />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleSidebar}
            data-testid="toggle-sidebar"
            data-minimized={isMinimized}
            className="data-[minimized=false]:absolute data-[minimized=false]:right-4"
          >
            {isMinimized ? <CaretRightIcon /> : <CaretLeftIcon />}
          </Button>
        </div>

        <nav className="flex-1 p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = normalizedPathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-active={isActive}
                data-minimized={isMinimized}
                className="group flex items-center gap-3 px-3 py-2 rounded-md mb-1 transition-colors data-[active=false]:text-foreground data-[active=false]:hover:bg-secondary data-[active=true]:bg-sidebar-primary"
              >
                <Icon
                  size={20}
                  className="shrink-0 group-data-[active=true]:text-white"
                />
                <span
                  data-minimized={isMinimized}
                  className="text-sm data-[minimized=true]:hidden group-data-[active=true]:text-white"
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div
            data-minimized={isMinimized}
            className="flex items-center gap-2 mb-3 data-[minimized=true]:hidden"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{auth?.name}</p>
              <p className="text-xs text-muted-foreground">{auth?.profile}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size={isMinimized ? "icon-sm" : "sm"}
            onClick={handleLogout}
            data-testid="logout-button"
            className="w-full"
          >
            <SignOutIcon />
            <span
              data-minimized={isMinimized}
              className="data-[minimized=true]:hidden ml-2"
            >
              Sair
            </span>
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="w-full bg-background border-b border-border h-14 sm:h-16 px-4 sm:px-6 md:px-8 flex items-center shadow-sm">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                to="/dashboard"
                className="hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              {breadcrumbs.map((crumb) => (
                <div key={crumb.path} className="flex items-center gap-2">
                  <span>/</span>
                  {crumb.isLast ? (
                    <span className="text-muted-foreground font-medium select-none">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      to={crumb.path}
                      className="hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-secondary/50">
          <div className="w-full h-full max-w-7xl mx-auto px-2 md:px-6 py-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
