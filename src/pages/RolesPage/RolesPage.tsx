import { DetailedPermissionsList } from "@/components/DetailedPermissionsList/DetailedPermissionsList";
import { PermissionsList } from "@/components/PermissionsList/PermissionsList";
import { usePermissions } from "@/contexts/Permissions/PermissionsContext";
import { useRoles } from "@/contexts/Roles/RolesContext";
import { Categories } from "@/shared/constants/permissions/Categories";
import { GeneralPermissionInfo } from "@/shared/constants/permissions/GeneralPermissionsInfo";
import { UserPermissionsInfo } from "@/shared/constants/permissions/UserPermissionsInfo";
import {
    ALL_GENERAL_PERMISSIONS,
    GeneralPermissions,
} from "@/shared/types/Permissions/GeneralPermissions";
import { ALL_USER_PERMISSIONS, UserPermissions } from "@/shared/types/Permissions/UserPermissions";
import { type Role, type RoleLevel, type RolePayload } from "@/shared/types/Role";
import { useCallback, useMemo, useState } from "react";
import { RoleEditRow } from "./RoleEditRow";
import "./RolesPage.css";

export const RolesPage: React.FC = () => {
    const { roles, addRole, updateRole, deleteRole } = useRoles();
    const { hasPermission } = usePermissions();

    const canEdit = useMemo(() => {
        return hasPermission({ generalPermissions: GeneralPermissions.EditRoles });
    }, [hasPermission]);

    const [editContext, setEditContext] = useState<Role>();

    const [addContext, setAddContext] = useState<RolePayload>();

    const handleClickAdd = useCallback(() => {
        setAddContext({
            name: "",
            icon: "",
            category: "",
            level: 0 as RoleLevel,
            permissions: {
                generalPermissions: GeneralPermissions.None,
                userPermissions: UserPermissions.None,
            },
        });
    }, []);

    const handleCancelAdd = useCallback(() => setAddContext(undefined), []);

    const handleClickEdit = useCallback((role: Role) => () => setEditContext(role), []);

    const handleCancelEdit = useCallback(() => setEditContext(undefined), []);

    const handleConfirmDelete = useCallback(
        async (role: Role) => {
            return await deleteRole(role.id);
        },
        [deleteRole],
    );

    return (
        <section className="roles-page">
            <h1>Roles</h1>

            <table>
                <thead>
                    <tr>
                        <th className="name" rowSpan={2}>
                            Name
                        </th>
                        <th className="level" rowSpan={2}>
                            Level
                        </th>
                        <th className="category" rowSpan={2}>
                            Category
                        </th>
                        <th colSpan={2}>Permissions</th>
                    </tr>
                    <tr>
                        <th title={Categories.GeneralPermissions.description}>General</th>
                        <th title={Categories.UserPermissions.description}>User</th>
                    </tr>
                </thead>

                <tbody>
                    {roles.map((role) => {
                        if (editContext === role) {
                            return (
                                <RoleEditRow
                                    key={role.id}
                                    data={editContext}
                                    onSave={updateRole}
                                    onDelete={handleConfirmDelete}
                                    onCancel={handleCancelEdit}
                                />
                            );
                        }

                        return (
                            <tr key={role.id}>
                                <td>{role.name}</td>
                                <td>{role.level.toLocaleString()}</td>
                                <td>{role.category}</td>
                                <td>
                                    <PermissionsList
                                        value={role.permissions.generalPermissions}
                                        type="general"
                                        showNone={false}
                                    />
                                </td>
                                <td>
                                    <PermissionsList
                                        value={role.permissions.userPermissions}
                                        type="user"
                                        showNone={false}
                                    />
                                </td>

                                {canEdit && (
                                    <td className="actions">
                                        <button onClick={handleClickEdit(role)}>Edit</button>
                                    </td>
                                )}
                            </tr>
                        );
                    })}

                    {!!addContext && (
                        <RoleEditRow
                            data={addContext}
                            onCreate={addRole}
                            onCancel={handleCancelAdd}
                        />
                    )}
                </tbody>
            </table>

            {canEdit && !addContext && <button onClick={handleClickAdd}>Create New Role</button>}

            <h3>Permissions Glossary</h3>

            <details open className="margined">
                <summary>{Categories.GeneralPermissions.name}</summary>

                <p>{Categories.GeneralPermissions.description}</p>

                <DetailedPermissionsList
                    value={ALL_GENERAL_PERMISSIONS}
                    dictionary={GeneralPermissionInfo}
                />
            </details>

            <details open className="margined">
                <summary>{Categories.UserPermissions.name}</summary>

                <p>{Categories.UserPermissions.description}</p>

                <DetailedPermissionsList
                    value={ALL_USER_PERMISSIONS}
                    dictionary={UserPermissionsInfo}
                />
            </details>
        </section>
    );
};
