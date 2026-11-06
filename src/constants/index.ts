export const MANIFEST_URL =
  "https://github.com/synpoox/pd2-reawakening/releases/latest/download/manifest.json";
export const LAUNCHER_PROD_ENDPOINT =
  "https://github.com/synpoox/pd2-ra-launcher/releases/latest/download/latest.json";
export const LAUNCHER_DEV_ENDPOINT = "http://localhost:8080/latest.json";

// PlugY.exe passes these to the game. -3dfx renders through PD2's D2GL (settings in d2gl.json).
// Without -plugy, S14's ProjectDiablo.dll hooks the stats page PlugY patches, and PlugY
// stops with "DWORD ... wanted but ... found".
export const GAME_ARGS = ["-3dfx", "-plugy"];
