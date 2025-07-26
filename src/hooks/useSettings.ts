import { useEffect, useState } from "react";
import {
  ensureSettingsFile,
  loadSettings,
  saveSettings,
} from "../util/settings";
import { Settings } from "../types/settings";

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    (async () => {
      await ensureSettingsFile();
      const loaded = await loadSettings();
      setSettings(loaded);
    })();
  }, []);

  useEffect(() => {
    if (settings !== null) {
      saveSettings(settings).catch(console.error);
    }
  }, [settings]);

  return { settings, setSettings };
}
