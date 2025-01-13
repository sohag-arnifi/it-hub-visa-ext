var scope = angular.element(document.body).scope();
var injector = angular.element(document.body).injector();
var Api = injector.get("$http");

const _token = window.csrf_token;
const apiKey = scope.apiKey;
let retryCount = 100;

const env = "production";
const backendBaseUrl = "https://it-hub.programmerhub.xyz";
const baseUrl =
  env === "development" ? backendBaseUrl : "https://payment.ivacbd.com";

let processFiles = [];

// Create the main container and append it to the body
const mainContainer = document.createElement("div");
mainContainer.id = "main-container";
document.body.appendChild(mainContainer);

// Create the injected container
const injectedContainer = document.createElement("div");
injectedContainer.id = "injected-container";

// Add styles for the injected container and content
const injectStyle = document.createElement("style");
injectStyle.innerHTML = `
*{
padding: 0px;
margin:0px;
box-siging: border-box;
}

button {
cursor: pointer;
}
  #injected-container {
    position: fixed;
    bottom: 3rem;
    right: 3rem;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
  }

  .injectButtons {
    padding: 10px;
    margin: 0 5px;
    font-size: 1rem;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background-color: #007BFF;
    color: #fff;
  }

  .injectButtons:hover {
    background-color: #0056b3;
  }

  #contentDiv {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    z-index: 9998;
    display: flex;
    overflow: auto;
  }

  .appContainer {
    width: 100%;
    height: 100%;
    padding: 1rem;

  }

  button {
  padding: 0.5rem 1rem
  }

  .messageText {
  font-size:12px;
  padding:10px
  }
`;
document.head.appendChild(injectStyle);

injectedContainer.innerHTML = `
  <div id="captchaContainer">
    <button id="injectButton" class="injectButtons" style="display: none;">Inject</button>
    <button id="removeButton" class="injectButtons" style="display: block;">Remove</button>
  </div>
`;

// Append the injected container to the main container
mainContainer.appendChild(injectedContainer);
document.getElementById("injectButton").addEventListener("click", () => {
  document.getElementById("injectButton").style.display = "none";
  document.getElementById("removeButton").style.display = "block";
  contentDiv.style.display = "block";
});

document.getElementById("removeButton").addEventListener("click", () => {
  document.getElementById("injectButton").style.display = "block";
  document.getElementById("removeButton").style.display = "none";
  contentDiv.style.display = "none";
});

// Create the content div
const contentDiv = document.createElement("div");
contentDiv.id = "contentDiv";

const socketScript = document.createElement("script");
socketScript.src = "https://cdn.socket.io/4.0.0/socket.io.min.js";
socketScript.onload = async () => {
  const socket = io(backendBaseUrl, { transports: ["websocket"] });
  const processResponse = Api.get(
    `${backendBaseUrl}/api/v1/applications/get-all`
  );

  const processApplications = await processResponse.then(
    (response) => response?.data?.data
  );

  processFiles = processApplications;

  console.log(processApplications);

  contentDiv.innerHTML = `
<div class="appContainer">
<div style="
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        background-color: #f8f8f8;
        border-radius: 10px;
        margin-top: 1rem;">
      <h2 style="text-align: center" id="display-time">
        00:00:00
      </h2>


      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;">
      <Button id="getBulkToken"  style="margin: 1rem auto; background-color: red; color:#fff">Get Bulk Token</Button>

      <Button id="getBulkOtpBtn"  style="margin: 1rem auto; background-color: red; color:#fff">Get Bulk OTP</Button>
      </div>
    </div>

  ${processApplications
    .map((item, i) => {
      const center = item?.info[0]?.center;
      const ivac = item?.info[0]?.ivac;
      const visaType = item?.info[0]?.visa_type;

      const email = item?.info[0]?.email;
      const phone = item?.info[0]?.phone;

      return `<div
    style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: #f8f8f8;
      border-radius: 10px;
      margin-top: 1rem;
    "
  >
    <div>
      <p>${i + 1}. ${ivac?.ivac_name}</p>
      ${item?.info
        ?.map((web) => `<p>${web?.web_id} - ${web.name}</p>`)
        .join("")}
    </div>

    <div style="display: flex; flex-direction: column; align-items: center">
      <p>Send to ${phone}</p>
      <button id="sendOtpButton-${i}" class="sendOtpButton" style="background-color: red; color:#fff">Sent OTP</button>
      <p class="messageText" id="sentOtpMessage-${i}" style="display: none;"></p>
    </div>

    <div style="display: flex; flex-direction: column; align-items: center">
      <input id="inputOtp-${i}" type="number" style="padding: 10px" placeholder="Enter OTP" />
      <button id="verifyOtp-${i}" class="verifyBtn" style="margin: 10px; background-color: red; color:#fff">Verify OTP</button>
      <p class="messageText" id="verifyOtpMessage-${i}" style="display: none;"></p>
    </div>

    <div style="display: flex; flex-direction: column; align-items: center">
      <p id="aDate-${i}">Appointment Date: Not Found!</p>
      <button class="getTimeSlotBtn" id="getTime-${i}" style=" background-color: red; color:#fff">Get Time Slot</button>
       <p class="messageText" id="getTimeSlow-${i}" style="display: none;"></p>
    </div>

    <div style="display: flex; flex-direction: column; align-items: center">
      <p id="aTime-${i}">Appointment Time: Not Found!</p>
      <p style="font-size:10px; color: red;"id="captcha-${i}">Captcha Not Found!</p>
      <button id="confirmNow-${i}" class="confirmNowBtn" style=" background-color: red; color:#fff">Confirm Now</button>
      <p class="messageText" id="confirmNowMessage-${i}" style="display: none;"></p>
    </div>

    <div
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      "
    >
      <button id="payNow-${i}" class="payNowBtn" >Pay Now</button>
      <button id="copyLink-${i}" class="copyLinkBtn">Copy Link</button>
    </div>
  </div>`;
    })
    .join("")}
</div>
`;
  mainContainer.appendChild(contentDiv);

  socket.on("message", (message) => {
    console.log("Received message:", message);
  });

  socket.on("sendOtp", (index) => {
    console.log("otp send:", index);
  });

  const sendBtns = document.querySelectorAll(".sendOtpButton");
  sendBtns.forEach((btn, i) => {
    btn.addEventListener("click", async () => {
      const index = i;
      sendOTP(index);
      socket.emit("sendOtp", index);
    });
  });
};
document.head.appendChild(socketScript);

const sendOTP = async (index) => {
  const payload = processFiles.find((_, i) => i === index);
  const messageContainer = document.getElementById(`sentOtpMessage-${index}`);

  messageContainer.style.display = "block";
  messageContainer.innerHTML = "Sending...";

  payload._token = _token;
  payload.apiKey = apiKey;
  const response = await manageQueue(payload);
  console.log(response);
};

const manageQueue = async (payload) => {
  try {
    const response = await Api.post(`${baseUrl}/queue-manage`, payload).then(
      (res) => res.data
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

const setResponseMessage = (messageContainer, message, status = "success") => {
  messageContainer.style.display = "block";
  messageContainer.innerHTML = message;
  if (status === "success") {
    messageContainer.style.color = "green";
  } else if (status === "error") {
    messageContainer.style.color = "red";
  }
};
// let csrfToken = "";
// let recaptchaToken = "";
// let recaptchaTokenPay = "";
// let retryCount = 100;

// const env = "production";
// const baseUrl =
//   env === "development"
//     ? "http://localhost:5000/api"
//     : "https://payment.ivacbd.com";

// const centers = {
//   1: {
//     id: 1,
//     c_name: "Dhaka",
//     prefix: "D",
//     is_delete: 0,
//     is_open: true,
//   },
//   3: {
//     id: 3,
//     c_name: "Rajshahi",
//     prefix: "R",
//     is_delete: 0,
//     is_open: true,
//   },
// };

// const ivacs = {
//   2: {
//     id: 2,
//     center_info_id: 3,
//     ivac_name: "IVAC , RAJSHAHI",
//     address:
//       "Morium Ali Tower,Holding No-18, Plot No-557, 1ST Floor,Old Bilsimla, Greater Road,Barnali More, 1ST Floor, Ward No-10,Rajshahi.",
//     prefix: "R",
//     ceated_on: "2017-08-30 13:06:20",
//     visa_fee: 800.0,
//     is_delete: 0,
//     app_key: "IVACRAJSHAHI",
//     charge: 3,
//     new_visa_fee: 800.0,
//     old_visa_fee: 800.0,
//     new_fees_applied_from: "2018-08-05 00:00:00",
//     notify_fees_from: "2018-07-29 04:54:32",
//     max_notification_count: 2,
//     allow_old_amount_until_new_date: 2,
//     notification_text_beside_amount:
//       "(From <from> this IVAC fees will be <new_amount> BDT)",
//     notification_text_popup: "",
//   },
//   17: {
//     id: 17,
//     center_info_id: 1,
//     ivac_name: "IVAC, Dhaka (JFP)",
//     address: "Jamuna Future Park",
//     prefix: "D",
//     ceated_on: "2018-07-12 05:58:00",
//     visa_fee: 800.0,
//     is_delete: 0,
//     created_at: "2018-07-12 00:00:00",
//     updated_at: "",
//     app_key: "IVACJFP",
//     contact_number: "",
//     created_by: "",
//     charge: 3,
//     new_visa_fee: 800.0,
//     old_visa_fee: 800.0,
//     new_fees_applied_from: "2018-08-05 00:00:00",
//     notify_fees_from: "2018-07-29 04:54:32",
//     max_notification_count: 2,
//     allow_old_amount_until_new_date: 2,
//     notification_text_beside_amount:
//       "(From <from> this IVAC fees will be <new_amount> BDT)",
//     notification_text_popup: "",
//   },
// };

// const visaTypes = {
//   13: {
//     id: 13,
//     type_name: "MEDICAL/MEDICAL ATTENDANT VISA",
//     order: 2,
//     is_active: 1,
//     $$hashKey: "object:50",
//   },
// };

// const amountChangeData = {
//   allow_old_amount_until_new_date: 2,
//   max_notification_count: 0,
//   old_visa_fees: "800.00",
//   new_fees_applied_from: "2018-08-05 00:00:00",
//   notice: false,
//   notice_short: "",
//   notice_popup: "",
//   new_visa_fee: "800.00",
// };

// const getOtpPayload = (item) => {
//   const info = item?.info?.map((data) => {
//     return {
//       web_id: data?.web_id,
//       web_id_repeat: data?.web_id,
//       name: data?.name,
//       phone: data?.phone,
//       email: data?.email,
//       amount: 800.0,
//       center: centers[item?.center],
//       ivac: ivacs[item?.ivac],
//       visa_type: visaTypes[item?.type],
//       amountChangeData,
//       confirm_tos: true,
//     };
//   });

//   const data = {
//     _token: csrfToken,
//     apiKey: csrfToken,
//     action: "sendOtp",
//     info,
//     resend: 0,
//     // hash_params_otp: item?.hash_params_otp,
//     hash_params_otp: item?.hash_params_otp,
//   };
//   return data;
// };

// const getVerifyPayload = (item) => {
//   const info = item?.info?.map((data) => {
//     return {
//       web_id: data?.web_id,
//       web_id_repeat: data?.web_id,
//       name: data?.name,
//       phone: data?.phone,
//       email: data?.email,
//       amount: 800.0,
//       center: centers[item?.center],
//       ivac: ivacs[item?.ivac],
//       visa_type: visaTypes[item?.type],
//       amountChangeData,
//       confirm_tos: true,
//       otp: item?.otp,
//     };
//   });

//   const data = {
//     _token: csrfToken,
//     apiKey: csrfToken,
//     action: "verifyOtp",
//     info,
//     otp: item?.otp,
//   };

//   return data;
// };

// const getSlotPayload = (item) => {
//   const info = item?.info?.map((data) => {
//     return {
//       web_id: data?.web_id,
//       web_id_repeat: data?.web_id,
//       name: data?.name,
//       phone: data?.phone,
//       email: data?.email,
//       amount: 800.0,
//       is_open: true,
//       center: centers[item?.center],
//       ivac: ivacs[item?.ivac],
//       visa_type: visaTypes[item?.type],
//       amountChangeData,
//       confirm_tos: true,
//       otp: item?.otp,
//       appointment_time: "2024-12-31",
//     };
//   });

//   const data = {
//     _token: csrfToken,
//     apiKey: csrfToken,
//     action: "generateSlotTime",
//     amount: 10.0,
//     ivac_id: item?.ivac,
//     visa_type: item?.type,
//     info,
//     otp: item?.otp,
//     specific_date: "2024-12-31",
//   };

//   return data;
// };

// const getConfirmNowPayload = (item) => {
//   const info = item?.info?.map((data) => {
//     return {
//       web_id: data?.web_id,
//       web_id_repeat: data?.web_id,
//       name: data?.name,
//       phone: data?.phone,
//       email: data?.email,
//       amount: 800.0,
//       is_open: true,
//       center: centers[item?.center],
//       ivac: ivacs[item?.ivac],
//       visa_type: visaTypes[item?.type],
//       amountChangeData,
//       confirm_tos: true,
//       otp: item?.otp,
//       appointment_date: item?.specific_date,
//       appointment_time: item?.slotTime?.hour,
//     };
//   });

//   const data = {
//     _token: csrfToken,
//     apiKey: csrfToken,
//     action: "payInvoice",
//     info,
//     otp: item?.otp,
//     selected_slot: item?.slotTime,
//     selected_payment: {
//       name: "Bkash",
//       slug: "bkash",
//       grand_total: info.length * 824,
//       link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/bkash.png",
//     },
//     hash_params: item?.hash_params,
//   };

//   return data;
// };

// const data = [
//   {
//     center: 3,
//     ivac: 2,
//     type: 13,
//     phone: "01760567555",
//     email: "SHOHAGROY@YAHOO.COM",
//     info: [
//       {
//         web_id: "BGDRV3A42C24",
//         name: "MD MANIK MIA",
//         phone: "01760567555",
//         email: "SHOHAGROY@YAHOO.COM",
//       },
//     ],
//     hash_params_otp: "",
//     otp: "",
//     hash_params: "",
//   },
//   // {
//   //   center: 3,
//   //   ivac: 2,
//   //   type: 13,
//   //   phone: "01740643494",
//   //   email: "RDRDOYAL@GMAIL.COM",
//   //   info: [
//   //     {
//   //       web_id: "BGDRV3966A24",
//   //       name: "PROTASHA RANI ROY",
//   //       phone: "01740643494",
//   //       email: "RDRDOYAL@GMAIL.COM",
//   //     },
//   //     {
//   //       web_id: "BGDRV396CB24",
//   //       name: "BULLI RANI ROY",
//   //       phone: "01740643494",
//   //       email: "RDRDOYAL@GMAIL.COM",
//   //     },
//   //   ],
//   //   hash_params_otp: "",
//   //   otp: "",
//   //   hash_params: "",
//   // },
//   // {
//   //   center: 1,
//   //   ivac: 17,
//   //   type: 13,
//   //   phone: "01760567555",
//   //   email: "ANATHROY010@GMAIL.COM",
//   //   info: [
//   //     {
//   //       web_id: "BGDDW3697824",
//   //       name: "ANATH CHANDRA ROY",
//   //       phone: "01760567555",
//   //       email: "ANATHROY010@GMAIL.COM",
//   //     },
//   //   ],
//   //   hash_params_otp: "",
//   //   otp: "",
//   //   hash_params: "",
//   // },
// ];

// setTimeout(() => {
//   csrfToken = window.csrf_token;
//   localStorage.setItem("csrfToken", csrfToken);
// }, 1000);

// window.setRecaptchaToken = function (token) {
//   recaptchaToken = token;

//   const dataIndex = data?.findIndex(
//     (item) => !item?.otp && !item?.hash_params_otp
//   );
//   if (dataIndex !== -1) {
//     const btn = document.getElementById(`sendOtpButton-${dataIndex}`);
//     otpCaptchaTimer(dataIndex);
//     btn.style.backgroundColor = "green";
//     data[dataIndex].hash_params_otp = token;
//   }

//   setTimeout(() => {
//     grecaptcha.reset();
//   }, 2000);
// };

// window.setRecaptchaTokenPay = function (token) {
//   recaptchaTokenPay = token;

//   const dataIndex = data?.findIndex((item) => !item?.otp && !item?.hash_params);
//   if (dataIndex !== -1) {
//     const btn = document.getElementById(`confirmNow-${dataIndex}`);
//     btn.style.backgroundColor = "green";
//     data[dataIndex].hash_params = token;
//   }

//   setTimeout(() => {
//     grecaptcha.reset();
//   }, 2000);
// };

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
// *{
// padding: 0px;
// margin:0px;
// box-siging: border-box;
// }

// button {
// cursor: pointer;
// }
//   #injected-container {
//     position: fixed;
//     bottom: 3rem;
//     right: 3rem;
//     background-color: rgba(0, 0, 0, 0.5);
//     z-index: 9999;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     border-radius: 8px;
//   }

//   .injectButtons {
//     padding: 10px;
//     margin: 0 5px;
//     font-size: 1rem;
//     cursor: pointer;
//     border: none;
//     border-radius: 5px;
//     background-color: #007BFF;
//     color: #fff;
//   }

//   .injectButtons:hover {
//     background-color: #0056b3;
//   }

//   #contentDiv {
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100vw;
//     height: 100vh;
//     background-color: #fff;
//     z-index: 9998;
//     display: flex;
//     overflow: auto;
//   }

//   .appContainer {
//     width: 100%;
//     height: 100%;
//     padding: 1rem;

//   }

//   button {
//   padding: 0.5rem 1rem
//   }

//   .messageText {
//   font-size:12px;
//   padding:10px
//   }
// `;

// document.head.appendChild(injectStyle);

// injectedContainer.innerHTML = `
//   <div id="captchaContainer">
//     <button id="injectButton" class="injectButtons" style="display: none;">Inject</button>
//     <button id="removeButton" class="injectButtons" style="display: block;">Remove</button>
//   </div>
// `;

// // Append the injected container to the main container
// mainContainer.appendChild(injectedContainer);

// // Create the content div
// const contentDiv = document.createElement("div");
// contentDiv.id = "contentDiv";

// contentDiv.innerHTML = `
//   <div class="appContainer">
//   <div style="
//           display: flex;
//           justify-content: center;
//           flex-direction: column;
//           align-items: center;
//           padding: 1rem;
//           background-color: #f8f8f8;
//           border-radius: 10px;
//           margin-top: 1rem;">
//         <h2 style="text-align: center" id="display-time">
//           00:00:00
//         </h2>

//         <div style="
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           gap: 0.5rem;">
//         <Button id="getBulkToken"  style="margin: 1rem auto; background-color: red; color:#fff">Get Bulk Token</Button>

//         <Button id="getBulkOtpBtn"  style="margin: 1rem auto; background-color: red; color:#fff">Get Bulk OTP</Button>
//         </div>
//       </div>

//     ${data
//       .map((item, i) => {
//         const ivac = ivacs[item?.ivac];
//         return `<div
//       style="
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         padding: 1rem;
//         background-color: #f8f8f8;
//         border-radius: 10px;
//         margin-top: 1rem;
//       "
//     >
//       <div>
//         <p>${i + 1}. ${ivac?.ivac_name}</p>
//         ${item?.info
//           ?.map((web) => `<p>${web?.web_id} - ${web.name}</p>`)
//           .join("")}
//       </div>

//       <div style="display: flex; flex-direction: column; align-items: center">
//         <p>Send to ${item?.phone}</p>
//         <span style="font-size:12px; color: red; padding: 5px;"id="otpTimer-${i}">Captcha Not Found!</span>
//         <button id="sendOtpButton-${i}" class="sendOtpButton" style="background-color: red; color:#fff">Sent OTP</button>
//         <p class="messageText" id="sentOtpMessage-${i}" style="display: none;"></p>
//       </div>

//       <div style="display: flex; flex-direction: column; align-items: center">
//         <input id="inputOtp-${i}" type="number" style="padding: 10px" placeholder="Enter OTP" />
//         <button id="verifyOtp-${i}" class="verifyBtn" style="margin: 10px; background-color: red; color:#fff">Verify OTP</button>
//         <p class="messageText" id="verifyOtpMessage-${i}" style="display: none;"></p>
//       </div>

//       <div style="display: flex; flex-direction: column; align-items: center">
//         <p id="aDate-${i}">Appointment Date: Not Found!</p>
//         <button class="getTimeSlotBtn" id="getTime-${i}" style=" background-color: red; color:#fff">Get Time Slot</button>
//          <p class="messageText" id="getTimeSlow-${i}" style="display: none;"></p>
//       </div>

//       <div style="display: flex; flex-direction: column; align-items: center">
//         <p id="aTime-${i}">Appointment Time: Not Found!</p>
//         <p style="font-size:10px; color: red;"id="captcha-${i}">Captcha Not Found!</p>
//         <button id="confirmNow-${i}" class="confirmNowBtn" style=" background-color: red; color:#fff">Confirm Now</button>
//         <p class="messageText" id="confirmNowMessage-${i}" style="display: none;"></p>
//       </div>

//       <div
//         style="
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 10px;
//         "
//       >
//         <button id="payNow-${i}" class="payNowBtn" >Pay Now</button>
//         <button id="copyLink-${i}" class="copyLinkBtn">Copy Link</button>
//       </div>
//     </div>`;
//       })
//       .join("")}
//   </div>
// `;

// // Append the content div to the main container
// mainContainer.appendChild(contentDiv);

// // Event listeners for toggling buttons and content
// document.getElementById("injectButton").addEventListener("click", () => {
//   document.getElementById("injectButton").style.display = "none";
//   document.getElementById("removeButton").style.display = "block";
//   contentDiv.style.display = "block";
// });

// document.getElementById("removeButton").addEventListener("click", () => {
//   document.getElementById("injectButton").style.display = "block";
//   document.getElementById("removeButton").style.display = "none";
//   contentDiv.style.display = "none";
// });

// const sendOtpButtons = contentDiv.querySelectorAll(".sendOtpButton");
// sendOtpButtons.forEach(async (button, index) => {
//   button.addEventListener("click", async () => {
//     retryCount = 100;
//     const messageText = document.getElementById(`sentOtpMessage-${index}`);
//     messageText.style.display = "none";
//     const verifyBtn = document.getElementById(`verifyOtp-${index}`);
//     const payload = getOtpPayload(data[index]);

//     if (env === "production" && payload?.hash_params_otp) {
//       button.innerHTML = "Sending...";
//       const response = await manageQueue(payload, messageText);
//       console.log(response);

//       const message = response?.message[0];
//       data[index].hash_params_otp = "";
//       button.style.backgroundColor = "red";
//       showMessage(
//         messageText,
//         message,
//         response?.code === 200 ? "success" : "error"
//       );
//       if (response?.code === 200) {
//         verifyBtn.style.backgroundColor = "green";
//       }
//       button.innerHTML = "Send OTP";
//     } else {
//       button.innerHTML = "Sending...";
//       const response = await manageQueue(payload, messageText);
//       console.log(response);

//       const message = response?.message[0];
//       data[index].hash_params_otp = "";
//       // button.style.backgroundColor = "red";

//       // const displayTimer = document.getElementById(`otpTimer-${index}`);
//       // displayTimer.style.color = "red";
//       // displayTimer.textContent = "CaptchaNot Found";

//       const sendBtn = document.getElementById(`sendOtp-${index}`);
//       // sendBtn.style.color = "red";

//       showMessage(
//         messageText,
//         message,
//         response?.code === 200 ? "success" : "error"
//       );
//       if (response?.code === 200) {
//         verifyBtn.style.backgroundColor = "green";
//       }
//       button.innerHTML = "Send OTP";
//     }
//   });
// });

// const verifyButtons = contentDiv.querySelectorAll(".verifyBtn");
// verifyButtons.forEach(async (button, index) => {
//   retryCount = 100;
//   button.addEventListener("click", async () => {
//     button.innerHTML = "Verifying...";
//     const messageText = document.getElementById(`verifyOtpMessage-${index}`);
//     messageText.style.display = "none";

//     const capchaMessage = document.getElementById(`captcha-${index}`);
//     capchaMessage.style.color = "blue";
//     capchaMessage.innerHTML = "Capctha geting....";

//     // fetch("http://localhost:5000/api/v1/recaptcha-token", {
//     //   method: "GET",
//     // })
//     //   .then((response) => response.json())
//     //   .then(async (cData) => {
//     //     const cToken = cData?.data;
//     //     capchaMessage.style.color = "green";
//     //     capchaMessage.innerHTML = "Capctha Geted!";
//     //     data[index].hash_params = cToken;
//     //   });

//     const otp = document.getElementById(`inputOtp-${index}`).value;
//     data[index].otp = otp;

//     const payload = getVerifyPayload(data[index]);

//     const response = await manageQueue(payload, messageText);
//     console.log(response);

//     showMessage(
//       messageText,
//       "Verifyed Successfully",
//       response?.code === 200 ? "success" : "error"
//     );

//     button.innerHTML = "Verify OTP";

//     if (response?.code === 200) {
//       const currentData = data[index];
//       const timeSlotAvailable = data?.find((item) => {
//         return (
//           item?.ivac === currentData?.ivac &&
//           item?.visaTypes === currentData?.visaTypes &&
//           item?.slotTime?.id
//         );
//       });

//       if (timeSlotAvailable) {
//         data[index].slotTime = timeSlotAvailable?.slotTime;
//         data[index].specific_date = timeSlotAvailable?.specific_date;

//         if (currentData?.hash_params) {
//           await handleDirectConfirm(index);
//         }
//       } else {
//         const getTimeBtn = document.getElementById(`getTime-${index}`);
//         getTimeBtn.style.backgroundColor = "green";

//         data[index].specific_date =
//           response?.data?.slot_dates[0] ?? "2024-12-31";
//         await handleGetSlotTime(index);
//       }
//     }
//   });
// });

// const timeSlotBtns = contentDiv.querySelectorAll(".getTimeSlotBtn");
// timeSlotBtns.forEach(async (button, index) => {
//   button.addEventListener("click", async () => {
//     await handleGetSlotTime(index);
//   });
// });

// const confirmNowBtn = contentDiv.querySelectorAll(".confirmNowBtn");
// confirmNowBtn.forEach(async (button, index) => {
//   button.addEventListener("click", async () => {
//     console.log("confirmNowBtn");
//     const capchaMessage = document.getElementById(`captcha-${index}`);
//     capchaMessage.style.color = "red";
//     capchaMessage.innerHTML = "Capctha not Found!";
//     await handleConformNow(index);
//   });
// });

// const payNowBtn = contentDiv.querySelectorAll(".payNowBtn");
// payNowBtn.forEach(async (button, index) => {
//   button.addEventListener("click", async () => {
//     const paymentLink = data[index]?.paymentLink;
//     const a = document.createElement("a");
//     a.href = paymentLink;
//     a.target = "_blank";
//     a.click();
//     a.remove();
//   });
// });

// const copyLinkBtn = contentDiv.querySelectorAll(".copyLinkBtn");
// copyLinkBtn.forEach(async (button, index) => {
//   button.addEventListener("click", async () => {
//     const paymentLink = data[index]?.paymentLink;
//     navigator.clipboard.writeText(paymentLink);
//   });
// });

// const handleGetSlotTime = async (index) => {
//   retryCount = 100;
//   const selectedData = data[index];

//   const messageText = document.getElementById(`getTimeSlow-${index}`);
//   const dispayDate = document.getElementById(`aDate-${index}`);
//   dispayDate.innerHTML = `Appointment Date - ${selectedData?.specific_date}`;
//   const getDateBtn = document.getElementById(`getTime-${index}`);
//   getDateBtn.innerHTML = "Getting...";
//   const payload = getSlotPayload(selectedData);
//   messageText.style.display = "none";

//   const response = await getTimeSlot(payload, messageText);
//   console.log(response);
//   const slotTime = response?.slot_times[0];
//   // const slotTime = {
//   //   id: 160313,
//   //   ivac_id: 2,
//   //   visa_type: 13,
//   //   hour: 11,
//   //   date: "2024-12-09",
//   //   availableSlot: 112,
//   //   time_display: "11:00 - 11:59",
//   // };

//   showMessage(
//     messageText,
//     slotTime?.id ? "Get Successfully" : "Time Slot not found!",
//     slotTime?.id ? "success" : "error"
//   );

//   getDateBtn.innerHTML = "Get Time Slot";

//   if (slotTime?.id) {
//     const confirmBtn = document?.getElementById(`confirmNow-${index}`);
//     confirmBtn.style.backgroundColor = "green";
//     data[index].slotTime = slotTime;
//     await handleConformNow(index);
//   }
// };

// const handleConformNow = async (index) => {
//   retryCount = 100;
//   const selectedData = data[index];

//   const messageText = document.getElementById(`confirmNowMessage-${index}`);
//   const displayTime = document.getElementById(`aTime-${index}`);
//   displayTime.innerHTML = `Appointment Time - ${selectedData?.slotTime?.time_display} - ${selectedData?.slotTime?.availableSlot}`;
//   const confirmNow = document.getElementById(`confirmNow-${index}`);
//   confirmNow.innerHTML = "Confirming...";
//   messageText.style.display = "none";

//   const btn = document.getElementById(`confirmNow-${index}`);
//   btn.style.backgroundColor = "red";

//   const payload = getConfirmNowPayload(data[index]);
//   const response = await confirmTimeSlot(payload, messageText);
//   console.log(response);

//   data[index].hash_params = "";
//   // showMessage(
//   //   messageText,
//   //   response?.message[0],
//   //   response?.code === 200 ? "success" : "error"
//   // );

//   confirmNow.innerHTML = "Confirm Now";

//   const paymentLink = response?.data?.url + "bkash";
//   data[index].paymentLink = paymentLink;

//   const copyLink = document.getElementById(`copyLink-${index}`);
//   copyLink.style.backgroundColor = "green";
//   copyLink.style.color = "white";

//   const payNow = document.getElementById(`payNow-${index}`);
//   payNow.style.backgroundColor = "green";
//   payNow.style.color = "white";

//   if (response?.data?.status !== "FAIL") {
//     showMessage(messageText, "Slot Confirmed", "success");
//   } else {
//     showMessage(messageText, "Something went wrong!", "error");
//   }
// };

// const toUrlEncoded = (obj, prefix) => {
//   const str = [];
//   for (let key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       const k = prefix ? `${prefix}[${key}]` : key;
//       const v = obj[key];
//       str.push(
//         v !== null && typeof v === "object"
//           ? toUrlEncoded(v, k) // Recursively flatten nested objects
//           : encodeURIComponent(k) + "=" + encodeURIComponent(v)
//       );
//     }
//   }
//   return str.join("&");
// };

// const showMessage = (container, message, type) => {
//   container.innerHTML = message;
//   container.style.display = "block";

//   if (type === "success") {
//     container.style.color = "green";
//   } else if (type === "error") {
//     container.style.color = "red";
//   } else {
//     container.style.color = "black";
//   }
// };

// const manageQueue = async (payload, messageText) => {
//   try {
//     const response = await fetch(`${baseUrl}/queue-manage`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded;charset=utf-8;",
//       },
//       body: toUrlEncoded(payload),
//       credentials: "include",
//     });

//     if (response.status === 200 || response.status === "FAILED") {
//       return response.json();
//     }

//     // If status is 502 or 504, retry the request
//     if (response.status === 502 || response.status === 504) {
//       if (retryCount > 0) {
//         retryCount--;
//         showMessage(
//           messageText,
//           `Retrying API call, attempts remaining: ${retryCount}`,
//           "error"
//         );
//         console.log(`Retrying API call, attempts remaining: ${retryCount}`);

//         return await manageQueue(payload, messageText);
//       } else {
//         showMessage(messageText, "Max retry attempts reached", "error");
//         throw new Error("Max retry attempts reached");
//       }
//     }

//     throw new Error(`API call failed with status: ${response.status}`);
//   } catch (error) {
//     console.error("Error in manageQueue:", error);
//     showMessage(messageText, "Error in manageQueue", "error");
//     throw error;
//   }
// };

// const getTimeSlot = async (payload, messageText) => {
//   try {
//     const response = await fetch(`${baseUrl}/get_payment_options_v2`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded;charset=utf-8;",
//       },
//       body: toUrlEncoded(payload),
//       credentials: "include",
//     });

//     if (response.status === 200) {
//       return response.json();
//     }

//     // If status is 502 or 504, retry the request
//     if (response.status === 502 || response.status === 504) {
//       if (retryCount > 0) {
//         retryCount--;
//         showMessage(
//           messageText,
//           `Retrying API call, attempts remaining: ${retryCount}`,
//           "error"
//         );
//         console.log(`Retrying API call, attempts remaining: ${retryCount}`);
//         return await getTimeSlot(payload, messageText);
//       } else {
//         showMessage(messageText, "Max retry attempts reached", "error");
//         return null;
//       }
//     }

//     throw new Error(`API call failed with status: ${response.status}`);
//   } catch (error) {
//     console.error("Error in manageQueue:", error);
//     showMessage(messageText, "something went wrong", "error");
//     throw error;
//   }
// };

// const confirmTimeSlot = async (payload, messageText) => {
//   try {
//     const response = await fetch(`${baseUrl}/slot_pay_now`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded;charset=utf-8;",
//       },
//       body: toUrlEncoded(payload),
//       credentials: "include",
//     });

//     if (response.status === 200) {
//       return response.json();
//     }

//     // If status is 502 or 504, retry the request
//     if (response.status === 502 || response.status === 504) {
//       if (retryCount > 0) {
//         retryCount--;
//         showMessage(
//           messageText,
//           `Retrying API call, attempts remaining: ${retryCount}`,
//           "error"
//         );
//         console.log(`Retrying API call, attempts remaining: ${retryCount}`);

//         return await confirmTimeSlot(payload, messageText);
//       } else {
//         showMessage(messageText, "Max retry attempts reached", "error");
//         return { status: "FAIL" };
//       }
//     }

//     throw new Error(`API call failed with status: ${response.status}`);
//   } catch (error) {
//     showMessage(messageText, "Something went wrong", "error");
//     console.error("Error in manageQueue:", error);
//     throw error;
//   }
// };

// const handleDirectConfirm = async (index) => {
//   const selectedData = data[index];

//   const getTimeBtn = document.getElementById(`getTime-${index}`);
//   getTimeBtn.style.backgroundColor = "blue";
//   getTimeBtn.innerHTML = "Pass";
//   const getMessageText = document.getElementById(`getTimeSlow-${index}`);
//   const dispayDate = document.getElementById(`aDate-${index}`);
//   dispayDate.innerHTML = `Appointment Date - ${selectedData?.specific_date}`;
//   getMessageText.style.display = "none";

//   const confirmBtn = document?.getElementById(`confirmNow-${index}`);
//   confirmBtn.style.backgroundColor = "green";

//   await handleConformNow(index);
// };

// const otpCaptchaTimer = (index) => {
//   const displayTimer = document.getElementById(`otpTimer-${index}`);
//   const sendBtn = document.getElementById(`sendOtp-${index}`);
//   displayTimer.style.color = "green";

//   const totalMilliseconds = (1 * 60 + 50) * 1000;
//   let remainingTime = totalMilliseconds;

//   const intervalId = setInterval(() => {
//     const minutes = Math.floor(remainingTime / (60 * 1000));
//     const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
//     const milliseconds = remainingTime % 1000;

//     // Display the time in mm:ss:ms format
//     if (displayTimer) {
//       displayTimer.textContent = `${String(minutes).padStart(2, "0")}:${String(
//         seconds
//       ).padStart(2, "0")}:${String(milliseconds).padStart(2, "0")}`;
//     }

//     if (remainingTime <= 0) {
//       clearInterval(intervalId);
//       data[index].hash_params_otp = "";
//       displayTimer.textContent = "Captcha Expired";
//       displayTimer.style.color = "red";
//       sendBtn.click;
//       // sendBtn.style.backgroundColor = "red";
//       return;
//     }

//     remainingTime -= 10;
//   }, 10);
// };

// const getBulkTokenBtn = document.getElementById("getBulkToken");
// getBulkTokenBtn.addEventListener("click", async () => {
//   getBulkTokenBtn.style.backgroundColor = "blue";
//   getBulkTokenBtn.innerHTML = "Getting...";

//   data?.forEach((item, i) => {
//     if (item?.hash_params_otp === "") {
//       getAndSetToken(i);
//     }
//   });

//   getBulkTokenBtn.style.backgroundColor = "green";
//   getBulkTokenBtn.innerHTML = "Get Bulk Token";
// });

// const getBulkOtpBtn = document.getElementById("getBulkOtpBtn");
// getBulkOtpBtn.addEventListener("click", () => {
//   getBulkOtpBtn.style.backgroundColor = "blue";
//   getBulkOtpBtn.innerHTML = "Getting...";
//   sendOtpButtons.forEach((button) => {
//     button.click();
//   });
// });

// // const startTime = "06:00:00 PM";
// function updateCurrentTime() {
//   const now = new Date(); // Get the current date and time

//   // Extract hours, minutes, and seconds
//   const hours = String(now.getHours()).padStart(2, "0");
//   const minutes = String(now.getMinutes()).padStart(2, "0");
//   const seconds = String(now.getSeconds()).padStart(2, "0");

//   // Format the time as HH:MM:SS AM/PM
//   const ampm = hours >= 12 ? "PM" : "AM";
//   const formattedTime = `${
//     hours > 12 ? hours - 12 : hours === "00" ? 12 : hours
//   }:${minutes}:${seconds} ${ampm}`;

//   // Update the DOM with the current time
//   document.getElementById("display-time").textContent = formattedTime;
// }

// // Start the timer to update every second
// setInterval(updateCurrentTime, 1000);

// // Call the function immediately to avoid delay
// updateCurrentTime();

// const getAndSetToken = (index) => {
//   const btn = document.getElementById(`sendOtpButton-${index}`);
//   fetch("http://localhost:5000/api/v1/recaptcha-token", {
//     method: "GET",
//   })
//     .then((response) => response.json())
//     .then(async (cData) => {
//       const cToken = cData?.data;
//       data[index].hash_params_otp = cToken;
//       otpCaptchaTimer(index);
//       btn.style.backgroundColor = "green";
//     });
// };
