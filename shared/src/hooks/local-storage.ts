import { useCallback, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValueOrFn: T | (() => T)) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        const initialValue =
            initialValueOrFn instanceof Function ? initialValueOrFn() : initialValueOrFn;

        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.error(error);
            return initialValue;
        }
    });
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = useCallback(
        (value: T | ((previousValue: T) => T)) => {
            try {
                setStoredValue((prevValue) => {
                    const valueToStore = value instanceof Function ? value(prevValue) : value;
                    if (typeof window !== 'undefined') {
                        window.localStorage.setItem(key, JSON.stringify(valueToStore));
                    }

                    return valueToStore;
                });
            } catch (error) {
                // A more advanced implementation would handle the error case
                console.error(error);
            }
        },
        [key],
    );

    return [storedValue, setValue] as const;
}
