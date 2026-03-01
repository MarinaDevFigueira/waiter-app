import type { User } from "@/shared/schemas/user.schema";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";

export interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  onSuccess?: () => void;
}

export interface UserFormValues {
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRoleEnum;
}
