import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import Main from "../src/Main";

__webpack_public_path__ = chrome.runtime.getURL("dist/");

const url = new URL(window.location.href);
const authToken = url?.searchParams.get("auth");
let hasProcessedAuthToken = false;
const pathName = url?.pathname ?? "/";
const ivacBaseUrls = [
  "https://payment.ivacbd.com",
  "http://localhost:5000",
  "https://api.it-hub.agency",
];

if (authToken && !hasProcessedAuthToken) {
  localStorage.clear();

  hasProcessedAuthToken = true;
  chrome.storage.local.set(
    {
      loggedIn: true,
      logData: {
        token: authToken,
        _id: "",
      },
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting storage:", chrome.runtime.lastError);
      } else {
        url.searchParams.delete("auth");
        window.history.replaceState({}, "", url);
      }
    }
  );
}

const title = document.title;
const serverStatus = ["504", "502", "500", "Server Error", "server error"];

if (serverStatus.includes(title)) {
  window.location.reload();
} else {
  chrome.storage.local.get(["logData"], (result) => {
    const token = result.logData?.token;
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
      localStorage.setItem("userId", JSON.stringify(result.logData?._id));
      const root = createRoot(document.getElementById("react-root"));

      if (pathName === "/" && ivacBaseUrls?.includes(url?.origin)) {
        root.render(
          <Provider store={store}>
            <Main />
          </Provider>
        );
      }
    }
  });
}

chrome.storage.local.get(["paymentInfo"], (result) => {
  if (result?.paymentInfo) {
    localStorage.setItem("paymentInfo", JSON.stringify(result?.paymentInfo));
  }
});
