import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export function Logo({ className = "", ...props }) {
  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-center justify-center bg-sidebar-primary px-3 py-1 rounded transition-opacity hover:opacity-90",
        className,
      )}
      data-testid="logo"
      {...props}
    >
      <span className="font-title text-white text-xl uppercase font-bold tracking-tight">
        WaiterApp
      </span>
    </Link>
  );
}
