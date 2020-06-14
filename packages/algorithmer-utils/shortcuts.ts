import { useEffect } from "preact/hooks";

type Shortcut = { code: string, handler: () => void };

export const useShortcuts = (shortcuts: Shortcut[]) => {
  let shortcutsMap = new Map<string, () => void >();
  for (let shortcut of shortcuts) {
    shortcutsMap.set(shortcut.code, shortcut.handler);
  }

  useEffect(() => {
    let listner = (e: KeyboardEvent) => {
      let handler = shortcutsMap.get(e.code);
      if (handler) {
        handler();
      }
    };

    document.addEventListener('keydown', listner);
    return () => {
      document.removeEventListener('keydown', listner);
    }
  });
}