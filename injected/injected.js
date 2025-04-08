const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const applicationId = params.get("applicationId");

const slotPaymentUrls = [
  "http://127.0.0.1:5500",
  "https://ecom1.dutchbanglabank.com",
];

if (applicationId) {
  // localStorage.setItem(
  //   "userImg",
  //   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9KweB-UJmSMetSkHVtnLRrJux7bJv8ksIahpSmkcSNOygSfeXqgHmL6_1Op5fHQiTnNI&usqp=CAU"
  // );

  if (window?.csrf_token) {
    const url = new URL(window.location.href);
    url.searchParams.set("key", window?.csrf_token);
    window.history.pushState({}, "", url);
    const userImgElement = document.querySelector("img.rounded-circle");
    const userImg = userImgElement ? userImgElement.getAttribute("src") : "";
    if (userImg) {
      localStorage.setItem("userImg", userImg);
    } else {
      localStorage.setItem("userImg", "");
      localStorage.setItem(
        "relasedInfo",
        JSON.stringify({
          relased: false,
          message: "Please login to continue!",
        })
      );
    }
  }
}

const baseUrl =
  window.location.origin === "http://localhost:5000" || "http://127.0.0.1:5500"
    ? "https://api.it-hub.agency"
    : "https://api.it-hub.agency";

let isOtpSend = false;
let isOtpVerified = false;

const socketScript = document.createElement("script");
socketScript.src = "https://cdn.socket.io/4.0.0/socket.io.min.js";
socketScript.onload = async () => {
  const socket = io(baseUrl, {
    transports: ["websocket"],
  });

  window.socket = socket;
  socket.on("connect", () => {
    console.log("Socket Connected to server: Inject js");
  });

  socket.on("captcha-create", (data) => {
    if (data?._id === applicationId) {
      const captchaContainer = document.getElementById("injected-container");
      captchaContainer.style.right = "0px";
    }
  });

  socket.on("dbblmobilebanking-otp", (data) => {
    const payInfo = localStorage.getItem("paymentInfo");
    if (payInfo) {
      const { slug, accountNumber } = JSON.parse(payInfo);
      if (
        slug === "dbblmobilebanking" &&
        data?.acc === accountNumber.slice(0, 11)
      ) {
        dbblMobileBankingAutoPaymentOTP(data?.otp);
      }
    }
  });

  const closeBtn = document.getElementById("closeBtn");
  closeBtn.addEventListener("click", () => {
    const captchaContainer = document.getElementById("injected-container");
    captchaContainer.style.right = "-500px";
    socket.emit("container-close", { _id: applicationId });

    submitBtn.classList.remove("enabled");
    closeBtn.click();
  });

  // Handle remove button functionality
  const resetBtn = document.getElementById("resetBtn");
  resetBtn.addEventListener("click", () => {
    if (window.grecaptcha && captchaWidgetId !== undefined) {
      window.grecaptcha.reset(captchaWidgetId); // Pass the widget ID to reset
      console.log("Captcha reset");
    } else {
      console.error("Captcha reset failed: Widget ID not found");
    }
  });

  const submitBtn = document.getElementById("submitBtn");
  submitBtn.addEventListener("click", () => {
    socket.emit("captcha-solved", {
      token: captchaToken ?? "Captcha Not solved!",
      _id: applicationId,
    });
    submitBtn.classList.remove("enabled");
    closeBtn.click();
  });

  if (slotPaymentUrls.includes(url?.origin)) {
    if (!isOtpSend) {
      const payInfo = localStorage.getItem("paymentInfo");
      if (payInfo) {
        const { slug, accountNumber, pinNumber } = JSON.parse(payInfo);
        if (slug === "dbblmobilebanking") {
          if (accountNumber && pinNumber) {
            dbblMobileBankingAutoPayment(accountNumber, pinNumber);
          }
        }
      }
    }
  }
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
        captchaToken = token; // Update the global captchaToken variable
        const submitBtn = document.getElementById("submitBtn");
        if (captchaToken) {
          submitBtn.classList.add("enabled"); // Enable the button
        } else {
          console.error("Captcha token not received or invalid");
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
  opacity: 0.1;
  pointer-events: none;
}

  #submitBtn.enabled {
  opacity: 1;
  pointer-events: auto; /* Enable clicks */
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

  .message-container {
  width: 100%;
  display: flex;
  justify-content: center; /* Fixed typo: "space-betwin" -> "space-between" */
  align-items: center;
  padding: 10px;
  background-color: red;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin:10px 0px;
}


.message-container button {
  background-color: transparent;
  width: 100%;
  height: 100%;
  border: none;
  color: #FFF;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 30px;
  transition: all 0.3s ease-in-out;
}
`;

// Inject styles into the document
document.head.appendChild(injectStyle);

// Add HTML content to the injected container
injectedContainer.innerHTML = `
  <div id="captchaContainer">
    <div class="message-container">
  <button id="closeBtn" title="Close">Close Captcha Container</button>
</div>
    <div id="captcha-solver"></div>
    <div class="btn-container">
    <button id="submitBtn" class="btn">Submit</button>
    <button id="resetBtn" class="btn">Reset</button>
    </div>
  </div>
`;

document.body.appendChild(injectedContainer);

const dbblMobileBankingAutoPayment = (acc, pin) => {
  const accContainer = document.getElementById("cardnr");
  const pinContainer = document.getElementById("cvc2");

  if (accContainer) accContainer.value = acc;
  if (pinContainer) pinContainer.value = pin;

  if (accContainer?.value?.length === 12 && pinContainer?.value?.length === 4) {
    const submitBtn = document.getElementById("pay");
    setTimeout(() => {
      if (url?.origin === "http://127.0.0.1:5500") {
        console.log("DBBL Verification OTP sent...");
        window.socket.emit("dbblmobilebanking-auto-otp", {
          acc: acc.slice(0, 11),
        });
      }
      isOtpSend = true;
      submitBtn.click();
    }, 1500);
  }
};

const dbblMobileBankingAutoPaymentOTP = (otp) => {
  const otpContainer = document.getElementById("passCode");
  if (otpContainer) otpContainer.value = otp;
  if (otpContainer?.value?.length === 6) {
    const submitButton = document.querySelector(
      'input[type="image"][alt="otp"]'
    );
    setTimeout(() => {
      console.log("DBBL OTP verified...");
      submitButton.click();
    }, 1500);
  }
};
