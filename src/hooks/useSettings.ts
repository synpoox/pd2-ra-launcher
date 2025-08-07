import { useEffect, useState, useCallback } from "react";
import {
  ensureSettingsFile,
  loadSettings,
  saveSettings,
} from "../util/settings";
import { LauncherSettings } from "../types/settings";
import { syncSavePathToGameSettings } from "../util/syncSavePath";
import { join } from "@tauri-apps/api/path";

// ✅ Vanilla debounce helper
function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

// ✅ Default settings fallback
const defaultSettings: LauncherSettings = {
  preferences: {
    gameDirectory: "",
    saveDirectory: "",
    plugyPath: "",
    disableAutomaticUpdates: false,
  },
  game: {
    densityMultiplier: 1,
  },
  about: {
    launcherDirectory: "",
  },
};

export function useSettings() {
  const [settings, setSettings] = useState<LauncherSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  const debouncedSave = useCallback(
    debounce((next: LauncherSettings) => {
      saveSettings(next).catch(console.error);
    }, 300),
    []
  );

  // Load from disk on first mount
  useEffect(() => {
    (async () => {
      await ensureSettingsFile();
      const loaded = await loadSettings();

      const pd2JsonPath = await join(
        loaded.preferences.gameDirectory,
        "ProjectDiablo.json"
      );
      const updated = await syncSavePathToGameSettings(loaded, pd2JsonPath);
      if (updated) {
        console.log("ProjectDiablo.json was synced successfully.");
      }
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
