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
            className="w-full h-full bg-cover bg-center bg-no-repeat animate-pulse-slow"
            style={{
              backgroundImage: "url('/background.jpg')",
            }}
          />

          {/* Vignette Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.5) 100%)",
              mixBlendMode: "multiply",
            }}
          />
        </div>

        <div className="absolute inset-0 bg-black/10 z-10" />
        <div className="relative z-20 flex flex-col w-full h-full">
          <TitleBar open={open} />
          <div className="flex-grow" />
          <div className="flex justify-end items-end px-12 py-14">
            <Play />
          </div>
        </div>
      </div>
    </MantineProvider>
  );
}

export default App;
