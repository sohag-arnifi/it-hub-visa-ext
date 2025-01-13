export const centers = {
  1: {
    id: 1,
    c_name: "Dhaka",
    prefix: "D",
    is_delete: 0,
  },
  3: {
    id: 3,
    c_name: "Rajshahi",
    prefix: "R",
    is_delete: 0,
  },
};

export const ivacs = {
  2: {
    id: 2,
    center_info_id: 3,
    ivac_name: "IVAC , RAJSHAHI",
    address:
      "Morium Ali Tower,Holding No-18, Plot No-557, 1ST Floor,Old Bilsimla, Greater Road,Barnali More, 1ST Floor, Ward No-10,Rajshahi.",
    prefix: "R",
    ceated_on: "2017-08-30 13:06:20",
    visa_fee: 800.0,
    is_delete: 0,
    app_key: "IVACRAJSHAHI",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
    notification_text_popup: "",
  },
  17: {
    id: 17,
    center_info_id: 1,
    ivac_name: "IVAC, Dhaka (JFP)",
    address: "Jamuna Future Park",
    prefix: "D",
    ceated_on: "2018-07-12 05:58:00",
    visa_fee: 800.0,
    is_delete: 0,
    created_at: "2018-07-12 00:00:00",
    updated_at: "",
    app_key: "IVACJFP",
    contact_number: "",
    created_by: "",
    charge: 3,
    new_visa_fee: 800.0,
    old_visa_fee: 800.0,
    new_fees_applied_from: "2018-08-05 00:00:00",
    notify_fees_from: "2018-07-29 04:54:32",
    max_notification_count: 2,
    allow_old_amount_until_new_date: 2,
    notification_text_beside_amount:
      "(From <from> this IVAC fees will be <new_amount> BDT)",
    notification_text_popup: "",
  },
};

export const visaTypes = {
  13: {
    id: 13,
    type_name: "MEDICAL/MEDICAL ATTENDANT VISA",
    order: 2,
    is_active: 1,
    $$hashKey: "object:50",
  },
};

const amountChangeData = {
  allow_old_amount_until_new_date: 2,
  max_notification_count: 0,
  old_visa_fees: "800.00",
  new_fees_applied_from: "2018-08-05 00:00:00",
  notice: false,
  notice_short: "",
  notice_popup: "",
  new_visa_fee: "800.00",
};

export const selectedCenter = (id) => {
  return centers[id];
};

export const selectedIvac = (id) => {
  return ivacs[id];
};

export const selectedVisaType = (id) => {
  return visaTypes[id];
};

export const getAmountChangeData = () => {
  return amountChangeData;
};

export const getOtpPayload = (item) => {
  const csrfToken = localStorage.getItem("csrfToken");

  const info = item?.info?.map((data) => {
    return {
      web_id: data?.web_id,
      web_id_repeat: data?.web_id,
      name: data?.name,
      phone: item?.phone,
      email: item?.email,
      amount: 800.0,
      is_open: true,
      center: centers[item?.center],
      ivac: ivacs[item?.ivac],
      visa_type: visaTypes[item?.type],
      amountChangeData,
      confirm_tos: true,
    };
  });

  const data = {
    _token: csrfToken,
    apiKey: csrfToken,
    action: "sendOtp",
    info,
    resend: 0,
  };

  return data;
};
