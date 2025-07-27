import { useEffect, useState, useCallback } from "react";
import {
  ensureSettingsFile,
  loadSettings,
  saveSettings,
} from "../util/settings";
import { Settings } from "../types/settings";

// ✅ Vanilla debounce helper
function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

// ✅ Default settings fallback
const defaultSettings: Settings = {
  preferences: {
    gameDirectory: "",
    saveDirectory: "",
    plugyPath: "",
  },
  game: {
    densityMultiplier: 1,
  },
  about: {
    launcherDirectory: "",
  },
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  const debouncedSave = useCallback(
    debounce((next: Settings) => {
      saveSettings(next).catch(console.error);
    }, 300),
    []
  );

  // Load from disk on first mount
  useEffect(() => {
    (async () => {
      await ensureSettingsFile();
      const loaded = await loadSettings();

      // Merge defaults in case file is missing fields
      setSettings({ ...defaultSettings, ...loaded });
      setLoaded(true);
    })();
  }, []);

  // Save to disk when settings change
  useEffect(() => {
    if (loaded) debouncedSave(settings);
  }, [settings, loaded, debouncedSave]);

  return { settings, setSettings, loaded };
}
