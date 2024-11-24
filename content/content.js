import React from "react";
import { createRoot } from "react-dom/client";
import App from "../src/App";
import { Provider } from "react-redux";
import { store } from "../src/redux/store"; //noticeModal

__webpack_public_path__ = chrome.runtime.getURL("dist/");

// document.addEventListener("DOMContentLoaded", () => {
//   const button = document.getElementById("emergencyNoticeCloseBtn");
//   const modalContainer = document.getElementById("noticeModal");
//   console.log(modalContainer);
//   if (button) {
//     button.click(); // Click the button
//     console.log("Emergency notice button clicked.");
//   } else {
//     console.warn("Button not found.");
//   }
// });

const div = document.createElement("div");
div.id = "react-root";
document.body.appendChild(div);

// const button = document.getElementById("emergencyNoticeCloseBtn");
// console.log(button);

chrome.storage.local.get((result) => {
  if (result?.logData?.success && result?.logData?.data?.token) {
    const root = createRoot(document.getElementById("react-root"));
    root.render(
      <Provider store={store}>
        <App user={result?.logData?.data?.user} />
      </Provider>
    );
  } else {
    div.style.display = "none";
  }
});
