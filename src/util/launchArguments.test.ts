// Run: node --experimental-strip-types src/util/launchArguments.test.ts
import { launchCommand, parseLaunchArguments } from "./launchArguments.ts";

function check(name: string, ok: boolean) {
  if (!ok) throw new Error(`failed: ${name}`);
}
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const throws = (text: string) => {
  try {
    parseLaunchArguments(text);
    return false;
  } catch {
    return true;
  }
};

check("missing setting uses the default", same(parseLaunchArguments(undefined), ["-w", "-3dfx"]));
check("2.4.1 default reads as the default", same(parseLaunchArguments("-plugy -3dfx"), ["-w", "-3dfx"]));
check("extra spaces", same(parseLaunchArguments("  -w   -plugy "), ["-w", "-plugy"]));
check("empty means none", same(parseLaunchArguments(""), []));
check("paths and values", same(parseLaunchArguments("-mpq=foo.mpq C:\\x/y"), ["-mpq=foo.mpq", "C:\\x/y"]));
for (const bad of ["-w & calc", "-w|x", "-w>out", "$(id)", "-w;rm", '"-w"', "%PATH%", "`id`", "a^b"])
  check(`rejects ${bad}`, throws(bad));

check("default launches Game.exe", same(launchCommand(undefined, undefined), { exe: "Game.exe", args: ["-w", "-3dfx"] }));
check("Game.exe drops -plugy", same(launchCommand("-plugy -w", false), { exe: "Game.exe", args: ["-w"] }));
check("PlugY adds -plugy", same(launchCommand(undefined, true), { exe: "PlugY.exe", args: ["-plugy", "-w", "-3dfx"] }));
check("PlugY no duplicate -plugy", same(launchCommand("-w -plugy", true), { exe: "PlugY.exe", args: ["-plugy", "-w"] }));
console.log("ok");
