import { atom, useAtom } from "jotai";
import { useEffect } from "react";

export type MyModifierKey = {
  shift: boolean;
  escape: boolean;
  delete: boolean;
};

export type MyModifierKeyType = keyof MyModifierKey;

const modifierKeyAtom = atom<MyModifierKey>({
  shift: false,
  escape: false,
  delete: false,
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
  "Shift": "shift",
  "Escape": "escape",
};

/**
 * 修飾キーの押下状態を監視し、 modifierKeyAtom を更新するためのフック
 * 1箇所で十分
 */
export const useModifierKeyObserevr = () => {
  const [, setModifierKey] = useAtom(modifierKeyAtom);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log("[handleKeyDown] event.key: ", event.key)
      const attr = keyMap[event.key];
      if (!attr) { return; }
      setModifierKey((prev) => {
        if (prev[attr]) { return prev; }
        return {
          ...prev,
          [attr]: true,
        }
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      console.log("[handleKeyUp] event.key: ", event.key)
      const attr = keyMap[event.key];
      if (!attr) { return; }
      setModifierKey((prev) => {
        if (!prev[attr]) { return prev; }
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
