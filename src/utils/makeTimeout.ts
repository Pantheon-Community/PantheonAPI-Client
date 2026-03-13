/**
 * Like `setTimeout` but:
 *
 * - Better type-awareness.
 * - Returns a cleanup function for `useEffect` to use.
 */
export function makeTimeout<Args extends unknown[]>(
    fn: (...args: Args) => unknown,
    delay: number,
    ...args: Args
): () => void {
    const timeout = setTimeout(fn, delay, args);

    return () => clearTimeout(timeout);
}
