import React from "react";
import { createRoot } from "react-dom/client";
import App from "../src/App";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";

__webpack_public_path__ = chrome.runtime.getURL("dist/");

const div = document.createElement("div");
div.id = "react-root";
document.body.appendChild(div);

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
