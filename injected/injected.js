const aScope = window.angular ? angular.element(document.body).scope() : {};
const token = window.csrf_token ?? "EanOLKZ42AMHNINafCkSW3JTis5f9ul5dzc0K6Dx";
const key = aScope.apiKey ?? "EanOLKZ42AMHNINafCkSW3JTis5f9ul5dzc0K6Dx";

let captchaWidgetId; // To store the widget ID
let captchaToken; // To store captchatoken
let captchaData;
const userId =
  localStorage.getItem("userId") ?? JSON.parse(localStorage.getItem("userId"));

if (token && key) {
  localStorage.setItem("_token", token);
  localStorage.setItem("apiKey", key);
}

const baseUrl =
  window.location.origin === "http://localhost:5000"
    ? "http://localhost:5000"
    : "https://it-hub.programmerhub.xyz";

const socketScript = document.createElement("script");
socketScript.src = "https://cdn.socket.io/4.0.0/socket.io.min.js";
socketScript.onload = async () => {
  const socket = io(baseUrl, {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Connected to server: Inject js");
  });

  socket.on("captcha-solver", (data) => {
    console.log(data);
    console.log("captcha solver call");
  });

  socket.on("captcha-create", (data) => {
    if (data?.phone && data?.userId === userId) {
      captchaData = data;
      const captchaContainer = document.getElementById("injected-container");
      const messageContainer = document.getElementById("message");
      messageContainer.innerText = `Captcha for - ${captchaData?.phone}`;
      captchaContainer.style.right = "0px";
    }
  });

  const closeBtn = document.getElementById("closeBtn");
  closeBtn.addEventListener("click", () => {
    const captchaContainer = document.getElementById("injected-container");
    captchaContainer.style.right = "-500px";
    socket.emit("container-close", captchaData);
  });

  // Handle remove button functionality
  const resetBtn = document.getElementById("resetBtn");
  resetBtn.addEventListener("click", () => {
    console.log("Reset button clicked");
    if (window.grecaptcha && captchaWidgetId !== undefined) {
      window.grecaptcha.reset(captchaWidgetId); // Pass the widget ID to reset
      console.log("Captcha reset");
    } else {
      console.error("Captcha reset failed: Widget ID not found");
    }
  });

  const submitBtn = document.getElementById("submitBtn");
  submitBtn.addEventListener("click", () => {
    console.log(captchaToken);
    socket.emit("captcha-solved", {
      token: captchaToken ?? "Captcha Not solved!",
      userId: userId,
      phone: captchaData?.phone,
    });
    closeBtn.click();
  });
};
document.head.appendChild(socketScript);

function onRecaptchaLoad() {
  console.log("reCAPTCHA script loaded");
  // Render the captcha and store the widget ID
  const captchaContainer = document.getElementById("captcha-solver");
  if (captchaContainer) {
    captchaWidgetId = grecaptcha.render("captcha-solver", {
      sitekey: "6LdOCpAqAAAAAOLNB3Vwt_H7Nw4GGCAbdYm5Brsb",
      callback: function (token) {
        if (captchaToken) {
          captchaToken = token;
          submitBtn.classList.add("enabled");
        }
      },
    });
  } else {
    console.error("Captcha container not found!");
  }
}

// Inject reCAPTCHA script dynamically
const captchaScript = document.createElement("script");
captchaScript.src =
  "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
captchaScript.async = true;
captchaScript.defer = true;
document.body.appendChild(captchaScript);

// Create the injected container
const injectedContainer = document.createElement("div");
injectedContainer.id = "injected-container";

// Add styles for the injected container and content
const injectStyle = document.createElement("style");
injectStyle.innerHTML = `
  #injected-container {
    position: fixed;
    width: 400px;
    right: -500px;
    bottom: 5rem;
    padding: 1rem;
    background-color: #FFF;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    transition: right 0.5s ease;
  }

  .btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin: 16px;
  }
  
  .btn {
    padding: 10px;
    font-size: 1rem;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    width: 100px;
    transition: all 0.3s ease-in-out;
  }

  #submitBtn {
    color: #FFF;
    background-color: green;
   
  }

  #resetBtn {
    color: #FFF;
    background-color: red;
  }

  /* Hover effect for buttons */
  .btn:hover {
    color: rgba(255, 255, 255, 0.8); /* Slight blur effect */
    background-color: rgba(0, 0, 0, 0.8); /* Darker background */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); /* Shadow effect */
    transform: scale(1.05); /* Slight scale effect */
  }

  #submitBtn.enabled {
    opacity: 1;
    pointer-events: auto; /* Enable clicks */
  }


  .message-container {
  width: 100%;
  display: flex;
  justify-content: space-between; /* Fixed typo: "space-betwin" -> "space-between" */
  align-items: center;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin:10px 0px;
}

.message-container p {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.message-container button {
  background-color: transparent;
  border: none;
  color: #555;
  font-size: 16px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
}

.message-container button:hover {
  background-color: #f44336; /* Red hover effect */
  color: #fff;
  box-shadow: 0 2px 6px rgba(244, 67, 54, 0.3);
  transform: scale(1.1);
}
`;

// opacity: 0.1;
// pointer-events: none;

// Inject styles into the document
document.head.appendChild(injectStyle);

// Add HTML content to the injected container
injectedContainer.innerHTML = `
  <div id="captchaContainer">
    <div class="message-container">
  <p id="message">Captcha for - 01760567555</p>
  <button id="closeBtn" title="Close">&times;</button>
</div>
    <div id="captcha-solver"></div>
    <div class="btn-container">
    <button id="submitBtn" class="btn">Submit</button>
    <button id="resetBtn" class="btn">Reset</button>
    </div>
  </div>
`;

// Append the injected container to the body
document.body.appendChild(injectedContainer);

// // Handle remove button functionality
// const resetBtn = document.getElementById("resetBtn");
// resetBtn.addEventListener("click", () => {
//   console.log("Reset button clicked");
//   if (window.grecaptcha && captchaWidgetId !== undefined) {
//     window.grecaptcha.reset(captchaWidgetId); // Pass the widget ID to reset
//     console.log("Captcha reset");
//   } else {
//     console.error("Captcha reset failed: Widget ID not found");
//   }
// });

// const submitBtn = document.getElementById("submitBtn");
// resetBtn.addEventListener("click", () => {
//   console.log(captchaToken);
// });

// function onRecaptchaLoad(token) {
//   console.log(token);
// }

// const captchaScript = document.createElement("script");
// captchaScript.src =
//   "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
// captchaScript.async = true;
// captchaScript.defer = true;
// document.body.appendChild(captchaScript);

// window.onloadCallback = function () {
//   grecaptcha.render("captcha-solver", {
//     sitekey: "6LdOCpAqAAAAAOLNB3Vwt_H7Nw4GGCAbdYm5Brsb",
//     callback: function (token) {
//       console.log("Captcha solved, token:", token);
//     },
//   });
// };

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

// // // Inject styles into the document
// document.head.appendChild(injectStyle);

// // Add HTML content to the injected container
// injectedContainer.innerHTML = `
//   <div id="captchaContainer">
//   <div id="captcha-solver"></div>
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
