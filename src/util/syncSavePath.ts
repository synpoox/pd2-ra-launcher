import { exists, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { LauncherSettings } from "../types/settings";
import { ProjectDiabloSettings } from "../types/settings"; // adjust this import path if needed

/**
 * Reads ProjectDiablo.json, updates save_path if needed, and writes it back.
 * @param launcherSettings LauncherSettings object
 * @param pd2Path Full path to ProjectDiablo.json
 * @returns true if file was updated, false if unchanged
 */
export async function syncSavePathToGameSettings(
  launcherSettings: LauncherSettings,
  pd2Path: string
): Promise<boolean> {
  if (!(await exists(pd2Path))) {
    console.warn("ProjectDiablo.json does not exist:", pd2Path);
    return false;
  }

  const raw = await readTextFile(pd2Path);
  let parsed: ProjectDiabloSettings;

  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse ProjectDiablo.json:", err);
    return false;
  }

  const launcherSavePath = launcherSettings.preferences.saveDirectory;
  const currentGameSavePath = parsed.classic_game_settings.other.save_path;

  if (launcherSavePath === currentGameSavePath) {
    console.log("✅ save_path already matches launcher settings");
    return false;
  }

  parsed.classic_game_settings.other.save_path = launcherSavePath;

  await writeTextFile(pd2Path, JSON.stringify(parsed, null, 2));

  console.log("📝 Updated save_path in ProjectDiablo.json");
  return true;
}
