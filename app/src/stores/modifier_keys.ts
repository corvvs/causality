import { atom, useAtom } from "jotai";
import { useEffect } from "react";

export type MyModifierKey = {
  shift: boolean;
};

const modifierKeyAtom = atom<MyModifierKey>({
  shift: false,
});

/**
 * 修飾キーの押下状態を提供するフック
 */
export const useModifierKey = () => {
  const [modifierKey] = useAtom(modifierKeyAtom);
  return {
    modifierKey,
  };
}

/**
 * event.key の値に対応する MyModifierKey のフィールド名
 */
const keyMap: { [key: string]: keyof MyModifierKey } = {
  "Shift": "shift"
};

/**
 * 修飾キーの押下状態を監視し、 modifierKeyAtom を更新するためのフック
 * 1箇所で十分
 */
export const useModifierKeyObserevr = () => {
  const [, setModifierKey] = useAtom(modifierKeyAtom);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const attr = keyMap[event.key];
      if (!attr) { return; }
      setModifierKey((prev) => {
        return {
          ...prev,
          [attr]: true,
        }
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const attr = keyMap[event.key];
      if (!attr) { return; }
      setModifierKey((prev) => {
        return {
          ...prev,
          [attr]: false,
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setModifierKey]);
};
