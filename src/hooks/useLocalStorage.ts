import { Dispatch, SetStateAction, useEffect, useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      if (storedValue === undefined) {
        window.localStorage.removeItem(key);
        return;
      }

      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Keep persistence failures non-blocking.
    }
  }, [key, storedValue]);

  const removeValue = (): void => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch {
      // Keep persistence failures non-blocking.
    }
  };

  return [storedValue, setStoredValue, removeValue];
}

export default useLocalStorage;
