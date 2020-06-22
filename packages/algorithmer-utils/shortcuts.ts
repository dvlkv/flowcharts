import { useEffect, useState } from "preact/hooks";

type Shortcut = { code: string, handler: () => void };

export const useShortcuts = (shortcuts: Shortcut[]) => {
  let shortcutsMap = new Map<string, () => void >();
  for (let shortcut of shortcuts) {
    shortcutsMap.set(shortcut.code, shortcut.handler);
  }

  useEffect(() => {
    let listener = (e: KeyboardEvent) => {
      let handler = shortcutsMap.get(e.code);
      if (handler) {
        handler();
      }
    };

    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    }
  }, []);
};

export const useMouse = () => {
  let [mousePos, setMousePos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.x,
        y: e.y
      });
    };

    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return mousePos;
};