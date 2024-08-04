
export function localStorageProvider<T>() {
  return {
    save: (key: string, value: T) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    load: (key: string): T | null => {
      const item = localStorage.getItem(key);
      if (!item) {
        return null;
      }
      return JSON.parse(item);
    },
  };
}
