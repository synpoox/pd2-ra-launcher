import { Group } from "@mantine/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useSettings } from "../hooks/useSettings"; // Adjust path as needed
import Button from "./Button";
import { useEffect } from "react";
import { LauncherSettings } from "../types/settings";

function LinuxTab() {
  const { settings, setSettings } = useSettings();

  useEffect(() => {
    const trySyncSavePath = async () => {
      const { winePrefix, wineRunner } = settings.linux;

      if (!winePrefix || !wineRunner) return;
    };

    trySyncSavePath();
  }, [settings.linux.winePrefix, settings.linux.wineRunner]);

  const gameDir = settings.preferences.gameDirectory;
  const wineDir = settings.linux.winePrefix;
  const wineRun = settings.linux.wineRunner;

  const handleChangeDirectory = async (
    key: keyof LauncherSettings["linux"]
  ) => {
    const selected = await open({
      directory: true,
      multiple: false,
    });

    if (typeof selected === "string") {
      setSettings((prev) => ({
        ...prev,
        linux: {
          ...prev.linux,
          [key]: selected,
        },
      }));
    }
  };

  const handleClearDirectory = async (
    key: keyof LauncherSettings["linux"]
  ) => {
      setSettings((prev) => ({
        ...prev,
        linux: {
          ...prev.linux,
          [key]: '',
        },
      }));
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <p className="text-white/80 font-semibold text-xl">
          Project Diablo II Installation Directory <i>(Preferences)</i>
        </p>
        <input
          type="text"
          value={gameDir}
          readOnly
          className="w-200 px-3 py-2 bg-black/40 text-white/60 rounded border-2 border-black/20 text-sm focus:outline-none cursor-default"
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-white/80 font-semibold text-xl">
          Wineprefix Directory <i>(Optional)</i>
        </p>
        <input
          type="text"
          value={wineDir}
          readOnly
          className="w-200 px-3 py-2 bg-black/40 text-white/60 rounded border-2 border-black/20 text-sm focus:outline-none cursor-default"
        />

        <Group gap="sm">
          <Button
            disabled={settings.preferences.gameDirectory === ""}
            color="white"
            onClick={() => handleChangeDirectory("winePrefix")}
          >
            Change Wineprefix
          </Button>
          <Button
            color="white"
            onClick={() => handleClearDirectory("winePrefix")}
          >
            Clear
          </Button>
        </Group>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-white/80 font-semibold text-xl">
          Winerunner Directory <i>(Optional)</i>
        </p>
        <input
          type="text"
          value={wineRun}
          readOnly
          className="w-200 px-3 py-2 bg-black/40 text-white/60 rounded border-2 border-black/20 text-sm focus:outline-none cursor-default"
        />

        <Group gap="sm">
          <Button
            disabled={settings.preferences.gameDirectory === ""}
            color="white"
            onClick={() => handleChangeDirectory("wineRunner")}
          >
            Change Winerunner
          </Button>
          <Button
            color="white"
            onClick={() => handleClearDirectory("wineRunner")}
          >
            Clear
          </Button>
        </Group>
      </div>
    </div>
  );
}

export default LinuxTab;