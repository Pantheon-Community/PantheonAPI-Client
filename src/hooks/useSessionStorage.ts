import { useEffect, useState } from "react";

interface StorageStrategy<T> {
    parse(rawValue: string): T;

    stringify(value: T): string;
}

export function useSessionStorage<T>(
    key: string,
    strategy: StorageStrategy<T>,
): [T | null, React.Dispatch<React.SetStateAction<T | null>>] {
    const [value, setValue] = useState(() => {
        const rawValue = sessionStorage.getItem(key);
        if (rawValue === null) return null;
        return strategy.parse(rawValue);
    });

    useEffect(() => {
        if (value === null) {
            return;
        }

        sessionStorage.setItem(key, strategy.stringify(value));

        return;
    }, [strategy, key, value]);

    return [value, setValue];
}
