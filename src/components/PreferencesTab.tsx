import { Group } from "@mantine/core";
import { openPath } from "@tauri-apps/plugin-opener";
import { open } from "@tauri-apps/plugin-dialog";
import { useSettings } from "../hooks/useSettings"; // Adjust path as needed
import Button from "./Button";

function PreferencesTab() {
  const { settings, setSettings } = useSettings();

  const gameDir = settings.preferences.gameDirectory;
  const saveDir = settings.preferences.saveDirectory;

  const handleOpenDirectory = async (dir: string) => {
    if (dir) {
      await openPath(dir);
    }
  };

  const handleChangePd2Directory = async () => {
    const selected = await open({
      directory: true,
      multiple: false,
    });

    if (typeof selected === "string") {
      setSettings((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          gameDirectory: selected,
        },
      }));
    }
  };

  const handleChangeSaveDirectory = async () => {
    const selected = await open({
      directory: true,
      multiple: false,
    });

    if (typeof selected === "string") {
      setSettings((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          saveDirectory: selected,
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
          <Button color="white" onClick={handleChangePd2Directory}>
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
            onClick={handleChangeSaveDirectory}
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
      </div>
    </div>
  );
}

export default PreferencesTab;
