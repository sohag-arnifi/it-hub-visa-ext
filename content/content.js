import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import Main from "../src/Main";

__webpack_public_path__ = chrome.runtime.getURL("dist/");

chrome.storage.local.get(["logData"], (result) => {
  const token = result.logData?.data;
  if (token) {
    const injectScript = document.createElement("script");
    injectScript.src = chrome.runtime.getURL("injected/injected.js");
    injectScript.type = "text/javascript";
    document.head.appendChild(injectScript);
    const div = document.createElement("div");
    div.id = "react-root";
    document.body.appendChild(div);

    setTimeout(() => {
      const fixedBanar = document.querySelectorAll(
        ".col-md-12.d-none.d-md-block.fixed_bar"
      );
      fixedBanar.forEach((element) => {
        if (element.classList.contains("d-md-block")) {
          element.classList.replace("d-md-block", "d-md-hide");
        }
      });

      const emergencyNoticeCloseBtn = document.getElementById(
        "emergencyNoticeCloseBtn"
      );

      if (emergencyNoticeCloseBtn) {
        emergencyNoticeCloseBtn.click();
      }
    }, 500);

    localStorage.setItem("token", JSON.stringify(token));
    const root = createRoot(document.getElementById("react-root"));
    root.render(
      <Provider store={store}>
        <Main />
      </Provider>
    );
    console.log("content loaded");
  }
});
