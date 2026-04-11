import { GeneralPermissionInfo } from "@/shared/constants/permissions/GeneralPermissionsInfo";
import type { PermissionsInfo } from "@/shared/constants/permissions/PermissionsInfo";
import { UserPermissionsInfo } from "@/shared/constants/permissions/UserPermissionsInfo";
import { ALL_GENERAL_PERMISSIONS } from "@/shared/types/Permissions/GeneralPermissions";
import { ALL_USER_PERMISSIONS } from "@/shared/types/Permissions/UserPermissions";
import { split } from "@/shared/utils/bitfieldHelpers";
import { useCallback, useMemo, useState } from "react";
import { DetailedPermissionsList } from "../DetailedPermissionsList/DetailedPermissionsList";
import { DialogBase } from "../Dialogs/DialogBase/DialogBase";
import "./PermissionsList.css";

interface PermissionsListProps {
    value: number;

    type: "general" | "user";

    showNone: boolean;

    onChange?(value: number, selected: boolean): void;
}

export const PermissionsList: React.FC<PermissionsListProps> = (props) => {
    const { value, type, showNone, onChange } = props;

    const values = useMemo(() => split(value), [value]);

    const selectedValues = useMemo(() => new Set(values), [values]);

    const { dictionary, allValues } = useMemo<{
        dictionary: Record<number, PermissionsInfo>;
        allValues: number;
    }>(() => {
        switch (type) {
            case "general":
                return {
                    dictionary: GeneralPermissionInfo,
                    allValues: ALL_GENERAL_PERMISSIONS,
                };
            case "user":
                return {
                    dictionary: UserPermissionsInfo,
                    allValues: ALL_USER_PERMISSIONS,
                };
        }
    }, [type]);

    const [isAdding, setIsAdding] = useState(false);

    const handleClickAdd = useCallback(() => setIsAdding(true), []);

    const handleStopAdd = useCallback(() => setIsAdding(false), []);

    return (
        <div className="permissions-list">
            {values.map((x) => (
                <div key={x} title={dictionary[x].description}>
                    <span>{dictionary[x].name}</span>
                </div>
            ))}

            {values.length === 0 && showNone && (
                <div className="none">
                    <i>None</i>
                </div>
            )}

            {!!onChange && (
                <button className="edit" title="Add permissions" onClick={handleClickAdd}>
                    <b>Edit</b>
                </button>
            )}

            {isAdding && (
                <DialogBase title="Edit Permissions" wide isBad={false} onClose={handleStopAdd}>
                    <div className="add-dialog">
                        <p>You will still need to save your changes once closing this dialog.</p>

                        <DetailedPermissionsList
                            value={allValues}
                            dictionary={dictionary}
                            onChange={onChange}
                            selectedValues={selectedValues}
                        />
                    </div>
                </DialogBase>
            )}
        </div>
    );
};
