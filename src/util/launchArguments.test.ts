// Run: node --experimental-strip-types src/util/launchArguments.test.ts
import { parseLaunchArguments } from "./launchArguments.ts";

function check(name: string, ok: boolean) {
  if (!ok) throw new Error(`failed: ${name}`);
}
const same = (a: string[], b: string[]) => JSON.stringify(a) === JSON.stringify(b);
const throws = (text: string) => {
  try {
    parseLaunchArguments(text);
    return false;
  } catch {
    return true;
  }
};

check("missing setting uses the default", same(parseLaunchArguments(undefined), ["-plugy", "-3dfx"]));
check("extra spaces", same(parseLaunchArguments("  -w   -plugy "), ["-w", "-plugy"]));
check("empty means none", same(parseLaunchArguments(""), []));
check("paths and values", same(parseLaunchArguments("-mpq=foo.mpq C:\\x/y"), ["-mpq=foo.mpq", "C:\\x/y"]));
for (const bad of ["-w & calc", "-w|x", "-w>out", "$(id)", "-w;rm", '"-w"', "%PATH%", "`id`", "a^b"])
  check(`rejects ${bad}`, throws(bad));
console.log("ok");
