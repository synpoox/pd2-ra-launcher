// -plugy: without it, S14's ProjectDiablo.dll hooks the stats page PlugY patches, and PlugY
// stops with "DWORD ... wanted but ... found". -3dfx: render through PD2's D2GL (d2gl.json).
export const DEFAULT_LAUNCH_ARGUMENTS = "-plugy -3dfx";

// The arguments pass through cmd /C (Wine: bash -c), so shell characters would run commands.
// shortcut: no quoting, so an argument can't contain a space; add quoting if one ever needs it.
const SAFE_ARGUMENT = /^[\w\-.,:=\/\\+]+$/;

/** Splits the Launch Arguments setting into arguments; throws on anything a shell would interpret. */
export function parseLaunchArguments(text: string | undefined): string[] {
  const args = (text ?? DEFAULT_LAUNCH_ARGUMENTS).trim().split(/\s+/).filter(Boolean);
  const bad = args.filter((arg) => !SAFE_ARGUMENT.test(arg));
  if (bad.length)
    throw new Error(
      `Launch arguments can only use letters, numbers and - _ . , : = / \\ +\nNot allowed: ${bad.join(" ")}`
    );
  return args;
}
