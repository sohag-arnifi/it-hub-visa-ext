import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../src/redux/store"; //noticeModal
import Main from "../src/Main";

__webpack_public_path__ = chrome.runtime.getURL("dist/");

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

// chrome.runtime.sendMessage({ type: "get-rtl", url: "" });

const getRTL = () => {
  // console.log(window.setRecaptchaTokenPay);
  // console.log(grecaptcha);
  // grecaptcha.reset();
  // window.grecaptcha.reset();
  // return document.getElementsByTagName("iframe")[0].src;
};

const root = createRoot(document.getElementById("react-root"));
root.render(
  <Provider store={store}>
    <Main getRTL={getRTL} />
  </Provider>
);

console.log("content loaded");
