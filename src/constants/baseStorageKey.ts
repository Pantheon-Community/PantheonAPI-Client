export const BASE_STORAGE_KEY = "PANTHEON_API_CLIENT" as const;

// migrations
const newValues: { key: string; value: string }[] = [];

for (let i = localStorage.length; i >= 0; i--) {
    const key = localStorage.key(i);

    if (!key?.startsWith("PANTHEON_COMMUNITY_API_CLIENT")) continue;

    const value = localStorage.getItem(key);

    if (value === null) {
        localStorage.removeItem(key);
        continue;
    }

    newValues.push({ key, value });
}

for (const { key, value } of newValues) {
    localStorage.setItem(key.replace("PANTHEON_COMMUNITY_API_CLIENT", BASE_STORAGE_KEY), value);
    localStorage.removeItem(key);
}
