import { Label } from "@/components/ui/label/label";
import type { FieldProps } from "./category-form-dialog.interface";

export function Field({ children, label, htmlFor, error, required }: FieldProps) {
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {required && " *"}
      </Label>
      {children}
      {hasError && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
