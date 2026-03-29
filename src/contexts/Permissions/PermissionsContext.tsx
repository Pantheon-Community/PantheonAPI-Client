import type { PermissionsObject } from "@/shared/types/Permissions/PermissionsObject";
import { type Role, type RoleId, type RoleLevel } from "@/shared/types/Role";
import { flattenPermissions, hasPermission } from "@/shared/utils/PermissionHelpers";
import { notImplementedFunction } from "@/utils/notImplementedFn";
import { createContext, useCallback, useContext, useMemo } from "react";
import { useCurrentUser } from "../CurrentUser/CurrentUserContext";
import { usePantheonApi } from "../PantheonApi/PantheonApiContext";
import { useRoles } from "../Roles/RolesContext";

interface PermissionsContextType {
    readonly level: RoleLevel;

    readonly roles: Role[];

    hasPermission(target: Partial<PermissionsObject>): boolean;

    refetchRoles(): Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType>({
    level: flattenPermissions().highestRoleLevel,
    roles: [],
    hasPermission: notImplementedFunction,
    refetchRoles: notImplementedFunction,
});

export const PermissionsContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { makeJsonRequest } = usePantheonApi();
    const { currentUser, setCurrentUser } = useCurrentUser();
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

    const refetchRoles = useCallback(async () => {
        if (currentUser?.token === undefined) return;

        const roleIds = await makeJsonRequest<RoleId[]>("/users/@me/roles", {
            headers: {
                authorization: `Bearer ${currentUser.token}`,
                accept: "application/json",
            },
        });

        if (roleIds !== null) {
            setCurrentUser((prev) => {
                if (prev === null) {
                    return null;
                }
                return { ...prev, roleIds };
            });
        }
    }, [makeJsonRequest, currentUser?.token, setCurrentUser]);

    const value = useMemo<PermissionsContextType>(
        () => ({
            level: flattenedPermissions.highestRoleLevel,
            roles,
            hasPermission: has,
            refetchRoles,
        }),
        [has, flattenedPermissions.highestRoleLevel, roles, refetchRoles],
    );

    return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
};

export const usePermissions = (): PermissionsContextType => useContext(PermissionsContext);
