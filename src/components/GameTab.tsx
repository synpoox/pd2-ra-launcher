import { Select } from "@mantine/core";
import { useSettings } from "../hooks/useSettings";

function GameTab() {
  const { settings, setSettings } = useSettings();

  const handleDensityChange = (value: string | null) => {
    if (!value) return;
    const newDensity = parseFloat(value);
    setSettings({
      ...settings,
      game: {
        ...settings.game,
        densityMultiplier: newDensity,
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <label className="text-white/80 font-semibold text-xl">
        Density Multiplier
      </label>
      <p className="text-white/80 text-md">
        Increases the number of monsters per area. Use with caution — may lag or
        crash on lower-end machines.
      </p>
      <Select
        data={["1", "2", "3", "5", "10"]}
        value={settings.game.densityMultiplier.toString()}
        onChange={handleDensityChange}
        checkIconPosition="right"
        styles={{
          input: {
            backgroundColor: "rgba(255, 255, 255, 0.88)",
            color: "rgba(26, 26, 26, 0.85)",
            fontWeight: 500,
            borderColor: "rgba(26, 26, 26, 0.7)",
            borderRadius: 4,
            fontSize: 18,
            height: 44,
            "&:focus": {
              borderColor: "#facc15",
              boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.4)",
              outline: "none",
            },
          },
          dropdown: {
            backgroundColor: "rgba(255, 255, 255, 0.88)",
            color: "rgba(26, 26, 26, 0.85)",
            fontWeight: 500,
          },
          option: {
            fontSize: 18,
            margin: 0,
          },
        }}
      />
    </div>
  );
}

export default GameTab;
