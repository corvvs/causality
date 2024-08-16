import { useColorThemeObserver } from "../../stores/theme";

/**
 * システムのカラーモード(ライト/ダーク)の変化を追跡するカスタムフック
 */
export const ThemeObserver = () => {
  useColorThemeObserver();
  return <></>
};
