import { useAutoUpdater } from "../hooks/useAutoUpdater";
import { getVersion } from "@tauri-apps/api/app";
import { openPath } from "@tauri-apps/plugin-opener";
import { useEffect, useState } from "react";
import { getConfigDir } from "../util/settings";
import Button from "./Button";
import { Stack } from "@mantine/core";
import {
  IconBrandDiscordFilled,
  IconBrandGithubFilled,
  IconBrandPatreonFilled,
  IconBrandTwitch,
} from "@tabler/icons-react";

const iconClass =
  "w-10 h-10 flex items-center justify-center rounded transition-all duration-200 ease-in-out hover:bg-gray-300/30 hover:scale-115 cursor-pointer";

function AboutTab() {
  const [appVer, setAppVer] = useState("");
  const [configDir, setConfigDir] = useState("");
  const { status, checkForUpdate, installUpdate } = useAutoUpdater();

  useEffect(() => {
    (async () => {
      const version = await getVersion();
      const path = await getConfigDir();
      setAppVer(version);
      setConfigDir(path);
    })();
  }, []);

  // This function will check, and if update available, download & install it automatically
  const handleUpdateClick = async () => {
    await checkForUpdate();

    if (status === "available" && installUpdate) {
      await installUpdate();
    }
  };

  // We want to react to status changes too because checkForUpdate is async
  // and we need to wait until status changes to "available"
  // But for simplicity, we can also do it inside the hook or debounce here.

  // Instead, let's do a small effect that triggers installUpdate when available:
  useEffect(() => {
    if (status === "available") {
      installUpdate();
    }
  }, [status, installUpdate]);

  return (
    <div className="flex flex-col gap-68">
      <div>
        <p className="text-white/80 font-semibold text-xl mb-4">
          Launcher Version: {appVer}
        </p>

        <Stack align="flex-start" mb={8}>
          <Button onClick={() => openPath(configDir)}>
            Open settings directory
          </Button>

          <Button
            onClick={handleUpdateClick}
            disabled={
              status === "checking" ||
              status === "downloading" ||
              status === "installing"
            }
          >
            Check for updates
          </Button>
        </Stack>
      </div>

      <div>
        <p className="text-white/80 font-semibold text-lg cursor-default mb-2">
          Made by @Synpoo
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => openPath("https://discord.gg/rBCNMWaCNt")}
            className={iconClass}
          >
            <IconBrandDiscordFilled color="white" size={32} />
          </button>
          <button
            onClick={() => openPath("https://twitch.tv/synpoo")}
            className={iconClass}
          >
            <IconBrandTwitch color="white" size={32} />
          </button>
          <button
            onClick={() => openPath("https://patreon.com/synpoo")}
            className={iconClass}
          >
            <IconBrandPatreonFilled color="white" size={32} />
          </button>
          <button
            onClick={() =>
              openPath("https://github.com/synpoox/pd2-ra-launcher")
            }
            className={iconClass}
          >
            <IconBrandGithubFilled color="white" size={32} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutTab;
