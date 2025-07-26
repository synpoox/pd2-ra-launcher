import { getVersion } from "@tauri-apps/api/app";
import { openPath, openUrl } from "@tauri-apps/plugin-opener";
import { useEffect, useState } from "react";
import { getConfigDir } from "../util/settings";
import Button from "./Button";
import { Group } from "@mantine/core";

function AboutTab() {
  const [appVer, setAppVer] = useState("");
  const [configDir, setConfigDir] = useState("");

  async function getAppVersion() {
    const version = await getVersion();
    const path = await getConfigDir();
    setAppVer(version);
    setConfigDir(path);
  }

  useEffect(() => {
    getAppVersion();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <p className="text-white/80 font-semibold text-xl">
        Launcher Version: {appVer}
      </p>
      <Group>
        <Button onClick={() => openPath(configDir)}>
          Open settings directory
        </Button>
      </Group>
      <div>
        <p className="text-white/80 font-semibold text-2xl cursor-default">
          Made by @Synpoo
        </p>
        <p
          className="text-amber-200/60 font-semibold text-xl cursor-pointer pt-2"
          onClick={() =>
            openUrl("https://github.com/synpoox/pd2-reawakening-launcher")
          }
        >
          GitHub
        </p>
      </div>
    </div>
  );
}

export default AboutTab;
