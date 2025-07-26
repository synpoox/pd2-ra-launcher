import "./App.css";
import "@mantine/core/styles.css";

import { TitleBar } from "./components/TitleBar";

import { MantineProvider } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import SettingsModal from "./components/SettingsModal";

function App() {
  const [opened, { open, close }] = useDisclosure(false);

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
            <button className="group relative w-60 px-5 py-4 rounded-sm shadow bg-black/20 active:bg-black/60 cursor-pointer transition-all duration-200 ease-in-out hover:bg-white/20">
              {/* Simulated border using a pseudo-element */}
              <span className="absolute inset-0 rounded-sm border border-gray-100/20 transition-all duration-200 ease-in-out group-hover:inset-[4px] pointer-events-none"></span>

              <p className="relative z-10 text-2xl font-semibold text-white">
                Play
              </p>
            </button>
          </div>
        </div>
      </div>
    </MantineProvider>
  );
}

export default App;
