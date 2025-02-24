__webpack_public_path__ = chrome.runtime.getURL("dist/");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openIncognitoWindow") {
    chrome.windows.create(
      {
        url: request.url,
        width: 350,
        height: 700,
      },
      (newWindow) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error opening incognito window:",
            chrome.runtime.lastError
          );
          sendResponse({ success: false });
        } else {
          console.log("Incognito window opened successfully:", newWindow);
          sendResponse({ success: true });
        }
      }
    );
    return true; // Required to use sendResponse asynchronously
  }
});

chrome.webNavigation.onErrorOccurred.addListener((details) => {
  if (details.frameId === 0 && [500, 502, 503, 504].includes(details.error)) {
    console.log(`Server error detected (${details.error}). Reloading tab...`);

    // Reload the tab after a delay (e.g., 5 seconds)
    setTimeout(() => {
      chrome.tabs.reload(details.tabId);
    }, 1000); // 1000ms = 1 seconds
  }
});
