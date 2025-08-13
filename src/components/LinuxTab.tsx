import { Group } from "@mantine/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useSettings } from "../hooks/useSettings"; // Adjust path as needed
import Button from "./Button";
import { useEffect, useState } from "react";
import { LauncherSettings } from "../types/settings";

function LinuxTab() {
  const { settings, setSettings } = useSettings();
  const [cmdPrefix, setCmdPrefix] = useState("");

  useEffect(() => {
    const trySyncSavePath = async () => {
      const { winePrefix, wineRunner, commandPrefix } = settings.linux;

      setCmdPrefix(settings.linux.commandPrefix || "");

      if (!winePrefix || !wineRunner || !commandPrefix) return;
    };

    trySyncSavePath();
  }, [settings.linux.winePrefix, settings.linux.wineRunner, settings.linux.commandPrefix]);

  const gameDir = settings.preferences.gameDirectory;
  const linuxSettings = settings.linux;

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

  const handleCommandPrefix = async (
    key: keyof LauncherSettings["linux"]
  ) => {
    setSettings((prev) => ({
        ...prev,
        linux: {
          ...prev.linux,
          [key]: cmdPrefix,
        },
      }));
  };

  const handleClearFormField = async (
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
          value={linuxSettings.winePrefix}
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
            onClick={() => handleClearFormField("winePrefix")}
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
          value={linuxSettings.wineRunner}
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
            onClick={() => handleClearFormField("wineRunner")}
          >
            Clear
          </Button>
        </Group>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-white/80 font-semibold text-xl">
          Command Prefix <i>(Optional)</i>
        </p>
        <input
          type="text"
          value={cmdPrefix}
          onChange={(e) => setCmdPrefix(e.target.value)}
          className="w-200 px-3 py-2 bg-black/40 text-white/60 rounded border-2 border-black/20 text-sm focus:outline-none"
        />

        <Group gap="sm">
          <Button
            disabled={settings.preferences.gameDirectory === ""}
            color="white"
            onClick={() => handleCommandPrefix("commandPrefix")}
          >
            Save
          </Button>
          <Button
            color="white"
            onClick={() => handleClearFormField("commandPrefix")}
          >
            Clear
          </Button>
        </Group>
      </div>
    </div>
  );
}

export default LinuxTab;