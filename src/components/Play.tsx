import { useState } from "react";
import { platform } from '@tauri-apps/plugin-os';
import { Command } from "@tauri-apps/plugin-shell";
import { join } from "@tauri-apps/api/path";
import { useSettings } from "../hooks/useSettings";
import { exists } from "@tauri-apps/plugin-fs";
import { hashLocalFile, syncAllFromSettings } from "../util/fileSync";
import { loadSettings } from "../util/settings";
import { Modal } from "@mantine/core";
import Button from "./Button";
import { DEV_MANIFEST, PROD_MANIFEST, PROJECT_DIABLO_DLL } from "../constants";

function Play() {
  const { settings, loaded } = useSettings();
  const [isBusy, setIsBusy] = useState(false);
  const [label, setLabel] = useState("Play");

  // State to control error modal visibility & message
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function openExecutable() {
    const manifestUrl = import.meta.env.DEV ? DEV_MANIFEST : PROD_MANIFEST;
    if (!loaded || !settings) {
      console.warn("Settings not loaded yet — skipping launch");
      return;
    }

    setIsBusy(true);
    setLabel("Verifying files...");

    try {
      const currentPlatform = platform();
      const loadedSettings = await loadSettings();
      const gameDir = loadedSettings.preferences.gameDirectory;
      const linuxSettings = loadedSettings.linux;
      console.log("Using gameDirectory:", gameDir);
      console.log("currentPlatform:", currentPlatform);

      // TEMP: S11 Check
      const projectDiabloDllPath = currentPlatform !== "windows" ?
        `${gameDir}/${PROJECT_DIABLO_DLL}` : 
        `${gameDir}\\${PROJECT_DIABLO_DLL}`;
      const s11isInstalled =
        !(await exists(projectDiabloDllPath)) ||
        (await hashLocalFile(projectDiabloDllPath)) ===
          "2FBFED3A248C4F9F917F09E2135CDEB7515F0ABE5523955C08426C84693407D7".toLowerCase();

      if (s11isInstalled)
        throw new Error(
          "Invalid Season 11 patch has been detected.\nPlease check the pinned messages in Discord and download/install S11 Patch 5-2."
        );
      // if (!loadedSettings.preferences.disableAutomaticUpdates)
      await syncAllFromSettings(manifestUrl, loadedSettings);
      setLabel("Launching...");
      if (!gameDir) throw new Error("Game directory not set");

      const exePath = await join(gameDir, "PlugY.exe");
      const existsAtPath = await exists(exePath);

      console.log("Does PlugY.exe exist at path?", exePath, existsAtPath);

      if (!existsAtPath) {
        // Show modal with error message instead of throwing
        setErrorMessage(
          `PlugY.exe was not found at the expected path:\n\n"${exePath}"\n\nPlease ensure PlugY is installed inside your ProjectD2 directory.`
        );

        setErrorModalOpen(true);
        return; // exit early to not try to launch
      }

      // Check for a Wine binary if there's a Winerunner directory selected
      if(currentPlatform === "linux" && linuxSettings.wineRunner) {
        const winePath = await join(linuxSettings.wineRunner, "wine")
        const wineExists = await exists(winePath);

        console.log("Wine binary exist at path?", winePath, wineExists);

        if (!wineExists) {
          setErrorMessage(
            `Wine was not found in the selected path for a Winerunner:\n\n"${winePath}"`
          );

          setErrorModalOpen(true);
          return;
        }
      }

      // Wine launch string
      const wineCommand = () => {
        return "cd '"+gameDir+"' &&"
        +(linuxSettings.winePrefix ? ' WINEPREFIX=\''+linuxSettings.winePrefix+'\'' : '')
        +(linuxSettings.commandPrefix ? ' '+linuxSettings.commandPrefix : '')
        +(linuxSettings.wineRunner ? ' \''+linuxSettings.wineRunner+'/wine\'' : ' wine')+" './PlugY.exe'";
      }
      console.log(wineCommand());

      // Run bash command if your current platform is not Windows
      const command = currentPlatform !== "windows" ? 
        Command.create("bash", ["-c", wineCommand()], { cwd: gameDir }) :
        Command.create("cmd", ["/C", exePath], { cwd: gameDir });

      console.log("Launching PlugY.exe from", gameDir);
      await command.spawn();
      console.log("Successfully launched PlugY.exe");
    } catch (error) {
      console.error("Failed to launch PlugY.exe:", error);
      setErrorMessage(
        `An error occurred while launching:\n\n${
          error instanceof Error ? error.message : String(error)
        }`
      );
      setErrorModalOpen(true);
    } finally {
      setIsBusy(false);
      setLabel("Play");
    }
  }

  return (
    <>
      <button
        onClick={openExecutable}
        disabled={isBusy}
        className={`group relative w-60 px-5 py-4 rounded-sm shadow transition-all duration-200 ease-in-out
          ${
            isBusy
              ? "bg-black/50 text-gray-400 cursor-not-allowed"
              : "bg-black/30 hover:bg-white/20 text-white hover:text-black/60 active:bg-black/60 active:text-white cursor-pointer"
          }
        `}
      >
        <span
          className={`absolute inset-0 rounded-sm border transition-all duration-200 ease-in-out pointer-events-none 
            ${
              isBusy
                ? "border-gray-100/10"
                : "border-gray-100/20 group-hover:inset-[4px]"
            }
          `}
        ></span>
        <p className="relative z-10 text-2xl font-semibold">{label}</p>
      </button>

      {/* Error Modal */}
      <Modal
        opened={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        transitionProps={{ transition: "fade" }}
        withCloseButton={false}
        styles={{
          content: {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(75px)",
            WebkitBackdropFilter: "blur(75px)",
            border: "none",
            padding: 0,
          },
        }}
        centered
        size="lg"
      >
        <div className="flex flex-col justify-between p-4">
          <p className="text-white/80 text-lg whitespace-pre-wrap select-none">
            {errorMessage}
          </p>

          <div className="flex justify-end mt-4">
            <Button
              size="md"
              onClick={() => setErrorModalOpen(false)}
              color="gray"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Play;
