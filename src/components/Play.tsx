import { Command } from "@tauri-apps/plugin-shell";
import { join } from "@tauri-apps/api/path";
import { useSettings } from "../hooks/useSettings";

import { exists } from "@tauri-apps/plugin-fs";

function Play() {
  const { settings } = useSettings();

  async function openExecutable() {
    const gameDir = settings?.preferences.gameDirectory;
    if (!gameDir) throw new Error("Game directory not set");

    const exePath = await join(gameDir, "PlugY.exe");

    const existsAtPath = await exists(exePath);
    console.log("Does PlugY.exe exist at path?", exePath, existsAtPath);

    try {
      if (!existsAtPath)
        throw new Error("PlugY.exe does not exist at resolved path");
      const command = Command.create(exePath, [], {
        cwd: gameDir,
      });

      console.log("Spawning PlugY.exe at:", exePath);
      console.log(
        "Allowed shell scope:",
        "E:\\Program Files (x86)\\PD2-Reawakening-S10-Patch2\\ProjectD2"
      );

      await command.spawn();

      console.log("Launched PlugY.exe from", gameDir);
    } catch (error) {
      console.error("Failed to launch PlugY.exe:", error);
    }
  }

  return (
    <button
      onClick={openExecutable}
      className="group relative w-60 px-5 py-4 rounded-sm shadow bg-black/20 active:bg-black/80 cursor-pointer transition-all duration-200 ease-in-out hover:bg-white/20"
    >
      <span className="absolute inset-0 rounded-sm border border-gray-100/20 transition-all duration-200 ease-in-out group-hover:inset-[4px] pointer-events-none"></span>
      <p className="relative z-10 text-2xl font-semibold text-white">Play</p>
    </button>
  );
}

export default Play;
