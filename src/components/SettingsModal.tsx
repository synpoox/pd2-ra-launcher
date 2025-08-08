import { Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import {
  IconSettingsFilled,
  IconDeviceGamepad2,
  IconBrandPowershell,
  IconX,
  IconInfoCircleFilled,
} from "@tabler/icons-react";
import { ensureSettingsFile } from "../util/settings";
import { useSettings } from "../hooks/useSettings";
import AboutTab from "./AboutTab";
import PreferencesTab from "./PreferencesTab";
import Button from "./Button";
import GameTab from "./GameTab";
import LinuxTab from "./LinuxTab";

type SettingsModalType = {
  opened: boolean;
  close: () => void;
};

const iconClass =
  "w-10 h-10 flex items-center justify-center rounded transition-all duration-200 ease-in-out hover:bg-gray-300/30 hover:scale-115 cursor-pointer";

const tabs = [
  { label: "Preferences", icon: IconSettingsFilled },
  { label: "Game", icon: IconDeviceGamepad2 },
  { label: "Linux", icon: IconBrandPowershell },
  { label: "About", icon: IconInfoCircleFilled },
];

function SettingsModal({ opened, close }: SettingsModalType) {
  const [activeTab, setActiveTab] = useState("Preferences");
  const { settings } = useSettings();

  useEffect(() => {
    ensureSettingsFile();
  }, []);

  return (
    <Modal
      opened={opened}
      onClose={close}
      fullScreen
      withCloseButton={false}
      overlayProps={{
        backgroundOpacity: 0, // no Mantine overlay – we want the modal itself to be transparent
        blur: 0,
      }}
      transitionProps={{ transition: "fade" }}
      styles={{
        content: {
          backgroundColor: "rgba(0, 0, 0, 0.5)", // 50% black background
          backdropFilter: "blur(75px)", // Frosted glass effect
          WebkitBackdropFilter: "blur(75px)", // Safari support
          border: "none",
          padding: 0,
          height: "100vh",
          width: "100vw",
        },
        body: {
          padding: 0,
          height: "100%",
        },
      }}
    >
      <div className="flex h-full w-full">
        {/* Sidebar */}
        <div className="relative w-66 p-6 flex flex-col gap-2 ">
          {/* Border fade */}
          <div
            className="absolute top-0 right-0 w-px h-full bg-white/30 pointer-events-none"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, white 20%, white 80%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, white 20%, white 80%, transparent 100%)",
            }}
          />

          {tabs.map(({ label, icon: Icon }) => (
            <Button
              variant="sidebar"
              icon={<Icon size={20} className="relative z-10 text-white" />}
              active={activeTab === label}
              onClick={() => setActiveTab(label)}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative select-none">
          {/* Top bar */}
          <div className="relative flex justify-between items-center px-6 py-8">
            {/* Border fade */}
            <div
              className="absolute bottom-0 left-0 w-full h-px bg-white/30 pointer-events-none"
              style={{
                maskImage:
                  "linear-gradient(to right, white 0%, white 80%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, white 0%, white 80%, transparent 100%)",
              }}
            />

            <h2 className="text-2xl font-semibold text-yellow-100">
              {activeTab}
            </h2>
            <button
              onClick={() => {
                close();
                setActiveTab("Preferences");
              }}
              className={iconClass}
            >
              <IconX color="white" size={24} />
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {activeTab === "Preferences" && settings && <PreferencesTab />}
            {activeTab === "Linux" && settings && <LinuxTab />}
            {activeTab === "Game" && settings && <GameTab />}
            {activeTab === "About" && settings && <AboutTab />}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default SettingsModal;
