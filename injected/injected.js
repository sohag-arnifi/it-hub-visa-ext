const aScope = window.angular ? angular.element(document.body).scope() : {};
const token = window.csrf_token ?? "EanOLKZ42AMHNINafCkSW3JTis5f9ul5dzc0K6Dx";
const key = aScope.apiKey ?? "EanOLKZ42AMHNINafCkSW3JTis5f9ul5dzc0K6Dx";

if (token && key) {
  localStorage.setItem("_token", token);
  localStorage.setItem("apiKey", key);
}

const baseUrl =
  window.location.origin === "https://payment.ivacbd.com"
    ? "https://it-hub.programmerhub.xyz"
    : "http://localhost:5000";

const socketScript = document.createElement("script");
socketScript.src = "https://cdn.socket.io/4.0.0/socket.io.min.js";
socketScript.onload = async () => {
  const socket = io(baseUrl, {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Connected to server: Inject js");
  });

  socket.on("get-captcha-token", async (data) => {
    if (window?.grecaptcha?.reset) {
      window.grecaptcha.reset();
    }
    const url = document.getElementsByTagName("iframe")[0]?.src ?? "";
    socket.emit("received-url", { url, phone: data?.phone });
  });
};
document.head.appendChild(socketScript);

// // Create the injected container
// const injectedContainer = document.createElement("div");
// injectedContainer.id = "injected-container";

// // Add styles for the injected container and content
// const injectStyle = document.createElement("style");
// injectStyle.innerHTML = `
//   #injected-container {
//     position: fixed;
//     bottom: 5rem;
//     padding: 1rem;
//     right: 0rem;
//     background-color: #FFF;
//     box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
//     width: 300px;
//     z-index: 9999;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     border-radius: 5px;
//   }

//   .injectButtons {
//     padding: 10px;
//     margin: 0 5px;
//     font-size: 1rem;
//     cursor: pointer;
//     border: none;
//     border-radius: 5px;
//     background-color: #FFF;
//   }

//   .injectButtons:hover {
//     background-color: #0056b3;
//     color: #FFF;
//   }
// `;

// // Inject styles into the document
// document.head.appendChild(injectStyle);

// // Add HTML content to the injected container
// injectedContainer.innerHTML = `
//   <div id="captchaContainer">
//     <button id="removeButton" class="injectButtons" style="display: block;">Remove</button>
//   </div>
// `;

// // Append the injected container to the body
// document.body.appendChild(injectedContainer);

// // Wait for DOM elements to be ready
// document.addEventListener("DOMContentLoaded", () => {
//   const captchaContainer = document.getElementById("hash-param");

//   if (!captchaContainer) {
//     console.error("Captcha container with ID 'hash-param' not found.");
//     return;
//   }

//   // Remove the existing captcha container from its parent
//   const parentContainer = captchaContainer.parentNode;
//   if (parentContainer) {
//     parentContainer.removeChild(captchaContainer);

//     // Modify the captcha container attributes
//     captchaContainer.removeAttribute("data-callback");
//     captchaContainer.setAttribute("data-callback", "onCaptchaVerified");

//     // Append the modified captcha container to the new injected container
//     const extCaptchaContainer = document.getElementById("captchaContainer");
//     if (extCaptchaContainer) {
//       extCaptchaContainer.appendChild(captchaContainer);
//       console.log("Captcha container successfully appended.");
//     } else {
//       console.error("External captcha container 'captchaContainer' not found.");
//     }
//   } else {
//     console.error("Parent container for 'hash-param' not found.");
//   }

//   // Check if reCAPTCHA script is loaded
//   const recaptchaScript = document.querySelector(
//     'script[src="https://www.google.com/recaptcha/api.js"]'
//   );
//   if (!recaptchaScript) {
//     console.warn("reCAPTCHA script not found. Adding it dynamically.");
//     const script = document.createElement("script");
//     script.src = "https://www.google.com/recaptcha/api.js";
//     script.async = true;
//     script.defer = true;
//     document.head.appendChild(script);
//   }
// });

// // Callback function for reCAPTCHA verification
// function onCaptchaVerified(token) {
//   console.log("reCAPTCHA verified! Token:", token);
// }

// // Create the main container and append it to the body
// const mainContainer = document.createElement("div");
// mainContainer.id = "main-container";
// document.body.appendChild(mainContainer);

// // Create the injected container
// const injectedContainer = document.createElement("div");
// injectedContainer.id = "injected-container";

// // Add styles for the injected container and content
// const injectStyle = document.createElement("style");
// injectStyle.innerHTML = `
//   #injected-container {
//     position: fixed;
//     bottom: 5rem;
//     padding: 1rem;
//     right: 0rem;
//     background-color: #FFF;
//     box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
//     width: 300px;
//     z-index: 9999;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     border-radius: 5px;
//   }

//   .injectButtons {
//     padding: 10px;
//     margin: 0 5px;
//     font-size: 1rem;
//     cursor: pointer;
//     border: none;
//     border-radius: 5px;
//     background-color: #FFF;
//   }

//   .injectButtons:hover {
//     background-color: #0056b3;
//     color: #FFF;
//   }
// `;

// // Inject styles into the document
// document.head.appendChild(injectStyle);

// // Add HTML content to the injected container
// injectedContainer.innerHTML = `
//   <div id="captchaContainer">
//     <button id="removeButton" class="injectButtons" style="display: block;">Remove</button>
//   </div>
// `;

// // Locate the existing captcha container
// const captchaContainer = document.getElementById("hash-param");
// if (!captchaContainer) {
//   console.error("Captcha container with ID 'hash-param' not found.");
// } else {
//   // Remove the existing captcha container from its parent
//   const parentContainer = captchaContainer?.parentNode;
//   if (parentContainer) {
//     parentContainer.removeChild(  );

//     // Modify the captcha container attributes
//     captchaContainer.removeAttribute("data-callback");
//     captchaContainer.setAttribute("data-callback", "onCaptchaVerified");

//     // Append the modified captcha container to the new injected container
//     const extCaptchaContainer = document.getElementById("captchaContainer");
//     if (extCaptchaContainer) {
//       extCaptchaContainer.appendChild(captchaContainer);
//     } else {
//       console.error("External captcha container 'captchaContainer' not found.");
//     }
//   } else {
//     console.error("Parent container for 'hash-param' not found.");
//   }
// }

// // Check if reCAPTCHA script is loaded
// const recaptchaScript = document.querySelector(
//   'script[src="https://www.google.com/recaptcha/api.js"]'
// );
// if (recaptchaScript) {
//   console.log("reCAPTCHA script is already loaded.");
// } else {
//   console.warn(
//     "reCAPTCHA script not found. Make sure it is included in the page."
//   );
// }

// // Append the injected container to the body
// document.body.appendChild(injectedContainer);

// // Callback function for reCAPTCHA verification
// function onCaptchaVerified(token) {
//   console.log("reCAPTCHA verified! Token:", token);
// }

// // Create the injected container
// const injectedContainer = document.createElement("div");
// injectedContainer.id = "injected-container";

// // Add styles for the injected container and content
// const injectStyle = document.createElement("style");
// injectStyle.innerHTML = `
//   #injected-container {
//     position: fixed;
//     bottom: 5rem;
//     padding: 1rem;
//     right: 0rem;
//     background-color: #FFF;
//     box-Shadow: 0 0 10px rgba(0, 0, 0, 0.2);
//     width: 300px;
//     z-index: 9999;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     border-radius: 5px;
//   }

//   .injectButtons {
//     padding: 10px;
//     margin: 0 5px;
//     font-size: 1rem;
//     cursor: pointer;
//     border: none;
//     border-radius: 5px;
//     background-color: #FFF;
//   }

//   .injectButtons:hover {
//     background-color: #0056b3;
//   }
// `;

// console.log(grecaptcha);

// document.head.appendChild(injectStyle);
// injectedContainer.innerHTML = `
//   <div id="captchaContainer">
//     <button id="removeButton" class="injectButtons" style="display: block;">Remove</button>
//   </div>
// `;

// console.log(document?.getElementById("hash-param"));

// const captchaContainer = document.getElementById("hash-param");
// const parentContainer = captchaContainer?.parentNode;

// parentContainer.removeChild(captchaContainer);

// captchaContainer.removeAttribute("data-callback");
// captchaContainer.setAttribute("data-callback", "onCaptchaVerified");

// const extCaptchaContainer = document.getElementById("captchaContainer");
// extCaptchaContainer.appendChild(captchaContainer);

// console.log(
//   "querySelector",
//   document.querySelector(
//     'script[src="https://www.google.com/recaptcha/api.js"]'
//   )
// );
// // Append the injected container to the body
// document.body.appendChild(injectedContainer);

// document.addEventListener("DOMContentLoaded", function () {
//   // Ensure the reCAPTCHA script is loaded and grecaptcha is available
//   if (typeof grecaptcha !== "undefined") {
//     // Inject reCAPTCHA container into the DOM
//     const captchaContainer = document.querySelector("#recaptcha-container");

//     if (captchaContainer) {
//       // Render the reCAPTCHA widget
//       grecaptcha.render(captchaContainer, {
//         sitekey: "6LdOCpAqAAAAAOLNB3Vwt_H7Nw4GGCAbdYm5Brsb",
//         callback: onCaptchaVerified,
//       });
//     }
//   } else {
//     console.log("reCAPTCHA script is not loaded yet.");
//   }
// });

// {
//   /* <div class="g-recaptcha" data-callback="onCaptchaVerified" data-sitekey="6LdOCpAqAAAAAOLNB3Vwt_H7Nw4GGCAbdYm5Brsb"></div> */
// }

// // Callback function after reCAPTCHA is verified
// function onCaptchaVerified(token) {
//   console.log("Captcha verified. Token:", token);
// }

// // Load Google reCAPTCHA API (if not already loaded)
// const loadRecaptchaScript = () => {
//   if (
//     !document.querySelector(
//       'script[src="https://www.google.com/recaptcha/api.js"]'
//     )
//   ) {
//     const script = document.createElement("script");
//     script.src = "https://www.google.com/recaptcha/api.js";
//     script.async = true;
//     script.defer = true;
//     document.body.appendChild(script);
//   }
// };

// // Call the function to load the script
// loadRecaptchaScript();

// // Handle the remove button
// const removeButton = document.getElementById("removeButton");
// removeButton.addEventListener("click", () => {
//   // Optionally reset reCAPTCHA if needed
//   if (grecaptcha) {
//     grecaptcha.reset();
//   }

//   // Remove the injected container from the page
//   injectedContainer.remove();
// });

// const capContainer = document.getElementById("captchaContainer");

// const capContainer = document.getElementById("captchaContainer");

// // Create the iframe element
// const capIframe = document.createElement("iframe");
// capIframe.title = "reCAPTCHA";
// capIframe.width = "304";
// capIframe.height = "78";
// capIframe.role = "presentation";
// capIframe.name = "a-cp2kxwj9bghk";
// capIframe.frameBorder = "0";
// capIframe.scrolling = "no";
// capIframe.sandbox =
//   "allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation allow-modals allow-popups-to-escape-sandbox allow-storage-access-by-user-activation";

// // Set the src URL for the reCAPTCHA iframe (using your site key)
// capIframe.src =
//   "https://www.google.com/recaptcha/api2/anchor?ar=1&k=6LdOCpAqAAAAAOLNB3Vwt_H7Nw4GGCAbdYm5Brsb&co=aHR0cHM6Ly9wYXltZW50Lml2YWNiZC5jb206NDQz&hl=en&v=pPK749sccDmVW_9DSeTMVvh2&size=normal&cb=sti0ncnew1d";

// // Append the iframe to the container
// capContainer.appendChild(capIframe);

// const gCapScript = document.createElement("script");
// gCapScript.src =
//   "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
// gCapScript.async = true;
// gCapScript.defer = true;
// document.body.appendChild(gCapScript);

// // Callback function when the reCAPTCHA script is loaded
// window.onRecaptchaLoad = function () {
//   // Render the reCAPTCHA
//   grecaptcha.render("captchaContainer", {
//     sitekey: "6LdOCpAqAAAAAOLNB3Vwt_H7Nw4GGCAbdYm5Brsb", // Your reCAPTCHA site key
//     callback: function (token) {
//       console.log("reCAPTCHA solved, token:", token);
//       // Use the token for further validation (e.g., sending to the server)
//     },
//   });
// };

// const gCapScript = document.createElement("script");
// gCapScript.src =
//   "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
// gCapScript.async = true;
// gCapScript.defer = true;
// document.body.appendChild(gCapScript);

// // Callback function when the reCAPTCHA script is loaded
// window.onRecaptchaLoad = function () {
//   // Render the reCAPTCHA widget within the specified container
//   grecaptcha.render("captchaContainer", {
//     sitekey: "6LdOCpAqAAAAAOLNB3Vwt_H7Nw4GGCAbdYm5Brsb", // Your reCAPTCHA site key
//     callback: function (token) {
//       console.log("reCAPTCHA solved, token:", token);
//       reCapthcaToken = token;
//       // Use the token for further validation (e.g., sending to the server)
//     },
//     // Optional: You can set the theme and size of the CAPTCHA here
//     theme: "light", // Theme of the widget
//     size: "normal", // Size of the widget (normal, compact, invisible)
//   });
// };

// const gCapScript = document.createElement("script");
// gCapScript.src = "https://www.google.com/recaptcha/api.js";
// gCapScript.async = true;
// gCapScript.defer = true;
// capContainer.appendChild(gCapScript);

// const capDiv = document.createElement("div");
// capDiv.innerHTML = `<div class="g-recaptcha" data-sitekey="${"6LdOCpAqAAAAAOLNB3Vwt_H7Nw4GGCAbdYm5Brsb"}" data-callback="getRecaptchaToken"></div>`;
// capContainer.appendChild(capDiv);
// window.getRecaptchaToken = function (token) {
//   console.log("CAPTCHA solved, token:", token);
//   reCapthcaToken = token;
// };
