import { exists, readFile } from "@tauri-apps/plugin-fs";
import { download } from "@tauri-apps/plugin-upload";
import { LauncherSettings } from "../types/settings";

export type SyncEntry = {
  filename: string;
  url: string;
  hash: string;
};

export type SyncManifest = SyncEntry[];

// Hash a file from disk
export async function hashLocalFile(path: string): Promise<string> {
  const file = await readFile(path);
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new Uint8Array(file)
  );
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Fetch manifest JSON
export async function fetchSyncManifest(
  manifestUrl: string
): Promise<SyncManifest> {
  const res = await fetch(manifestUrl);
  if (!res.ok) throw new Error("Failed to fetch sync manifest");
  return res.json();
}

// Sync a single file to gameDirectory
export async function syncSingleFile(
  entry: SyncEntry,
  gameDir: string
): Promise<boolean> {
  const localPath = `${gameDir}\\${entry.filename}`; // Windows safe

  const needsUpdate =
    !(await exists(localPath)) ||
    (await hashLocalFile(localPath)) !== entry.hash.toLowerCase();

  if (!needsUpdate) {
    console.log(`[sync] ✅ ${entry.filename} is up to date`);
    return false;
  }

  console.log(`[sync] ⬇️ Downloading ${entry.filename}...`);
  await download(entry.url, localPath);
  console.log(`[sync] ✅ Updated: ${entry.filename}`);
  return true;
}

export async function syncAllFromSettings(
  manifestUrl: string,
  settings: LauncherSettings
) {
  const gameDir = settings.preferences.gameDirectory;
  const density = settings.game.densityMultiplier;
  if (!gameDir) {
    console.warn("No gameDirectory is set in settings");
    return;
  }

  const manifest = await fetchSyncManifest(manifestUrl);

  // Try to find the specific density mpq
  const densityEntry = manifest.find(
    (entry) => entry.filename === `pd2data-${density}x-density.mpq`
  );

  if (densityEntry) {
    console.log(
      `[sync] 📦 Found density-matched file: pd2data-${density}x-density.mpq -> syncing as pd2data.mpq`
    );
    await syncSingleFile({ ...densityEntry, filename: "pd2data.mpq" }, gameDir);
  } else {
    // Fallback to default
    const fallbackEntry = manifest.find(
      (entry) => entry.filename === "pd2data.mpq"
    );

    if (fallbackEntry) {
      console.warn(
        `[sync] ⚠️ No density match for ${density}x — falling back to default pd2data.mpq`
      );
      await syncSingleFile(fallbackEntry, gameDir);
    } else {
      console.error(
        `[sync] ❌ No fallback pd2data.mpq found in manifest — nothing synced.`
      );
    }
  }

  // Sync the rest of the files except any pd2data-* entries (already handled above)
  for (const entry of manifest) {
    if (entry.filename.startsWith("pd2data")) continue;

    try {
      await syncSingleFile(entry, gameDir);
    } catch (err) {
      console.error(`Failed to sync ${entry.filename}`, err);
    }
  }

  console.log("✅ Sync complete.");
}
