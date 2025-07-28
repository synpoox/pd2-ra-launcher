// src/util/loadSavePathFromGameSettings.ts
import { exists, readTextFile } from "@tauri-apps/plugin-fs";
import { ProjectDiabloSettings } from "../types/settings";

/**
 * Loads save_path from ProjectDiablo.json if it exists.
 * @param pd2JsonPath Path to ProjectDiablo.json
 * @returns The save_path string, or null if not found
 */
export async function loadSavePathFromGameSettings(
  pd2JsonPath: string
): Promise<string | null> {
  if (!(await exists(pd2JsonPath))) {
    console.warn("ProjectDiablo.json does not exist:", pd2JsonPath);
    return null;
  }

  try {
    const raw = await readTextFile(pd2JsonPath);
    const parsed: ProjectDiabloSettings = JSON.parse(raw);
    const savePath = parsed?.classic_game_settings?.other?.save_path?.trim();

    if (savePath) {
      console.log("✅ Found save_path in ProjectDiablo.json:", savePath);
      return savePath;
    }
  } catch (err) {
    console.error("Failed to read or parse ProjectDiablo.json:", err);
  }

  return null;
}
