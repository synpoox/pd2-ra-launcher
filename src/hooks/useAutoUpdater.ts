import { useEffect, useState, useCallback } from "react";
import { check, Update } from "@tauri-apps/plugin-updater";

type UpdateStatus =
  | "idle"
  | "checking"
  | "available"
  | "downloading"
  | "installing"
  | "error"
  | "no-update"
  | "finished";

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
      const update = await check(); // throws if no update
      setUpdateInfo(update);
      setStatus("available");
    } catch (err: any) {
      if (err?.type === "NoUpdate") {
        setStatus("no-update");
      } else {
        console.error("Update check failed:", err);
        setError("Failed to check for updates");
        setStatus("error");
      }
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

      await updateInfo.install(); // restarts app
      setStatus("finished");
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
