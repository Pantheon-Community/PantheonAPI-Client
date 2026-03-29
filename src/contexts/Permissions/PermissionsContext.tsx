import type { PermissionsObject } from "@/shared/types/Permissions/PermissionsObject";
import type { Role, RoleLevel } from "@/shared/types/Role";
import { flattenPermissions, hasPermission } from "@/shared/utils/PermissionHelpers";
import { notImplementedFunction } from "@/utils/notImplementedFn";
import { createContext, useCallback, useContext, useMemo } from "react";
import { useCurrentUser } from "../CurrentUser/CurrentUserContext";
import { useRoles } from "../Roles/RolesContext";

interface PermissionsContextType {
    readonly level: RoleLevel;

    readonly roles: Role[];

    hasPermission(target: Partial<PermissionsObject>): boolean;
}

const PermissionsContext = createContext<PermissionsContextType>({
    level: flattenPermissions().highestRoleLevel,
    roles: [],
    hasPermission: notImplementedFunction,
});

export const PermissionsContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { currentUser } = useCurrentUser();
    const { roleMap } = useRoles();

    const roles = useMemo(() => {
        if (currentUser === null) return [];

        return currentUser.roleIds
            .map((id) => roleMap.get(id))
            .filter((role) => role !== undefined);
    }, [roleMap, currentUser]);

    const flattenedPermissions = useMemo(() => {
        return flattenPermissions(...roles);
    }, [roles]);

    const has = useCallback(
        (target: Partial<PermissionsObject>) => {
            return hasPermission(flattenedPermissions, target);
        },
        [flattenedPermissions],
    );

    const value = useMemo<PermissionsContextType>(
        () => ({
            level: flattenedPermissions.highestRoleLevel,
            roles,
            hasPermission: has,
        }),
        [has, flattenedPermissions.highestRoleLevel, roles],
    );

    return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
};

export const usePermissions = (): PermissionsContextType => useContext(PermissionsContext);
