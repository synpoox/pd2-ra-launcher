import { mkdir, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { exists, BaseDirectory } from "@tauri-apps/plugin-fs";
import { appConfigDir, join } from "@tauri-apps/api/path";
import { LauncherSettings } from "../types/settings";

const FILENAME = "settings.json";

const defaultSettings: LauncherSettings = {
  preferences: {
    gameDirectory: "",
    saveDirectory: "",
    plugyPath: "",
    disableAutomaticUpdates: false,
  },
  linux: {
    winePrefix: "",
    wineRunner: "",
  },
  game: {
    densityMultiplier: 1,
    magicItemsDropIdentified: false,
  },
  about: {
    launcherDirectory: "",
  },
};

export async function getConfigDir() {
  const dir = await appConfigDir();
  return dir;
}

export async function ensureSettingsFile(): Promise<void> {
  try {
    const dir = await appConfigDir();
    const settingsPath = await join(dir, FILENAME);

    await mkdir(dir, { recursive: true });

    const settingsExists = await exists(settingsPath);

    if (!settingsExists) {
      await writeTextFile(
        settingsPath,
        JSON.stringify(defaultSettings, null, 2)
      );
      console.log("settings.json created at", settingsPath);
    } else {
      console.log("settings.json already exists at", settingsPath);
    }
  } catch (err) {
    console.error("Error ensuring settings.json:", err);
  }
}

export async function loadSettings(): Promise<LauncherSettings> {
  const content = await readTextFile(FILENAME, {
    baseDir: BaseDirectory.AppConfig,
  });
  return JSON.parse(content) as LauncherSettings;
}

export async function saveSettings(settings: LauncherSettings): Promise<void> {
  await writeTextFile(FILENAME, JSON.stringify(settings, null, 2), {
    baseDir: BaseDirectory.AppConfig,
  });
}
