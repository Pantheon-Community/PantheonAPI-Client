import type { PermissionsInfo } from "@/shared/constants/permissions/PermissionsInfo";
import { split } from "@/shared/utils/PermissionHelpers";
import { useCallback, useMemo } from "react";
import "./DetailedPermissionsList.css";

interface DetailedPermissionsListProps {
    value: number;

    dictionary: Record<number, PermissionsInfo>;

    selectedValues?: Set<number>;

    onChange?(value: number, selected: boolean): void;
}

export const DetailedPermissionsList: React.FC<DetailedPermissionsListProps> = ({
    value,
    dictionary,
    selectedValues,
    onChange,
}) => {
    const values = useMemo(() => split(value), [value]);

    const makeChangeHandler = useCallback(
        (x: number) => {
            return (e: React.ChangeEvent<HTMLInputElement>) => {
                onChange?.(x, e.target.checked);
            };
        },
        [onChange],
    );

    return (
        <ul className={`detailed-permissions-list ${onChange ? "editable" : undefined}`}>
            {values.map((x) => (
                <li key={x}>
                    <label>
                        {!!onChange && (
                            <input
                                type="checkbox"
                                checked={!!selectedValues?.has(x)}
                                onChange={makeChangeHandler(x)}
                            />
                        )}
                        <span>{dictionary[x].name}</span>
                        <span className="description">{dictionary[x].description}</span>
                        <span className="value">{x}</span>
                    </label>
                </li>
            ))}
        </ul>
    );
};
