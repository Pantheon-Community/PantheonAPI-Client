import { useMemo } from "react";
import { useLocation } from "react-router";

export function useLocationHash(): string {
    const { hash } = useLocation();

    return useMemo(() => {
        if (hash.startsWith("#")) {
            return hash.slice(1);
        }

        return hash;
    }, [hash]);
}
