export interface PermissionAudit {
    auditId: number;
    permissionKey: string;
    oldValue: boolean;
    newValue: boolean;
    changedBy: string;
    changedAt: string;
    scope: "ROLE" | "USER";
    scopeName?: string;
}
