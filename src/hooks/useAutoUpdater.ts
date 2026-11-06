import { useEffect, useState, useCallback } from "react";
import { check, Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

type UpdateStatus =
  | "idle"
  | "checking"
  | "available"
  | "downloading"
  | "installing"
  | "error"
  | "no-update"
  | "finished";

export type AutoUpdater = ReturnType<typeof useAutoUpdater>;

// Call once (in App): every call checks on mount and keeps its own state.
export function useAutoUpdater() {
  const [status, setStatus] = useState<UpdateStatus>("idle");
  const [updateInfo, setUpdateInfo] = useState<Update | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadedBytes, setDownloadedBytes] = useState<number>(0);
  const [totalBytes, setTotalBytes] = useState<number | null>(null);

  const checkForUpdate = useCallback(async () => {
    setStatus("checking");
    setError(null);
    setDownloadedBytes(0);
    setTotalBytes(null);

    try {
      const update = await check(); // null when already up to date
      setUpdateInfo(update);
      setStatus(update ? "available" : "no-update");
    } catch (err) {
      console.error("Update check failed:", err);
      setError("Failed to check for updates");
      setStatus("error");
    }
  }, []);

  const installUpdate = useCallback(async () => {
    if (!updateInfo) return;

    setStatus("downloading");

    try {
      await updateInfo.download((event) => {
        switch (event.event) {
          case "Started":
            if (event.data.contentLength != null) {
              setTotalBytes(event.data.contentLength);
            }
            break;
          case "Progress":
            setDownloadedBytes((prev) => prev + event.data.chunkLength);
            break;
          case "Finished":
            setStatus("installing");
            break;
        }
      });

      await updateInfo.install();
      setStatus("finished");
      await relaunch(); // Windows exits into the installer; Linux needs the restart
    } catch (err) {
      console.error("Update install failed:", err);
      setError("Failed to install update");
      setStatus("error");
    }
  }, [updateInfo]);

  useEffect(() => {
    checkForUpdate();
  }, [checkForUpdate]);

  const progress = totalBytes
    ? Math.min(100, Math.floor((downloadedBytes / totalBytes) * 100))
    : null;

  return {
    status,
    updateInfo,
    error,
    checkForUpdate,
    installUpdate,
    downloadedBytes,
    totalBytes,
    progress,
  };
}
