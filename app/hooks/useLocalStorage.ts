import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Use lazy initialization to read from localStorage only once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Failed to load ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        if (typeof value !== 'undefined' && value !== null) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.error(`Failed to save ${key} to localStorage:`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
}
