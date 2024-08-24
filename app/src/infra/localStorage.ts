
export function localStorageProvider<T>(key: string) {
  return {
    save: (value: T) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    load: (): T | null => {
      const item = localStorage.getItem(key);
      if (!item) {
        return null;
      }
      return JSON.parse(item);
    },
  };
}
