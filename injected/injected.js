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

// const getRTL = async () => {
//   if (window.setRecaptchaTokenPay) {
//     window.grecaptcha.reset();
//     await new Promise((resolve) => setTimeout(resolve, 1500));
//     const url = document.getElementsByTagName("iframe")[0].src;
//     return url;
//   } else {
//     return "";
//   }
// };

// console.log(window.setRecaptchaToken);

// // const env = "development";
// const env = "production";

// const baseApi = env === "development" ? "/api/" : "/";

// const recaptchaSiteKey = document.getElementById("hashed-param");

// const grecaptcha = window?.grecaptcha;
// const csrfToken = window.csrf_token;
// let reCapthcaToken = "";

// console.log(
//   "recaptchaSiteKey",
//   recaptchaSiteKey,
//   "csrfToken",
//   csrfToken,
//   "reCapthcaToken:",
//   reCapthcaToken
// );

// const flattenData = (data, prefix = "") => {
//   const result = {};

//   for (const key in data) {
//     if (data.hasOwnProperty(key)) {
//       const prop = data[key];
//       const newKey = prefix ? `${prefix}[${key}]` : key;

//       if (typeof prop === "object" && !Array.isArray(prop)) {
//         // Recursively handle nested objects
//         Object.assign(result, flattenData(prop, newKey));
//       } else if (Array.isArray(prop)) {
//         // Handle arrays by indexing them
//         prop.forEach((item, index) => {
//           Object.assign(result, flattenData(item, `${newKey}[${index}]`));
//         });
//       } else {
//         // Handle simple values (strings, numbers, etc.)
//         result[newKey] = prop;
//       }
//     }
//   }

//   return result;
// };

// const data = [
//   {
//     _id: 1,
//     phone: "01873939410",
//     email: "pkshohag240@gmail.com",
//     otp: "",
//     files: {
//       _token: "91Vb4Ko8s3KKjrcaWb06fcsQ51nMgpFEfCaZBMPG",
//       apiKey: "91Vb4Ko8s3KKjrcaWb06fcsQ51nMgpFEfCaZBMPG",
//       action: "sendOtp",
//       info: [
//         {
//           web_id: "BGDRV3892F24",
//           web_id_repeat: "BGDRV3892F24",
//           passport: "",
//           name: "PROTASHA RANI ROY",
//           phone: "01760567555",
//           email: "pkshohag240@gmail.com",
//           amount: "800.00",
//           captcha: "",
//           center: {
//             id: 3,
//             c_name: "Rajshahi",
//             prefix: "R",
//             is_delete: 0,
//             created_by: "",
//             created_at: "",
//             updated_at: "",
//           },
//           is_open: true,
//           ivac: {
//             id: 2,
//             center_info_id: 3,
//             ivac_name: "IVAC , RAJSHAHI",
//             address:
//               "Morium Ali Tower,Holding No-18, Plot No-557, 1ST Floor,Old Bilsimla, Greater Road,Barnali More, 1ST Floor, Ward No-10,Rajshahi.",
//             prefix: "R",
//             ceated_on: "2017-08-30 13:06:20",
//             visa_fee: "800.00",
//             is_delete: 0,
//             created_at: "",
//             updated_at: "",
//             app_key: "IVACRAJSHAHI",
//             contact_number: "",
//             created_by: "",
//             charge: 3,
//             new_visa_fee: "800.00",
//             old_visa_fee: "800.00",
//             new_fees_applied_from: "2018-08-05 00:00:00",
//             notify_fees_from: "2018-07-29 04:54:32",
//             max_notification_count: 2,
//             allow_old_amount_until_new_date: 2,
//             notification_text_beside_amount:
//               "(From <from> this IVAC fees will be <new_amount> BDT)",
//             notification_text_popup: "",
//           },
//           amountChangeData: {
//             allow_old_amount_until_new_date: 2,
//             max_notification_count: 0,
//             old_visa_fees: "800.00",
//             new_fees_applied_from: "2018-08-05 00:00:00",
//             notice: false,
//             notice_short: "",
//             notice_popup: "",
//             new_visa_fee: "800.00",
//           },
//           visa_type: {
//             id: 13,
//             type_name: "MEDICAL/MEDICAL ATTENDANT VISA",
//             order: 2,
//             is_active: 1,
//             $$hashKey: "object:50",
//           },
//           otp: "",
//           confirm_tos: true,
//         },
//         {
//           phone: "01760567555",
//           email: "pkshohag240@gmail.com",
//           center: {
//             id: 3,
//             c_name: "Rajshahi",
//             prefix: "R",
//             is_delete: 0,
//             created_by: "",
//             created_at: "",
//             updated_at: "",
//           },
//           ivac: {
//             id: 2,
//             center_info_id: 3,
//             ivac_name: "IVAC , RAJSHAHI",
//             address:
//               "Morium Ali Tower,Holding No-18, Plot No-557, 1ST Floor,Old Bilsimla, Greater Road,Barnali More, 1ST Floor, Ward No-10,Rajshahi.",
//             prefix: "R",
//             ceated_on: "2017-08-30 13:06:20",
//             visa_fee: "800.00",
//             is_delete: 0,
//             created_at: "",
//             updated_at: "",
//             app_key: "IVACRAJSHAHI",
//             contact_number: "",
//             created_by: "",
//             charge: 3,
//             new_visa_fee: "800.00",
//             old_visa_fee: "800.00",
//             new_fees_applied_from: "2018-08-05 00:00:00",
//             notify_fees_from: "2018-07-29 04:54:32",
//             max_notification_count: 2,
//             allow_old_amount_until_new_date: 2,
//             notification_text_beside_amount:
//               "(From <from> this IVAC fees will be <new_amount> BDT)",
//             notification_text_popup: "",
//           },
//           visa_type: {
//             id: 13,
//             type_name: "MEDICAL/MEDICAL ATTENDANT VISA",
//             order: 2,
//             is_active: 1,
//             $$hashKey: "object:50",
//           },
//           amount: "800.00",
//           web_id: "BGDRV3893624",
//           web_id_repeat: "BGDRV3893624",
//           name: "BULLI RANI ROY",
//         },
//         {
//           phone: "01760567555",
//           email: "pkshohag240@gmail.com",
//           center: {
//             id: 3,
//             c_name: "Rajshahi",
//             prefix: "R",
//             is_delete: 0,
//             created_by: "",
//             created_at: "",
//             updated_at: "",
//           },
//           ivac: {
//             id: 2,
//             center_info_id: 3,
//             ivac_name: "IVAC , RAJSHAHI",
//             address:
//               "Morium Ali Tower,Holding No-18, Plot No-557, 1ST Floor,Old Bilsimla, Greater Road,Barnali More, 1ST Floor, Ward No-10,Rajshahi.",
//             prefix: "R",
//             ceated_on: "2017-08-30 13:06:20",
//             visa_fee: "800.00",
//             is_delete: 0,
//             created_at: "",
//             updated_at: "",
//             app_key: "IVACRAJSHAHI",
//             contact_number: "",
//             created_by: "",
//             charge: 3,
//             new_visa_fee: "800.00",
//             old_visa_fee: "800.00",
//             new_fees_applied_from: "2018-08-05 00:00:00",
//             notify_fees_from: "2018-07-29 04:54:32",
//             max_notification_count: 2,
//             allow_old_amount_until_new_date: 2,
//             notification_text_beside_amount:
//               "(From <from> this IVAC fees will be <new_amount> BDT)",
//             notification_text_popup: "",
//           },
//           visa_type: {
//             id: 13,
//             type_name: "MEDICAL/MEDICAL ATTENDANT VISA",
//             order: 2,
//             is_active: 1,
//             $$hashKey: "object:50",
//           },
//           amount: "800.00",
//           web_id: "BGDRV38AD324",
//           web_id_repeat: "BGDRV38AD324",
//           name: "DOYAL ROY",
//         },
//       ],
//       resend: 0,
//     },
//   },
//   {
//     _id: 2,
//     phone: "01760567555",
//     email: "shohagroy@yahoo.com",
//     otp: "",
//     files: {
//       _token: "91Vb4Ko8s3KKjrcaWb06fcsQ51nMgpFEfCaZBMPG",
//       apiKey: "91Vb4Ko8s3KKjrcaWb06fcsQ51nMgpFEfCaZBMPG",
//       action: "sendOtp",
//       info: [
//         {
//           web_id: "BGDRV38B4824",
//           web_id_repeat: "BGDRV38B4824",
//           passport: "",
//           name: "MOST RODIA TASNIM",
//           phone: "01760567555",
//           email: "shohagroy@yahoo.com",
//           amount: "800.00",
//           captcha: "",
//           center: {
//             id: 3,
//             c_name: "Rajshahi",
//             prefix: "R",
//             is_delete: 0,
//             created_by: "",
//             created_at: "",
//             updated_at: "",
//           },
//           ivac: {
//             id: 2,
//             center_info_id: 3,
//             ivac_name: "IVAC , RAJSHAHI",
//             address:
//               "Morium Ali Tower,Holding No-18, Plot No-557, 1ST Floor,Old Bilsimla, Greater Road,Barnali More, 1ST Floor, Ward No-10,Rajshahi.",
//             prefix: "R",
//             ceated_on: "2017-08-30 13:06:20",
//             visa_fee: "800.00",
//             is_delete: 0,
//             created_at: "",
//             updated_at: "",
//             app_key: "IVACRAJSHAHI",
//             contact_number: "",
//             created_by: "",
//             charge: 3,
//             new_visa_fee: "800.00",
//             old_visa_fee: "800.00",
//             new_fees_applied_from: "2018-08-05 00:00:00",
//             notify_fees_from: "2018-07-29 04:54:32",
//             max_notification_count: 2,
//             allow_old_amount_until_new_date: 2,
//             notification_text_beside_amount:
//               "(From <from> this IVAC fees will be <new_amount> BDT)",
//             notification_text_popup: "",
//           },
//           amountChangeData: {
//             allow_old_amount_until_new_date: 2,
//             max_notification_count: 0,
//             old_visa_fees: "800.00",
//             new_fees_applied_from: "2018-08-05 00:00:00",
//             notice: false,
//             notice_short: "",
//             notice_popup: "",
//             new_visa_fee: "800.00",
//           },
//           visa_type: {
//             id: 13,
//             type_name: "MEDICAL/MEDICAL ATTENDANT VISA",
//             order: 2,
//             is_active: 1,
//             $$hashKey: "object:50",
//           },
//           confirm_tos: true,
//           otp: "",
//           is_open: true,
//         },
//         {
//           phone: "01760567555",
//           email: "shohagroy@yahoo.com",
//           center: {
//             id: 3,
//             c_name: "Rajshahi",
//             prefix: "R",
//             is_delete: 0,
//             created_by: "",
//             created_at: "",
//             updated_at: "",
//           },
//           ivac: {
//             id: 2,
//             center_info_id: 3,
//             ivac_name: "IVAC , RAJSHAHI",
//             address:
//               "Morium Ali Tower,Holding No-18, Plot No-557, 1ST Floor,Old Bilsimla, Greater Road,Barnali More, 1ST Floor, Ward No-10,Rajshahi.",
//             prefix: "R",
//             ceated_on: "2017-08-30 13:06:20",
//             visa_fee: "800.00",
//             is_delete: 0,
//             created_at: "",
//             updated_at: "",
//             app_key: "IVACRAJSHAHI",
//             contact_number: "",
//             created_by: "",
//             charge: 3,
//             new_visa_fee: "800.00",
//             old_visa_fee: "800.00",
//             new_fees_applied_from: "2018-08-05 00:00:00",
//             notify_fees_from: "2018-07-29 04:54:32",
//             max_notification_count: 2,
//             allow_old_amount_until_new_date: 2,
//             notification_text_beside_amount:
//               "(From <from> this IVAC fees will be <new_amount> BDT)",
//             notification_text_popup: "",
//           },
//           visa_type: {
//             id: 13,
//             type_name: "MEDICAL/MEDICAL ATTENDANT VISA",
//             order: 2,
//             is_active: 1,
//             $$hashKey: "object:50",
//           },
//           amount: "800.00",
//           web_id: "BGDRV38B5424",
//           web_id_repeat: "BGDRV38B5424",
//           name: "MD FARUK HASAN",
//         },
//       ],
//       resend: 0,
//     },
//   },
// ];

// const style = document.createElement("style");
// style.innerHTML = `

// .checkerContainer {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   gap:1rem;
// }

// p {
//   fontSize: 14px;
//   color: black;
// }

//   #main-container {
//     height: 100vh;
//     width: 100vw;
//     position: fixed;
//     top: 0;
//     left: 0;
//     padding:1rem;
//     background-color: white;
//   }

//   .itemContainer{
//   display: flex;
//   justify-content: start;
//   align-items: center;
//   padding: 0.5rem;
//   margin: 10px 0px;
//   border: 1px solid #e0e0e0;
//   border-radius: 5px;
//   }

//   .otpSenderComponent{
//     width: 250px;
//     margin: 0 0.5rem;
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//   }
//      .verifyOtpComponent {
//       display: flex;
//       flex-direction: column;
//       justify-content: center;
//       align-items: center;
//     }
//     button {
//       padding: 0.5rem 1rem;
//       border-radius: 5px;
//       border: none;
//       cursor: pointer;
//     }

//     form {
//       display: flex;
//       flex-direction: column;
//       justify-content: center;
//       align-items: center;
//     }

//     input {
//     padding: 0.5rem 1rem;
//       border-radius: 5px;
//       margin: 0.5rem 0;
//     }

//     .dateSlotContainer {
//       width: 200px;
//       margin: 0 0.5rem;
//       display: flex;
//       flex-direction: column;
//       justify-content: center;
//       align-items: center;
//     }
// `;
// document.head.appendChild(style);
// const div = document.createElement("div");
// div.id = "main-container";

// const checkerSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// div.innerHTML = `
// <div class="checkerContainer">
//     <div>
//       ${checkerSteps
//         ?.map(
//           (item, index) =>
//             `<button class="checkerButton" style="padding: 0.5rem 1rem; border-radius: 5px; border: none; cursor: pointer; margin: 0 0.5rem" ${
//               index !== 0 ? "disabled" : ""
//             }>${item}</button>`
//         )
//         .join("")}
//     </div>
//   </div>

//  <div id="captchaContainer">

//  </div>

// </div>
//   <div>
//     ${data
//       ?.map((item, i) => {
//         const { files, phone } = item;
//         return `
//           <div class="itemContainer">
//             <p>${i + 1}.</p>
//             <p style="margin-left: 1rem">OTP Phone: <b>${phone}</b></p>
//             <div style="margin-left: 1rem">
//               ${files?.info?.map((info) => `<p>${info?.web_id}</p>`).join("")}
//             </div>

//             <div class="otpSenderComponent">
//             <button class="sendOtpButton">Send OTP</button>
//             <div class="message"></div>
//             </div>

//             <div class="verifyOtpComponent">
//               <form id="otpForm-${i}">
//                 <input type="number" class="otpInput" placeholder="Enter OTP" id="otpInput-${i}" required />
//                 <button id="verifyOtpButton-${i}" type="submit">Verify OTP</button>
//               </form>
//               <div class="message" id="message-${i}"></div>
//             </div>

//             <div class="dateSlotContainer">
//               <p id="date-${i}">Date: Not Found!</p>
//               <p id="time-${i}">Time: Not Found!</p>
//               <button style="margin-top: 0.2rem; display: none" id="bookSlotButton-${i}" class="bookSlotButton">Book Slot</button>
//               <div class="message" id="bookingMessage-${i}"></div>
//             </div>
//           </div>
//         `;
//       })
//       .join("")}
//   </div>
// `;

// document.body.appendChild(div);

// const checkerButtons = div.querySelectorAll(".checkerButton");
// let currentStep = 0;
// checkerButtons.forEach((button, index) => {
//   button.addEventListener("click", async () => {
//     const step = checkerSteps[index];

//     if (index === currentStep) {
//       if (step === 1) {
//         const response = await checkWebFile();

//         if (!response) {
//           if (currentStep < checkerButtons.length - 1) {
//             currentStep++;
//             checkerButtons[currentStep].disabled = false;
//           }
//         }
//       } else {
//         const response = await checkStepSession(step);

//         if (!response) {
//           if (currentStep < checkerButtons.length - 1) {
//             currentStep++;
//             checkerButtons[currentStep].disabled = false;
//           }
//         }
//       }
//     }
//   });
// });

// // Function to handle API call
// const checkWebFile = async () => {
//   const fileId = data[0].files?.info[0]?.web_id;
//   try {
//     const response = await fetch(`${baseApi}payment/check/${fileId}`, {
//       method: "GET",
//       headers: {
//         "x-requested-with": "XMLHttpRequest",
//       },
//       credentials: "include",
//     });

//     const responseData = await response.json();

//     return responseData;
//   } catch (error) {
//     return true;
//   }
// };
// const checkStepSession = async (step) => {
//   try {
//     const response = await fetch(`${baseApi}payment/check-step/${step}`, {
//       method: "GET",
//       headers: {
//         "x-requested-with": "XMLHttpRequest",
//       },
//       credentials: "include",
//     });

//     const responseData = await response.json();

//     return responseData;
//   } catch (error) {
//     return true;
//   }
// };

// // Add event listener to the OTP buttons
// const sendOtpButtons = div.querySelectorAll(".sendOtpButton");
// sendOtpButtons.forEach((button, index) => {
//   button.addEventListener("click", async () => {
//     const webFile = data[index];

//     const messageDiv = button
//       .closest(".otpSenderComponent")
//       .querySelector(".message");
//     messageDiv.innerHTML = "";

//     const fileInfo = webFile?.files.info?.map((item) => {
//       return {
//         web_id: item?.web_id,
//         web_id_repeat: item?.web_id_repeat,
//         name: item?.name,
//         phone: webFile?.phone,
//         email: webFile?.email,
//         amount: item?.amount,
//         center: {
//           id: item?.center?.id,
//           // c_name: item?.center?.c_name,
//           // prefix: item?.center?.prefix,
//         },
//         ivac: {
//           id: item?.ivac?.id,
//           ivac_name: item?.ivac?.ivac_name,
//           // address: item?.ivac?.address,
//           // visa_fee: item?.ivac?.visa_fee,
//           // charge: item?.ivac?.charge,
//           // new_visa_fee: item?.ivac?.new_visa_fee,
//           // notification_text_beside_amount:
//           // item?.ivac?.notification_text_beside_amount,
//         },
//         visa_type: {
//           id: item?.visa_type?.id,
//           type_name: item?.visa_type?.type_name,
//         },
//         confirm_tos: true,
//       };
//     });

//     const payload = {
//       _token: csrfToken,
//       apiKey: csrfToken,
//       action: "sendOtp",
//       info: fileInfo,
//       resend: 0,
//       hashed_param: reCapthcaToken,
//     };

//     // function setRecaptchaToken(token) {
//     //   console.log("CAPTCHA solved, token:", token);
//     // }

//     // const recaptchaSiteKey = document
//     //   .getElementById("hashed-param")
//     //   .getAttribute("data-hashed-param");

//     // console.log(recaptchaSiteKey);

//     try {
//       // payload.hashed_param = token;
//       button.innerText = "Sending...";
//       const response = await manageQueue(payload);
//       if (response?.code === 200) {
//         messageDiv.innerHTML = response?.message[0];
//         messageDiv.style.color = "green";
//       } else {
//         messageDiv.innerHTML = response?.message[0];
//         messageDiv.style.color = "red";
//       }
//       button.innerText = "Send OTP";

//       // grecaptcha((token) => {
//       //   console.log(token);
//       // });
//       // grecaptcha.ready(function () {
//       //   grecaptcha
//       //     .execute("6LfllosqAAAAAJ-Z6U9raYP9owwLL5RsUns5A6ZJ", {
//       //       action: "sendOtp",
//       //     })
//       //     .then(async function (token) {
//       //       payload.hashed_param = token;
//       //       button.innerText = "Sending...";
//       //       const response = await manageQueue(payload);
//       //       if (response?.code === 200) {
//       //         messageDiv.innerHTML = response?.message[0];
//       //         messageDiv.style.color = "green";
//       //       } else {
//       //         messageDiv.innerHTML = response?.message[0];
//       //         messageDiv.style.color = "red";
//       //       }
//       //       button.innerText = "Send OTP";
//       //     });
//       // });
//     } catch (error) {
//       console.log(error);
//       messageDiv.innerHTML = "Failed to send OTP. Please try again.";
//       messageDiv.style.color = "red";
//     }
//   });
// });

// const otpForms = document.querySelectorAll(".verifyOtpComponent form");

// function showMessage(messageElement, message, type) {
//   messageElement.textContent = message;

//   if (type === "success") {
//     messageElement.style.color = "green";
//   } else {
//     messageElement.style.color = "red";
//   }
// }

// let slot_dates = [];
// let slot_times = [];

// otpForms.forEach((form, i) => {
//   form.addEventListener("submit", async (event) => {
//     event.preventDefault();

//     const otpInput = document.getElementById(`otpInput-${i}`);
//     const otp = otpInput.value.trim();

//     const messageElement = document.getElementById(`message-${i}`);
//     const verifyOtpButton = document.getElementById(`verifyOtpButton-${i}`);

//     if (!otp || otp.length !== 6) {
//       showMessage(messageElement, "Please enter a valid 6-digit OTP.", "error");
//       return;
//     }

//     const webFile = data[i];

//     const fileInfo = webFile?.files?.info?.map((item) => {
//       return {
//         web_id: item?.web_id,
//         web_id_repeat: item?.web_id_repeat,
//         name: item?.name,
//         phone: webFile?.phone,
//         email: webFile?.email,
//         amount: item?.amount,
//         center: {
//           id: item?.center?.id,
//           // c_name: item?.center?.c_name,
//           // prefix: item?.center?.prefix,
//         },
//         ivac: {
//           id: item?.ivac?.id,
//           ivac_name: item?.ivac?.ivac_name,
//           // address: item?.ivac?.address,
//           // visa_fee: item?.ivac?.visa_fee,
//           // charge: item?.ivac?.charge,
//           // new_visa_fee: item?.ivac?.new_visa_fee,
//           // notification_text_beside_amount:
//           // item?.ivac?.notification_text_beside_amount,
//         },
//         visa_type: {
//           id: item?.visa_type?.id,
//           type_name: item?.visa_type?.type_name,
//         },
//         confirm_tos: item?.visa_type?.confirm_tos,
//         otp: otp,
//       };
//     });

//     const payload = {
//       _token: csrfToken,
//       apiKey: csrfToken,
//       action: "verifyOtp",
//       info: fileInfo,
//       otp: otp,
//     };

//     try {
//       verifyOtpButton.innerText = "Verifying...";
//       const response = await manageQueue(payload);

//       if (response?.code === 200) {
//         const dateElement = document.getElementById(`date-${i}`);
//         const timeElement = document.getElementById(`time-${i}`);
//         const bookSlotButton = document.getElementById(`bookSlotButton-${i}`);

//         slot_dates = response?.data?.slot_dates;
//         slot_times = response?.data?.slot_times;

//         bookSlotButton.style.display = "block";

//         dateElement.textContent = `Date: ${response?.data?.slot_dates[0]}`;
//         timeElement.textContent = `Time: ${response?.data?.slot_times[0]?.time_display}`;

//         showMessage(messageElement, "OTP verified successfully!", "success");
//       } else {
//         showMessage(messageElement, response?.message[0], "error");
//       }
//     } catch (error) {
//       showMessage(messageElement, "Something went wrong!", "error");
//       return;
//     }
//     verifyOtpButton.innerText = "Verify OTP";
//   });
// });

// const manageQueue = async (data) => {
//   const flattenedPayload = flattenData(data);

//   const formData = new URLSearchParams(flattenedPayload).toString();
//   const response = await fetch(`${baseApi}queue-manage`, {
//     method: "POST",
//     headers: {
//       Accept: "application/x-www-form-urlencoded;charset=UTF-8;",
//       priority: "u=1, i",
//       "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8;",
//       "x-requested-with": "XMLHttpRequest",
//     },
//     body: formData,
//     credentials: "include",
//   });

//   return response.json();
// };

// const dateSlotButtons = document.querySelectorAll(".dateSlotContainer button");
// dateSlotButtons.forEach((button, i) => {
//   button.addEventListener("click", async () => {
//     const webFile = data[i];

//     const messageElement = document.getElementById(`bookingMessage-${i}`);
//     const otp = document.getElementById(`otpInput-${i}`).value.trim();
//     const fileInfo = webFile?.files?.info?.map((item) => {
//       return {
//         web_id: item?.web_id,
//         web_id_repeat: item?.web_id_repeat,
//         name: item?.name,
//         phone: webFile?.phone,
//         email: webFile?.email,
//         amount: item?.amount,
//         center: {
//           id: item?.center?.id,
//           // c_name: item?.center?.c_name,
//           // prefix: item?.center?.prefix,
//         },
//         ivac: {
//           id: item?.ivac?.id,
//           ivac_name: item?.ivac?.ivac_name,
//           // address: item?.ivac?.address,
//           // visa_fee: item?.ivac?.visa_fee,
//           // charge: item?.ivac?.charge,
//           // new_visa_fee: item?.ivac?.new_visa_fee,
//           // notification_text_beside_amount:
//           // item?.ivac?.notification_text_beside_amount,
//         },
//         visa_type: {
//           id: item?.visa_type?.id,
//           type_name: item?.visa_type?.type_name,
//         },
//         confirm_tos: true,
//         appointment_date: slot_dates[0],
//         appointment_time: slot_times[0].appointment_time.hour,
//         otp: otp,
//       };
//     });

//     const payload = {
//       _token: csrfToken,
//       apiKey: csrfToken,
//       action: "payInvoice",
//       info: fileInfo,
//       otp: otp,
//       selected_slot: slot_times[0].appointment_time,
//       selected_payment: {
//         name: "Bkash",
//         slug: "bkash",
//         grand_total: fileInfo.length * 824,
//         link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/bkash.png",
//       },
//     };

//     try {
//       button.innerText = "Booking...";
//       const response = await slotBookHandler(payload);
//       console.log(response);
//     } catch (error) {
//       console.log(error);
//       showMessage(messageElement, "Something went wrong!", "error");
//       return;
//     }
//     button.innerText = "Book Slot";
//   });
// });

// const slotBookHandler = async (payload) => {
//   const flattenedPayload = flattenData(payload);

//   const formData = new URLSearchParams(flattenedPayload).toString();
//   const response = await fetch(`${baseApi}slot_pay_now`, {
//     method: "POST",
//     headers: {
//       Accept: "application/x-www-form-urlencoded;charset=UTF-8;",
//       priority: "u=1, i",
//       "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8;",
//       "x-requested-with": "XMLHttpRequest",
//     },
//     body: formData,
//     credentials: "include",
//   });

//   return response.json();
// };

// // const capContainer = document.getElementById("captchaContainer");

// // const capContainer = document.getElementById("captchaContainer");

// // // Create the iframe element
// // const capIframe = document.createElement("iframe");
// // capIframe.title = "reCAPTCHA";
// // capIframe.width = "304";
// // capIframe.height = "78";
// // capIframe.role = "presentation";
// // capIframe.name = "a-cp2kxwj9bghk";
// // capIframe.frameBorder = "0";
// // capIframe.scrolling = "no";
// // capIframe.sandbox =
// //   "allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation allow-modals allow-popups-to-escape-sandbox allow-storage-access-by-user-activation";

// // // Set the src URL for the reCAPTCHA iframe (using your site key)
// // capIframe.src =
// //   "https://www.google.com/recaptcha/api2/anchor?ar=1&k=6LdOCpAqAAAAAOLNB3Vwt_H7Nw4GGCAbdYm5Brsb&co=aHR0cHM6Ly9wYXltZW50Lml2YWNiZC5jb206NDQz&hl=en&v=pPK749sccDmVW_9DSeTMVvh2&size=normal&cb=sti0ncnew1d";

// // // Append the iframe to the container
// // capContainer.appendChild(capIframe);

// // const gCapScript = document.createElement("script");
// // gCapScript.src =
// //   "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
// // gCapScript.async = true;
// // gCapScript.defer = true;
// // document.body.appendChild(gCapScript);

// // // Callback function when the reCAPTCHA script is loaded
// // window.onRecaptchaLoad = function () {
// //   // Render the reCAPTCHA
// //   grecaptcha.render("captchaContainer", {
// //     sitekey: "6LdOCpAqAAAAAOLNB3Vwt_H7Nw4GGCAbdYm5Brsb", // Your reCAPTCHA site key
// //     callback: function (token) {
// //       console.log("reCAPTCHA solved, token:", token);
// //       // Use the token for further validation (e.g., sending to the server)
// //     },
// //   });
// // };

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

// // const gCapScript = document.createElement("script");
// // gCapScript.src = "https://www.google.com/recaptcha/api.js";
// // gCapScript.async = true;
// // gCapScript.defer = true;
// // capContainer.appendChild(gCapScript);

// // const capDiv = document.createElement("div");
// // capDiv.innerHTML = `<div class="g-recaptcha" data-sitekey="${"6LdOCpAqAAAAAOLNB3Vwt_H7Nw4GGCAbdYm5Brsb"}" data-callback="getRecaptchaToken"></div>`;
// // capContainer.appendChild(capDiv);
// // window.getRecaptchaToken = function (token) {
// //   console.log("CAPTCHA solved, token:", token);
// //   reCapthcaToken = token;
// // };
