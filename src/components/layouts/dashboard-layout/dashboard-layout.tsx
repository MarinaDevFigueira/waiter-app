import { useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation, Link } from "@tanstack/react-router";
import {
  SignOutIcon,
  HouseIcon,
  UsersIcon,
  ChartBarIcon,
  PackageIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretDownIcon,
  CookingPotIcon,
  ListIcon,
  FolderIcon,
  BuildingsIcon,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import { Logo } from "@/components/ui/logo/logo";
import { Sheet } from "@/components/ui/sheet/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle/theme-toggle";
import { LanguageSelector } from "@/components/ui/language-selector/language-selector";
import { authService } from "@/services/auth/auth.service";
import { useAuth } from "@/shared/hooks/useAuth";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";
import { StorageKeys } from "@/shared/constants/storage-keys";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { BusinessSelectorButton } from "@/components/ui/business-selector-button/business-selector-button";
import { DeviceTypeEnum } from "@/components/ui/business-selector-button/business-selector-button.interface";

interface MenuItem {
  icon: Icon;
  label: string;
  path: string;
}

interface SubMenuItem {
  label: string;
  path: string;
}

interface MenuGroupItem {
  icon: Icon;
  label: string;
  subItems: SubMenuItem[];
}

interface Breadcrumb {
  label: string;
  path: string;
  isLast: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const { t } = useTranslation();
  const [isMinimized, setIsMinimized] = useState<boolean>(() => {
    const stored = localStorage.getItem(StorageKeys.SIDEBAR_MINIMIZED);
    return stored === "true";
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBusinessExpanded, setIsBusinessExpanded] = useState(false);

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

  const toggleBusinessMenu = useCallback(() => {
    setIsBusinessExpanded((prev) => !prev);
  }, []);

  const userProfile = auth?.profile;
  const fullMenuProfiles = [UserRoleEnum.OWNER, UserRoleEnum.ADMIN];
  const hasFullMenuAccess = fullMenuProfiles.includes(
    userProfile as UserRoleEnum,
  );

  const adminProfiles = [UserRoleEnum.ADMIN, UserRoleEnum.SYSTEM_MANAGER];
  const shouldShowBusinessSelector = adminProfiles.includes(userProfile as UserRoleEnum);

  const menuItems = useMemo<MenuItem[]>(() => {
    const baseItems: MenuItem[] = [
      { icon: HouseIcon, label: t("dashboard.navigation.dashboard"), path: "/dashboard" },
      { icon: CookingPotIcon, label: t("dashboard.navigation.orders"), path: "/dashboard/orders" },
      { icon: ChartBarIcon, label: t("dashboard.navigation.reports"), path: "/dashboard/reports" },
      { icon: PackageIcon, label: t("dashboard.navigation.products"), path: "/dashboard/products" },
    ];

    const adminOnlyItems: MenuItem[] = [
      { icon: FolderIcon, label: t("dashboard.navigation.categories"), path: "/dashboard/categories" },
      { icon: UsersIcon, label: t("dashboard.navigation.users"), path: "/dashboard/users" },
    ];

    if (hasFullMenuAccess) {
      return [...baseItems, ...adminOnlyItems];
    }

    return baseItems;
  }, [hasFullMenuAccess, t]);

  const businessMenuGroup = useMemo<MenuGroupItem>(() => {
    const subItems: SubMenuItem[] = [
      { label: t("business.menu.info"), path: "/dashboard/business/info" },
      { label: t("business.menu.settings"), path: "/dashboard/business/settings" },
      { label: t("business.menu.limits"), path: "/dashboard/business/limits" },
    ];

    return {
      icon: BuildingsIcon,
      label: t("business.menu.title"),
      subItems,
    };
  }, [t]);

  const pathname = location.pathname;
  const normalizedPathname =
    pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;

  const isBusinessSubpathActive = normalizedPathname.startsWith("/dashboard/business");

  const breadcrumbs = useMemo<Breadcrumb[]>(() => {
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

    const labelMap: Record<string, string> = {
      dashboard: t("dashboard.breadcrumbs.dashboard"),
      orders: t("dashboard.breadcrumbs.orders"),
      users: t("dashboard.breadcrumbs.users"),
      reports: t("dashboard.breadcrumbs.reports"),
      settings: t("dashboard.breadcrumbs.settings"),
      products: t("dashboard.breadcrumbs.products"),
      categories: t("dashboard.breadcrumbs.categories"),
      edit: t("dashboard.breadcrumbs.edit"),
      new: t("dashboard.breadcrumbs.new"),
      business: t("dashboard.breadcrumbs.business"),
      info: t("dashboard.breadcrumbs.info"),
      limits: t("dashboard.breadcrumbs.limits"),
    };

    return segments.map((segment, index) => {
      const label = labelMap[segment] ?? segment;
      const path = `/dashboard/${segments.slice(0, index + 1).join("/")}`;
      const isLast = index === segments.length - 1;
      return { label, path, isLast };
    });
  }, [normalizedPathname, t]);

  const businessSubItems = businessMenuGroup.subItems;
  const BusinessIcon = businessMenuGroup.icon;

  return (
    <div className="w-screen h-screen flex bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <aside
        data-minimized={isMinimized}
        className="hidden md:flex flex-col bg-background border-r border-border data-[minimized=false]:w-64 data-[minimized=true]:w-16 transition-all duration-300 shadow-lg"
      >
        <div className="flex items-center justify-center h-14 sm:h-16 px-4 sm:px-6 md:px-8 border-b border-border relative">
          {shouldShowBusinessSelector ? (
            <BusinessSelectorButton deviceType={DeviceTypeEnum.DESKTOP} />
          ) : (
            <Logo
              data-minimized={isMinimized}
              className="text-lg data-[minimized=true]:hidden"
            />
          )}
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

          {hasFullMenuAccess && (
            <div>
              <button
                type="button"
                onClick={toggleBusinessMenu}
                data-active={isBusinessSubpathActive}
                data-expanded={isBusinessExpanded}
                className="group w-full flex items-center gap-3 px-3 py-2 rounded-md mb-1 transition-colors text-foreground hover:bg-secondary data-[active=true]:bg-sidebar-primary cursor-pointer"
              >
                <BusinessIcon
                  size={20}
                  className="shrink-0 group-data-[active=true]:text-white"
                />
                <span
                  data-minimized={isMinimized}
                  className="flex-1 text-sm text-left data-[minimized=true]:hidden group-data-[active=true]:text-white"
                >
                  {businessMenuGroup.label}
                </span>
                <CaretDownIcon
                  size={16}
                  data-expanded={isBusinessExpanded}
                  data-minimized={isMinimized}
                  className="shrink-0 transition-transform data-[expanded=true]:rotate-180 data-[minimized=true]:hidden group-data-[active=true]:text-white"
                />
              </button>

              <div
                data-expanded={isBusinessExpanded}
                data-minimized={isMinimized}
                className="overflow-hidden data-[expanded=false]:hidden data-[minimized=true]:hidden ml-3 mt-1 mb-1 pl-3 border-l border-border bg-secondary/50 dark:bg-black/20 rounded-r-md"
              >
                {businessSubItems.map((subItem) => {
                  const isSubActive = normalizedPathname === subItem.path;
                  return (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      data-active={isSubActive}
                      className="group flex items-center gap-3 pl-3 pr-3 py-2 rounded-md my-1 transition-colors data-[active=false]:text-muted-foreground data-[active=false]:hover:text-foreground data-[active=false]:hover:bg-secondary data-[active=true]:bg-sidebar-accent"
                    >
                      <span className="text-sm group-data-[active=true]:text-sidebar-accent-foreground">
                        {subItem.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
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
              {t("common.buttons.logout")}
            </span>
          </Button>
        </div>
      </aside>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <Sheet.Content className="flex flex-col">
          <div className="flex items-center justify-center h-14 px-4 border-b border-border">
            {shouldShowBusinessSelector ? (
              <BusinessSelectorButton deviceType={DeviceTypeEnum.MOBILE} />
            ) : (
              <Logo className="text-lg" />
            )}
          </div>

          <nav className="flex-1 p-2">
            {menuItems.map((item) => {
              const ItemIcon = item.icon;
              const isActive = normalizedPathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-active={isActive}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-center gap-3 px-3 py-2 rounded-md mb-1 transition-colors data-[active=false]:text-foreground data-[active=false]:hover:bg-secondary data-[active=true]:bg-sidebar-primary"
                >
                  <ItemIcon
                    size={20}
                    className="shrink-0 group-data-[active=true]:text-white"
                  />
                  <span className="text-sm group-data-[active=true]:text-white">
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {hasFullMenuAccess && (
              <div>
                <button
                  type="button"
                  onClick={toggleBusinessMenu}
                  data-active={isBusinessSubpathActive}
                  data-expanded={isBusinessExpanded}
                  className="group w-full flex items-center gap-3 px-3 py-2 rounded-md mb-1 transition-colors text-foreground hover:bg-secondary data-[active=true]:bg-sidebar-primary cursor-pointer"
                >
                  <BusinessIcon
                    size={20}
                    className="shrink-0 group-data-[active=true]:text-white"
                  />
                  <span className="flex-1 text-sm text-left group-data-[active=true]:text-white">
                    {businessMenuGroup.label}
                  </span>
                  <CaretDownIcon
                    size={16}
                    data-expanded={isBusinessExpanded}
                    className="shrink-0 transition-transform data-[expanded=true]:rotate-180 group-data-[active=true]:text-white"
                  />
                </button>

                <div
                  data-expanded={isBusinessExpanded}
                  className="overflow-hidden data-[expanded=false]:hidden ml-3 mt-1 mb-1 pl-3 border-l border-border bg-secondary/50 dark:bg-black/20 rounded-r-md"
                >
                  {businessSubItems.map((subItem) => {
                    const isSubActive = normalizedPathname === subItem.path;
                    return (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        data-active={isSubActive}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group flex items-center gap-3 pl-3 pr-3 py-2 rounded-md my-1 transition-colors data-[active=false]:text-muted-foreground data-[active=false]:hover:text-foreground data-[active=false]:hover:bg-secondary data-[active=true]:bg-sidebar-accent"
                      >
                        <span className="text-sm group-data-[active=true]:text-sidebar-accent-foreground">
                          {subItem.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{auth?.name}</p>
                <p className="text-xs text-muted-foreground">{auth?.profile}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full"
            >
              <SignOutIcon />
              <span className="ml-2">{t("common.buttons.logout")}</span>
            </Button>
          </div>
        </Sheet.Content>
      </Sheet>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="w-full bg-background border-b border-border h-14 sm:h-16 px-4 sm:px-6 md:px-8 flex items-center shadow-sm">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsMobileMenuOpen(true)}
                data-testid="mobile-menu-button"
                className="md:hidden"
              >
                <ListIcon size={20} />
              </Button>
              <Link
                to="/dashboard"
                className="hover:text-foreground transition-colors"
              >
                {t("dashboard.navigation.dashboard")}
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
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
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
