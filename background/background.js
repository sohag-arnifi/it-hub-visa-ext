__webpack_public_path__ = chrome.runtime.getURL("dist/"); // or relative path as needed

console.log("Background script loaded");

// chrome.runtime.onInstalled.addListener(() => {
//   console.log("Hot Reload Extension Installed");
// });

// chrome.commands.onCommand.addListener((command) => {
//   if (command === "reload_extension") {
//     chrome.runtime.reload();
//     console.log("Extension reloaded");
//   }
// });

// chrome.webRequest.onHeadersReceived.addListener(
//   (details) => {
//     const locationHeader = details.responseHeaders?.find(
//       (header) => header.name.toLowerCase() === "location"
//     );
//     if (locationHeader) {
//       console.log("Redirect URL:", locationHeader.value);
//       // Handle the redirect URL as needed
//     }
//   },
//   { urls: ["<all_urls>"] }, // Monitor all URLs or restrict to specific domains
//   ["responseHeaders"]
// );

// const button = document.getElementById("emergencyNoticeCloseBtn");
// console.log(button);
