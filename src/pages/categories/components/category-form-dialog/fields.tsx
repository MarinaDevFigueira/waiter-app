import type { FieldsProps } from "./category-form-dialog.interface";

export function Fields({ children }: FieldsProps) {
  return (
    <div className="px-6 flex flex-col gap-4">
      {children}
    </div>
  );
}
