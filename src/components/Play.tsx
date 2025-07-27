import { useState } from "react";
import { Command } from "@tauri-apps/plugin-shell";
import { join } from "@tauri-apps/api/path";
import { useSettings } from "../hooks/useSettings";
import { exists } from "@tauri-apps/plugin-fs";
import { syncAllFromSettings } from "../util/fileSync";
import { loadSettings } from "../util/settings";
import { Modal } from "@mantine/core";
import Button from "./Button";

function Play() {
  const { settings, loaded } = useSettings();
  const [isBusy, setIsBusy] = useState(false);
  const [label, setLabel] = useState("Play");

  // State to control error modal visibility & message
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function openExecutable() {
    if (!loaded || !settings) {
      console.warn("Settings not loaded yet — skipping launch");
      return;
    }

    setIsBusy(true);
    setLabel("Verifying files...");

    try {
      const loadedSettings = await loadSettings();
      console.log(
        "Using gameDirectory:",
        loadedSettings.preferences.gameDirectory
      );

      await syncAllFromSettings(
        "https://gist.githubusercontent.com/synpoox/d648baeaa93dd7a7cf926f2f0d9d7712/raw/test-manifest.json",
        loadedSettings
      );
      setLabel("Launching...");
      const gameDir = loadedSettings.preferences.gameDirectory;
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

      const command = Command.create("cmd", ["/C", exePath], { cwd: gameDir });
      console.log("Launching PlugY.exe from", gameDir);
      await command.spawn();
      console.log("Successfully launched PlugY.exe");
    } catch (error) {
      console.error("Failed to launch PlugY.exe:", error);
      setErrorMessage(
        `An error occurred while launching PlugY.exe:\n\n${
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
              ? "bg-black/40 text-gray-400 cursor-not-allowed"
              : "bg-black/20 hover:bg-white/20 text-white cursor-pointer"
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
            backgroundColor: "rgba(0, 0, 0, 0.29)", // 50% black background
            backdropFilter: "blur(75px)", // Frosted glass effect
            WebkitBackdropFilter: "blur(75px)", // Safari support
            border: "none",
            padding: 0,
          },
        }}
        centered
        size="md"
      >
        <p className="text-white/80 text-lg mb-4 whitespace-pre-wrap select-none">
          {errorMessage}
        </p>

        <Button size="md" onClick={() => setErrorModalOpen(false)} color="gray">
          Close
        </Button>
      </Modal>
    </>
  );
}

export default Play;
