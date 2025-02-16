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
