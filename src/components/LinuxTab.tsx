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
      const { launchShortcut } = settings.linux;

      if (!launchShortcut) return;
    };

    trySyncSavePath();
  }, [settings.linux.launchShortcut]);

  const desktopShortcut = settings.linux.launchShortcut;

  const handleDesktopFile = async (
    key: keyof LauncherSettings["linux"]
  ) => {
    const selected = await open({
      directory: false,
      multiple: false,
      filters: [
        {
          name: "Desktop Files",
          extensions: ["desktop"]
        }
      ],
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

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <p className="text-white/80 font-semibold text-xl">
          Linux Desktop Shortcut
        </p>
        <p className="font-semibold text-amber-300">
          You can ignore these settings if you are on Windows
        </p>
        <input
          type="text"
          value={desktopShortcut}
          readOnly
          className="w-200 px-3 py-2 bg-black/40 text-white/60 rounded border-2 border-black/20 text-sm focus:outline-none cursor-default"
        />

        <Group gap="sm">
          <Button
            onClick={() => handleDesktopFile("launchShortcut")}
          >
            Select Shortcut File
          </Button>
        </Group>

        <p className="text-white/80">
          Select the .desktop file you want to use for Project Diablo II/PlugY.
          <p className="mt-4">Common locations for .desktop files:</p>
          <p className="font-bold">
            $HOME/.local/share/applications
          </p>
        </p>
      </div>
    </div>
  );
}

export default LinuxTab;