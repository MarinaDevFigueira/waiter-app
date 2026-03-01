export interface GetPermissionResponse {
  name: string;
  module: string;
  source?: "role" | "custom";
}

export interface GetMyPermissionsResponse {
  userId: string;
  role: string;
  permissions: GetPermissionResponse[];
}

export interface GetPermissionCatalogItemResponse {
  id: string;
  name: string;
  module: string;
}

export interface GetPermissionsCatalogResponse {
  permissions: GetPermissionCatalogItemResponse[];
}

export interface AddUserPermissionsRequestBody {
  permissions: string[];
}

export interface RemoveUserPermissionsRequestBody {
  permissions: string[];
}
