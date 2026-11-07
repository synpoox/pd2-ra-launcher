// -w: windowed. -3dfx: render through PD2's D2GL (d2gl.json).
export const DEFAULT_LAUNCH_ARGUMENTS = "-w -3dfx";
// Saved by 2.4.1, when Play always went through PlugY; read as the current default.
const LEGACY_DEFAULT_LAUNCH_ARGUMENTS = "-plugy -3dfx";
// Without it, S14's ProjectDiablo.dll hooks the stats page PlugY patches, and PlugY
// stops with "DWORD ... wanted but ... found". Added only when launching through PlugY.
const PLUGY_ARGUMENT = "-plugy";

// The arguments pass through cmd /C (Wine: bash -c), so shell characters would run commands.
// shortcut: no quoting, so an argument can't contain a space; add quoting if one ever needs it.
const SAFE_ARGUMENT = /^[\w\-.,:=\/\\+]+$/;

/** The Launch Arguments setting as shown and used: missing or the 2.4.1 default means the default. */
export function launchArgumentsSetting(text: string | undefined): string {
  return text === undefined || text.trim() === LEGACY_DEFAULT_LAUNCH_ARGUMENTS
    ? DEFAULT_LAUNCH_ARGUMENTS
    : text;
}

/** Splits the Launch Arguments setting into arguments; throws on anything a shell would interpret. */
export function parseLaunchArguments(text: string | undefined): string[] {
  const args = launchArgumentsSetting(text).trim().split(/\s+/).filter(Boolean);
  const bad = args.filter((arg) => !SAFE_ARGUMENT.test(arg));
  if (bad.length)
    throw new Error(
      `Launch arguments can only use letters, numbers and - _ . , : = / \\ +\nNot allowed: ${bad.join(" ")}`
    );
  return args;
}

/** What Play runs, relative to the game directory. -plugy follows the PlugY setting. */
export function launchCommand(
  launchArguments: string | undefined,
  launchWithPlugY: boolean | undefined
): { exe: string; args: string[] } {
  const args = parseLaunchArguments(launchArguments).filter((a) => a.toLowerCase() !== PLUGY_ARGUMENT);
  return launchWithPlugY
    ? { exe: "PlugY.exe", args: [PLUGY_ARGUMENT, ...args] }
    : { exe: "Game.exe", args };
}
