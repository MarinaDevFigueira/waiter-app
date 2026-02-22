import { Drawer as DrawerPrimitive } from "vaul";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Drawer({
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root {...props} />;
}

function DrawerTrigger({
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger {...props} />;
}

function DrawerPortal({
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}

interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> {
  showHandle?: boolean;
}

function DrawerContent({
  className,
  children,
  showHandle = true,
  ...props
}: DrawerContentProps) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-xl bg-card border-t border-border",
          className
        )}
        {...props}
      >
        {showHandle && (
          <div className="mx-auto mt-4 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/20" />
        )}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between gap-4 p-4 shrink-0", className)}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function DrawerFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-auto flex flex-col gap-2 p-4 pt-2",
        className
      )}
      {...props}
    />
  );
}

function DrawerClose({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Close>) {
  return (
    <DrawerPrimitive.Close
      className={cn(
        "rounded-sm opacity-70 transition-opacity",
        "hover:opacity-100 hover:cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      <XIcon className="size-4" />
      <span className="sr-only">Fechar</span>
    </DrawerPrimitive.Close>
  );
}

Drawer.Trigger = DrawerTrigger;
Drawer.Content = DrawerContent;
Drawer.Header = DrawerHeader;
Drawer.Title = DrawerTitle;
Drawer.Description = DrawerDescription;
Drawer.Footer = DrawerFooter;
Drawer.Close = DrawerClose;

export { Drawer };
export default Drawer;
