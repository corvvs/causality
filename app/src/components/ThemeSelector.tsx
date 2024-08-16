import { MdOutlineDarkMode, MdOutlineLightbulb, MdOutlineLightMode } from "react-icons/md";
import { useColorTheme } from "../stores/theme";
import { MultipleButtons } from "./MultipleButtons";
import { InlineIcon } from "./InlineIcon";

/**
 * カラーテーマを設定するためのUI
 */
export const ThemeSelector = () => {
  const { appColorTheme, setAppColorTheme, saveTheme } = useColorTheme();

  return (
    <MultipleButtons
      currentKey={appColorTheme}
      items={[
        {
          key: "light",
          content: <div
            className="h-[1.5rem]"
          >
            <InlineIcon i={<MdOutlineLightMode />} />
            <span className="p-1">Light</span>
          </div>
        },
        {
          key: "system",
          content: <div
            className="h-[1.5rem]"
          >
            <InlineIcon i={<MdOutlineLightbulb />} />
            <span className="p-1">Auto</span>
          </div>
        },
        {
          key: "dark",
          content: <div
            className="h-[1.5rem]"
          >
            <InlineIcon i={<MdOutlineDarkMode />} />
            <span className="p-1">Dark</span>
          </div>
        },
      ]}
      onClick={(item) => {
        const theme = item.key;
        console.log(`theme: ${theme}`);
        setAppColorTheme(theme)
        saveTheme(theme);
      }}
    />
  );
}
