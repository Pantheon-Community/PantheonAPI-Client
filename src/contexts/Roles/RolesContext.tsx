import { BASE_STORAGE_KEY } from "@/constants/baseStorageKey";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import type { Role, RoleId, RolePayload } from "@/shared/types/Role";
import { notImplementedFunction } from "@/utils/notImplementedFn";
import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useCurrentUser } from "../CurrentUser/CurrentUserContext";
import { usePantheonApi } from "../PantheonApi/PantheonApiContext";

interface RolesContextType {
    readonly roles: Role[];

    readonly roleMap: ReadonlyMap<RoleId, Role>;

    fetch(controller: AbortController): Promise<void>;

    addRole(role: RolePayload): Promise<void>;

    updateRole(role: Role): Promise<void>;

    deleteRole(id: RoleId): Promise<void>;
}

const KEY = `${BASE_STORAGE_KEY}.roles` as const;

const RolesContext = createContext<RolesContextType>({
    roles: [],
    roleMap: new Map(),
    fetch: notImplementedFunction,
    addRole: notImplementedFunction,
    updateRole: notImplementedFunction,
    deleteRole: notImplementedFunction,
});

export const RolesContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { makeRequest, makeJsonRequest } = usePantheonApi();
    const { currentUser } = useCurrentUser();

    const [roles, setRoles] = useSessionStorage<Role[]>(KEY, JSON);

    const roleMap = useMemo(() => {
        const output = new Map<RoleId, Role>();

        if (roles !== null) {
            for (const role of roles) {
                output.set(role.id, role);
            }
        }

        return output;
    }, [roles]);

    const fetch = useCallback(
        async (controller: AbortController) => {
            const response = await makeJsonRequest<Role[]>("/roles", {
                headers: { accept: "application/json" },
                signal: controller.signal,
            });

            if (response !== null) {
                setRoles(response);
            }
        },
        [setRoles, makeJsonRequest],
    );

    const addRole = useCallback(
        async (input: RolePayload) => {
            if (currentUser?.token === undefined) return;

            const createdId = await makeJsonRequest<RoleId>("/roles", {
                method: "POST",
                body: JSON.stringify(input),
                headers: {
                    authorization: `Bearer ${currentUser.token}`,
                    accept: "application/json",
                    "content-type": "application/json",
                },
            });

            if (createdId === null) {
                return;
            }

            setRoles((prev) => {
                if (prev === null) {
                    return null;
                }

                return [
                    ...prev,
                    {
                        id: createdId,
                        ...input,
                        createdBy: currentUser.user.id,
                        createdAt: new Date().toISOString(),
                        lastUpdatedBy: currentUser.user.id,
                        lastUpdatedAt: new Date().toISOString(),
                    },
                ];
            });
        },
        [makeJsonRequest, setRoles, currentUser?.token, currentUser?.user.id],
    );

    const updateRole = useCallback(
        async (input: Role) => {
            if (currentUser?.token === undefined) return;

            const { id, ...rest } = input;

            const response = await makeRequest(`/roles/${id}`, {
                method: "PATCH",
                body: JSON.stringify(rest satisfies RolePayload),
                headers: {
                    authorization: `Bearer ${currentUser.token}`,
                    accept: "application/json",
                    "content-type": "application/json",
                },
            });

            if (response) {
                setRoles((prev) => {
                    if (prev === null) {
                        return null;
                    }

                    const idx = prev.findIndex((x) => x.id === id);

                    if (idx !== -1) {
                        const newRoles = [...prev];
                        newRoles[idx] = input;
                        return newRoles;
                    }

                    return prev;
                });
            }
        },
        [setRoles, makeRequest, currentUser?.token],
    );

    const deleteRole = useCallback(
        async (id: RoleId) => {
            if (currentUser?.token === undefined) return;

            const response = await makeRequest(`/roles/${id}`, {
                method: "DELETE",
                headers: {
                    authorization: `Bearer ${currentUser.token}`,
                    accept: "application/json",
                    "content-type": "application/json",
                },
            });

            if (response) {
                setRoles((prev) => {
                    if (prev === null) {
                        return null;
                    }

                    const idx = prev.findIndex((x) => x.id === id);

                    if (idx !== -1) {
                        const newRoles = [...prev];
                        newRoles.splice(idx, 1);
                        return newRoles;
                    }

                    return prev;
                });
            }
        },
        [setRoles, makeRequest, currentUser?.token],
    );

    useEffect(() => {
        if (roles !== null) return;

        const controller = new AbortController();

        void fetch(controller);

        return () => controller.abort();
    }, [fetch, roles]);

    const value = useMemo<RolesContextType>(
        () => ({ roles: roles ?? [], roleMap, fetch, addRole, updateRole, deleteRole }),
        [roles, fetch, roleMap, addRole, updateRole, deleteRole],
    );

    return <RolesContext.Provider value={value}>{children}</RolesContext.Provider>;
};

export const useRoles = (): RolesContextType => useContext(RolesContext);
