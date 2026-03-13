import { BASE_STORAGE_KEY } from "./baseStorageKey";

const KEY = `${BASE_STORAGE_KEY}.browser-session` as const;

function generateBrowserState(): string {
    let state = sessionStorage.getItem(KEY);

    if (state !== null) return state;

    // generate new pseudorandom state, not cryptographically secure, but better than nothing
    state = new Array(32)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");

    sessionStorage.setItem(KEY, state);

    return state;
}

/** Randomly generated string used for CSRF protection, unique to the browser's session. */
export const BROWSER_STATE = generateBrowserState();
