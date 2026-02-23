import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Dialog({ children, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}

function DialogTrigger({ ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />;
}

function DialogPortal({ ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal {...props} />;
}

function DialogOverlay({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        aria-describedby={undefined}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
          "bg-card border border-border rounded-lg shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          "duration-200",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between gap-4 p-6 pb-4 shrink-0", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-end gap-2 p-6 pt-4", className)}
      {...props}
    />
  );
}

function DialogClose({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
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
    </DialogPrimitive.Close>
  );
}

Dialog.Trigger = DialogTrigger;
Dialog.Content = DialogContent;
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Footer = DialogFooter;
Dialog.Close = DialogClose;

export { Dialog };
export default Dialog;
