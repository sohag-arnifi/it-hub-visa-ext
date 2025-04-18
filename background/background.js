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

chrome.webRequest.onHeadersReceived.addListener(
  ({ statusCode = 0, url = "", responseHeaders = [], method = "", tabId }) => {
    console.log(statusCode, url);

    const redirectStatusCodes = [301, 302, 303, 307];
    if (redirectStatusCodes.includes(statusCode)) {
      const data = {
        url,
        statusCode,
        redirectUrl: responseHeaders.find(({ name }) => name === "location")
          ?.value,
      };

      chrome.tabs.sendMessage(tabId, { type: "REDIRECT", data }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn(
            "No listener in content script:",
            chrome.runtime.lastError.message
          );
        }
      });
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);
