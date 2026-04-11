import { StatefulButton } from "@/components/Buttons/StatefulButton/StatefulButton";
import { DialogBase } from "@/components/Dialogs/DialogBase/DialogBase";
import { PermissionsList } from "@/components/PermissionsList/PermissionsList";
import { usePermissions } from "@/contexts/Permissions/PermissionsContext";
import type { PermissionsObject } from "@/shared/types/Permissions/PermissionsObject";
import type { RoleLevel, RolePayload } from "@/shared/types/Role";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./RoleEditRow.css";

interface RoleEditRowProps<T extends RolePayload = RolePayload> {
    data: T;

    onCreate?(data: T): Promise<void>;

    onSave?(data: T): Promise<void>;

    onCancel?(): void;

    onDelete?(data: T): Promise<void>;
}

export const RoleEditRow: React.FC<RoleEditRowProps> = <T extends RolePayload>(
    props: RoleEditRowProps<T>,
) => {
    const { data, onCreate, onSave, onCancel, onDelete } = props;

    const { level } = usePermissions();

    const [newData, setNewData] = useState(data);

    const [levelError, setLevelError] = useState(false);

    useEffect(() => setNewData(data), [data]);

    const handlePermissionsChange = useCallback((type: "general" | "user") => {
        return (value: number, selected: boolean) => {
            let key: keyof PermissionsObject;

            switch (type) {
                case "general":
                    key = "generalPermissions";
                    break;

                case "user":
                    key = "userPermissions";
                    break;
            }

            setNewData((prev) => {
                let newPerms = prev.permissions[key];

                if (selected) {
                    newPerms |= value;
                } else {
                    newPerms ^= value;
                }

                return { ...prev, permissions: { ...prev.permissions, [key]: newPerms } };
            });
        };
    }, []);

    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewData((prev) => ({ ...prev, name: e.target.value }));
    }, []);

    const handleLevelChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const asNumber = Number(e.target.value);

            if (Number.isSafeInteger(asNumber) && asNumber < level) {
                setNewData((prev) => ({ ...prev, level: asNumber as RoleLevel }));
            } else if (asNumber >= level) {
                setLevelError(true);
            }
        },
        [level],
    );

    const handleLevelErrorClose = useCallback(() => setLevelError(false), []);

    const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewData((prev) => ({ ...prev, category: e.target.value || null }));
    }, []);

    const handleCreate = useCallback(async () => {
        await onCreate?.({
            ...newData,
            name: newData.name.trim(),
            category: newData.category !== null ? newData.category.trim() : null,
        });

        onCancel?.();
    }, [onCreate, newData, onCancel]);

    const handleSave = useCallback(async () => {
        await onSave?.({
            ...newData,
            name: newData.name.trim(),
            category: newData.category !== null ? newData.category.trim() : null,
        });

        onCancel?.();
    }, [onSave, newData, onCancel]);

    const handleDelete = useCallback(async () => {
        if (window.confirm(`Are you sure you want to delete this role?`)) {
            await onDelete?.(newData);
        }
    }, [newData, onDelete]);

    const isValid = useMemo(() => {
        if (newData.name.trim().length === 0) {
            // roles must have names
            return false;
        }

        if (
            newData.name.trim() === data.name &&
            newData.level === data.level &&
            newData.category === data.category
        ) {
            // all fields unchanged
            return false;
        }

        return true;
    }, [newData.name, newData.category, data.category, data.name, data.level, newData.level]);

    return (
        <tr className="role-edit-row">
            <td>
                {levelError && (
                    <DialogBase title="Invalid Level" onClose={handleLevelErrorClose} isBad>
                        <div>
                            You cannot set the level of a role to be greater than your highest level
                            ({level.toLocaleString()}).
                        </div>
                    </DialogBase>
                )}

                <label>
                    <span>Name</span>

                    <input
                        type="text"
                        value={newData.name}
                        onChange={handleNameChange}
                        placeholder="My New Role"
                    />
                </label>
            </td>

            <td className="level">
                <label>
                    <span>Level</span>

                    <input
                        inputMode="numeric"
                        value={newData.level}
                        onChange={handleLevelChange}
                        placeholder="0"
                    />
                </label>
            </td>

            <td className="category">
                <label>
                    <span>Category</span>

                    <input
                        placeholder="Category"
                        value={newData.category || ""}
                        onChange={handleCategoryChange}
                    />
                </label>
            </td>

            <td>
                <PermissionsList
                    value={newData.permissions.generalPermissions}
                    type="general"
                    showNone
                    onChange={handlePermissionsChange("general")}
                />
            </td>

            <td>
                <PermissionsList
                    value={newData.permissions.userPermissions}
                    type="user"
                    showNone
                    onChange={handlePermissionsChange("user")}
                />
            </td>

            <td className="actions">
                {!!onCreate && (
                    <StatefulButton
                        onClick={handleCreate}
                        textDo="Create"
                        textDoing="Creating"
                        textDone="Created!"
                        disabled={!isValid}
                    />
                )}

                {!!onSave && (
                    <StatefulButton
                        onClick={handleSave}
                        textDo="Save"
                        textDoing="Saving"
                        textDone="Saved!"
                        disabled={!isValid}
                    />
                )}

                {!!onDelete && (
                    <StatefulButton
                        onClick={handleDelete}
                        textDo="Delete"
                        textDoing="Deleting"
                        textDone="Deleted!"
                    />
                )}

                {!!onCancel && <button onClick={onCancel}>Cancel</button>}
            </td>
        </tr>
    );
};
