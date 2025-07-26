export type Settings = {
  preferences: {
    gameDirectory: string;
    saveDirectory: string;
    plugyPath: string;
  };
  game: {
    densityMultiplier: number;
  };
  about: {
    launcherDirectory: string;
  };
};