import "./App.css";
import "@mantine/core/styles.css";

import { TitleBar } from "./components/TitleBar";

import { MantineProvider } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import SettingsModal from "./components/SettingsModal";
import Play from "./components/Play";
import { useAutoUpdater } from "./hooks/useAutoUpdater";
import { useEffect } from "react";

function App() {
  const { status, updateInfo, installUpdate } = useAutoUpdater();
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (status === "available" && updateInfo) {
      // Automatically download + install the update
      installUpdate();
    }
  }, [status, updateInfo, installUpdate]);

  useEffect(() => {
    if (import.meta.env.PROD) {
      const disableContextMenu = (e: MouseEvent) => e.preventDefault();
      window.addEventListener("contextmenu", disableContextMenu);
      return () =>
        window.removeEventListener("contextmenu", disableContextMenu);
    }
  }, []);

  return (
    <MantineProvider>
      <SettingsModal opened={opened} close={close} />

      <div className="relative w-screen h-screen flex flex-col text-black">
        <div className="absolute inset-0 overflow-hidden z-0">
          {/* Zoomed + Animated Background */}
          <div
            className="w-full h-full bg-cover animate-pulse-slow"
            style={{
              backgroundImage: "url('/background.jpg')",
              backgroundPosition: "top right",
              backgroundSize: "auto 142%",
            }}
          />

          {/* Vignette Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.5) 100%)",
              mixBlendMode: "multiply",
            }}
          />
        </div>

        {/* <div className="absolute inset-0 bg-black/10 z-10" /> */}
        <div className="relative z-20 flex flex-col w-full h-full">
          <TitleBar open={open} />
          {/* Logo at the top center */}
          <div className="flex justify-center -mt-16 pointer-events-none drop-shadow-xl">
            <img
              src="/logo.gif"
              alt="App Logo"
              className="h-20 drop-shadow-lg select-none pointer-events-none"
              draggable={false}
            />
          </div>
          <div className="flex-grow" />
          <div className="flex flex-col items-end justify-end px-12 py-14">
            <div className="-mb-30 -mr-2">
              <img
                src="/reawakening-logo.png"
                alt="Reawakening Logo"
                className="w-100 h-auto drop-shadow-xl pointer-events-none select-none"
              />
            </div>
            <Play />
          </div>
        </div>
      </div>
    </MantineProvider>
  );
}

export default App;
