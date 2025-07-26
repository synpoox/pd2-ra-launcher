import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
  IconX,
  IconMinus,
  IconSettingsFilled,
  IconBrandDiscordFilled,
  IconBrandPatreonFilled,
  IconBrandWikipedia,
  IconBrandTwitch,
} from "@tabler/icons-react";
import { openPath } from "@tauri-apps/plugin-opener";

type TitleBarType = {
  open: () => void;
};

export function TitleBar({ open }: TitleBarType) {
  const [win, setWin] = useState<ReturnType<typeof getCurrentWindow> | null>(
    null
  );

  useEffect(() => {
    setWin(getCurrentWindow());
  }, []);

  const iconClass =
    "w-10 h-10 flex items-center justify-center rounded transition-all duration-200 ease-in-out hover:bg-gray-300/30 hover:scale-115 cursor-pointer";

  return (
    <div
      className="w-full h-20 flex justify-between items-center text-white select-none"
      data-tauri-drag-region
    >
      {/* Left group of buttons */}
      <div className="flex space-x-4 px-8">
        <button
          onClick={() => openPath("https://discord.gg/rBCNMWaCNt")}
          className={iconClass}
        >
          <IconBrandDiscordFilled size={24} />
        </button>
        <button
          onClick={() => openPath("https://twitch.tv/synpoo")}
          className={iconClass}
        >
          <IconBrandTwitch size={24} />
        </button>
        <button
          onClick={() => openPath("https://patreon.com/synpoo")}
          className={iconClass}
        >
          <IconBrandPatreonFilled size={24} />
        </button>
        <button
          onClick={() => openPath("https://pd2reawakening.com/wiki/index.php?title=Main_Page")}
          className={iconClass}
        >
          <IconBrandWikipedia size={24} />
        </button>
      </div>

      {/* Right group of window controls */}
      <div className="flex space-x-4 px-8">
        <button className={iconClass}>
          <IconSettingsFilled onClick={open} size={24} />
        </button>
        <button onClick={() => win?.minimize()} className={iconClass}>
          <IconMinus size={24} />
        </button>
        <button onClick={() => win?.close()} className={iconClass}>
          <IconX size={24} />
        </button>
      </div>
    </div>
  );
}
