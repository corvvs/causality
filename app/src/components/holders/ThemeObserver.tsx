import { useEffect } from "react";
import { ColorTheme, useColorTheme } from "../../stores/theme";

export const ThemeObserver = () => {
  const {
    loadTheme,
    setAppColorTheme,
    preferredColorTheme,
    setPreferredColorTheme,
  } = useColorTheme();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setPreferredColorTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = () => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const theme = mediaQuery.matches ? 'dark' : 'light';
      console.log(`${preferredColorTheme} -> ${theme}`);
      setPreferredColorTheme(theme);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') { return; }
    const theme: ColorTheme = loadTheme() || "system";
    console.log("setting", theme);
    setAppColorTheme(theme);
  }, []);

  console.log("preferredColorTheme", preferredColorTheme);
  // reflectColorTheme(colorTheme);
  return <></>
};
