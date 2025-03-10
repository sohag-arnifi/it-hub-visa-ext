import { useEffect } from "react";

const useWakeLock = () => {
  useEffect(() => {
    let wakeLock = null;

    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");
          console.log("Wake Lock is active.");
        }
      } catch (err) {
        console.error("Failed to acquire wake lock:", err);
      }
    };

    const releaseWakeLock = () => {
      if (wakeLock !== null) {
        wakeLock.release().then(() => {
          console.log("Wake Lock is released.");
          wakeLock = null;
        });
      }
    };

    requestWakeLock();

    // Release wake lock when component unmounts
    return () => {
      releaseWakeLock();
    };
  }, []);
};

export default useWakeLock;
