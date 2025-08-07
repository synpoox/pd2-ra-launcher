import { Group } from "@mantine/core";
import { openPath } from "@tauri-apps/plugin-opener";
import { open } from "@tauri-apps/plugin-dialog";
import { useSettings } from "../hooks/useSettings"; // Adjust path as needed
import Button from "./Button";
import { join } from "@tauri-apps/api/path";
import { syncSavePathToGameSettings } from "../util/syncSavePath";
import { useEffect } from "react";
import { LauncherSettings } from "../types/settings";
import { loadSavePathFromGameSettings } from "../util/loadSavePathFromGameSettings";

function PreferencesTab() {
  const { settings, setSettings } = useSettings();

  useEffect(() => {
    const trySyncSavePath = async () => {
      const { gameDirectory, saveDirectory } = settings.preferences;

      if (!gameDirectory) return;
      const pd2JsonPath = await join(gameDirectory, "ProjectDiablo.json");

      if (!saveDirectory.trim()) {
        const loaded = await loadSavePathFromGameSettings(pd2JsonPath);
        if (loaded) {
          setSettings((prev) => ({
            ...prev,
            preferences: {
              ...prev.preferences,
              saveDirectory: loaded,
            },
          }));
          return; // Don't sync yet; wait for next render
        }
      }

      if (!saveDirectory) return;
      const updated = await syncSavePathToGameSettings(settings, pd2JsonPath);
      if (updated) {
        console.log("✅ save_path synced after saveDirectory change");
      }
    };

    trySyncSavePath();
  }, [settings.preferences.saveDirectory, settings.preferences.gameDirectory]);

  const gameDir = settings.preferences.gameDirectory;
  const saveDir = settings.preferences.saveDirectory;

  const handleOpenDirectory = async (dir: string) => {
    if (dir) {
      await openPath(dir);
    }
  };

  const handleChangeDirectory = async (
    key: keyof LauncherSettings["preferences"]
  ) => {
    const selected = await open({
      directory: true,
      multiple: false,
    });

    if (typeof selected === "string") {
      setSettings((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [key]: selected,
        },
      }));
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <p className="text-white/80 font-semibold text-xl">
          Project Diablo II Installation Directory
        </p>
        <input
          type="text"
          value={gameDir}
          readOnly
          className="w-200 px-3 py-2 bg-black/40 text-white/60 rounded border border-2 border-black/20 text-sm focus:outline-none cursor-default"
        />

        <Group gap="sm">
          <Button
            disabled={settings.preferences.gameDirectory === ""}
            onClick={() => handleOpenDirectory(gameDir)}
          >
            Open directory
          </Button>
          <Button
            color="white"
            onClick={() => handleChangeDirectory("gameDirectory")}
          >
            Change directory
          </Button>
        </Group>

        <p className="text-white/80">
          Please select the folder containing your Project Diablo II
          installation.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-white/80 font-semibold text-xl">
          Save Folder Directory
        </p>
        <input
          type="text"
          value={saveDir}
          readOnly
          className="w-200 px-3 py-2 bg-black/40 text-white/60 rounded border border-2 border-black/20 text-sm focus:outline-none cursor-default"
        />

        <Group gap="sm">
          <Button
            disabled={
              settings.preferences.gameDirectory === "" ||
              settings.preferences.saveDirectory === ""
            }
            onClick={() => handleOpenDirectory(saveDir)}
          >
            Open directory
          </Button>
          <Button
            disabled={settings.preferences.gameDirectory === ""}
            color="white"
            onClick={() => handleChangeDirectory("saveDirectory")}
          >
            Change directory
          </Button>
        </Group>
        {settings.preferences.gameDirectory === "" ? (
          <p className="text-white/80">
            Please select your Project Diablo II installation directory before
            setting your Save Folder directory.
          </p>
        ) : (
          <p className="text-white/80">
            Please select the folder containing your character and stash save
            files.
          </p>
        )}
         <div className="pt-4">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="disable-updates"
              checked={settings.preferences.disableAutomaticUpdates}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  preferences: {
                    ...prev.preferences,
                    disableAutomaticUpdates: e.target.checked,
                  },
                }))
              }
              className="scale-125"
            />
            <label
              htmlFor="disable-updates"
              className="font-semibold text-white/80 text-xl"
            >
              Disable Automatic Updates
            </label>
          </div>
          <p className="text-white/80 pt-2">
            Checking this option will prevent your game from updating when clicking the Play button.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PreferencesTab;
