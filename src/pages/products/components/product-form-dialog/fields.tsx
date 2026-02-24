import { Label } from "@/components/ui/label/label";
import type { FieldProps, FieldsProps } from "./product-form-dialog.interface";

export function Fields({ children }: FieldsProps) {
  return (
    <div className="px-6 flex flex-col gap-4">
      {children}
    </div>
  );
}

export function Field({ children, label, htmlFor, error, required }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {required && " *"}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
