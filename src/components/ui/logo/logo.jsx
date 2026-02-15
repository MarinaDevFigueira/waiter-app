export function Logo({ className = "", ...props }) {
  return (
    <h1 className={`font-bold font-title uppercase ${className}`} {...props}>
      <span className="text-sidebar-primary">Waiter</span>
      <span className="font-extralight text-foreground">App</span>
    </h1>
  );
}
