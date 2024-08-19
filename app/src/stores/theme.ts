import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

const actualColorThemes = ["light", "dark"] as const;
export type ActualColorTheme = typeof actualColorThemes[number];
export type ColorTheme = "system" | ActualColorTheme

const colorThemeAtom = atom<ColorTheme>(loadTheme() || "system");
const systemPreferredThemeAtom = atom<ActualColorTheme | null>(null);
const effectiveColorThemeAtom = atom<ActualColorTheme>(
  (get) => {
    const theme = get(colorThemeAtom);
    if (theme === "system") {
      return get(systemPreferredThemeAtom) || "dark";
    }
    return theme;
  },
);

function saveTheme(theme: ColorTheme) {
  localStorage.setItem("colorTheme", theme);
}

function loadTheme(): ColorTheme | null {
  const theme = localStorage.getItem("colorTheme");
  if (theme) {
    if (theme === "system") {
      return theme;
    } else if ((actualColorThemes as unknown as string[]).includes(theme)) {
      return theme as ColorTheme;
    }
  }
  return null;
}

export const useColorTheme = () => {
  const [preferredColorTheme, setPreferredColorTheme] = useAtom(systemPreferredThemeAtom);
  const [appColorTheme, setAppColorTheme] = useAtom(colorThemeAtom);
  const [colorTheme] = useAtom(effectiveColorThemeAtom);

  useEffect(() => {
    document.documentElement.dataset.theme = colorTheme;
  }, [colorTheme]);

  return {
    appColorTheme,
    colorTheme,
    setAppColorTheme,
    preferredColorTheme,
    setPreferredColorTheme,
    loadTheme,
    saveTheme,
  };
}

export const useColorThemeObserver = () => {
  const {
    loadTheme,
    setAppColorTheme,
    setPreferredColorTheme,
  } = useColorTheme();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const theme = mediaQuery.matches ? 'dark' : 'light';
      // console.log("theme", theme);
      setPreferredColorTheme(theme);
    };
    handler();
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [setPreferredColorTheme]);

  useEffect(() => {
    if (typeof window === 'undefined') { return; }
    const theme: ColorTheme = loadTheme() || "system";
    // console.log("setting", theme);
    setAppColorTheme(theme);
  }, [loadTheme, setAppColorTheme]);
};
