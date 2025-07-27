import { exists, readFile } from "@tauri-apps/plugin-fs";
import { download } from "@tauri-apps/plugin-upload";
import { Settings } from "../types/settings";

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
  settings: Settings
) {
  const gameDir = settings.preferences.gameDirectory;
  if (!gameDir) {
    console.warn("No gameDirectory is set in settings");
    return;
  }

  const manifest = await fetchSyncManifest(manifestUrl);

  for (const entry of manifest) {
    try {
      await syncSingleFile(entry, gameDir);
    } catch (err) {
      console.error(`Failed to sync ${entry.filename}`, err);
    }
  }

  console.log("✅ Sync complete.");
}
