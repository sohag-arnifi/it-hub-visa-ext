export const getSendOtpPayload = (item) => {
  const info = item?.info?.map((data) => {
    return {
      web_id: data?.web_id,
      name: data?.name,
      phone: data?.phone,
      email: data?.email,
      is_open: true,
      confirm_tos: true,
      center: {
        id: data?.center?.id,
        c_name: data?.center?.c_name,
        prefix: data?.center?.prefix,
      },
      ivac: {
        id: data?.ivac?.id,
        center_info_id: data?.ivac?.center_info_id,
        ivac_name: data?.ivac?.ivac_name,
        prefix: data?.ivac?.prefix,
        app_key: data?.ivac?.app_key,
      },
      visa_type: {
        id: data?.visa_type?.id,
        type_name: data?.visa_type?.type_name,
        is_active: data?.visa_type?.is_active,
      },
    };
  });

  return {
    _token: localStorage.getItem("_token"),
    apiKey: localStorage.getItem("apiKey"),
    action: "sendOtp",
    resend: item?.resend || 0,
    info,
  };
};

export const getVerifyOtpPayload = (item) => {
  const info = item?.info?.map((data) => {
    return {
      web_id: data?.web_id,
      name: data?.name,
      phone: data?.phone,
      email: data?.email,
      otp: item?.otp,
      is_open: true,
      confirm_tos: true,
      center: {
        id: data?.center?.id,
        c_name: data?.center?.c_name,
        prefix: data?.center?.prefix,
      },
      ivac: {
        id: data?.ivac?.id,
        center_info_id: data?.ivac?.center_info_id,
        ivac_name: data?.ivac?.ivac_name,
        prefix: data?.ivac?.prefix,
        app_key: data?.ivac?.app_key,
      },
      visa_type: {
        id: data?.visa_type?.id,
        type_name: data?.visa_type?.type_name,
        is_active: data?.visa_type?.is_active,
      },
    };
  });

  return {
    _token: localStorage.getItem("_token"),
    apiKey: localStorage.getItem("apiKey"),
    action: "verifyOtp",
    otp: item?.otp,
    info,
  };
};

export const getSlotPayload = (item, date) => {
  const info = item?.info?.map((data) => {
    return {
      web_id: data?.web_id,
      name: data?.name,
      phone: data?.phone,
      email: data?.email,
      otp: item?.otp,
      is_open: true,
      appointment_time: date,
      confirm_tos: true,
      amountChangeData: data?.amountChangeData,
      center: {
        id: data?.center?.id,
        c_name: data?.center?.c_name,
        prefix: data?.center?.prefix,
      },
      ivac: {
        id: data?.ivac?.id,
        center_info_id: data?.ivac?.center_info_id,
        ivac_name: data?.ivac?.ivac_name,
        prefix: data?.ivac?.prefix,
        app_key: data?.ivac?.app_key,
      },
      visa_type: {
        id: data?.visa_type?.id,
        type_name: data?.visa_type?.type_name,
        is_active: data?.visa_type?.is_active,
      },
    };
  });

  const data = {
    _token: localStorage.getItem("_token"),
    apiKey: localStorage.getItem("apiKey"),
    action: "generateSlotTime",
    amount: 10.0,
    ivac_id: info[0]?.ivac?.id,
    visa_type: info[0]?.visa_type?.id,
    specific_date: date,
    info,
  };
  return data;
};

export const getPayInvoicePayload = (item) => {
  const info = item?.info?.map((data) => {
    return {
      web_id: data?.web_id,
      name: data?.name,
      phone: data?.phone,
      email: data?.email,
      amount: 800.0,
      is_open: true,
      confirm_tos: true,
      amountChangeData: data?.amountChangeData,
      // otp: item?.otp,
      otp: "421242",
      // appointment_date: item?.specific_date,
      appointment_date: "2025-01-20",
      // appointment_time: item?.slotTime?.hour,
      appointment_time: 10,
      center: {
        id: data?.center?.id,
        c_name: data?.center?.c_name,
        prefix: data?.center?.prefix,
      },
      ivac: {
        id: data?.ivac?.id,
        center_info_id: data?.ivac?.center_info_id,
        ivac_name: data?.ivac?.ivac_name,
        prefix: data?.ivac?.prefix,
        app_key: data?.ivac?.app_key,
      },
      visa_type: {
        id: data?.visa_type?.id,
        type_name: data?.visa_type?.type_name,
        is_active: data?.visa_type?.is_active,
      },
    };
  });

  const data = {
    _token: localStorage.getItem("_token"),
    apiKey: localStorage.getItem("apiKey"),
    action: "payInvoice",
    info,
    selected_payment: {
      ...item?.selected_payment,
      grand_total: item?.info?.length * 824,
    },
    // selected_slot:  item?.slot_times?.length ? item?.slot_times[0] : {},
    selected_slot: {
      id: 142049,
      ivac_id: 17,
      visa_type: 13,
      hour: 10,
      date: "2024-10-17",
      availableSlot: 1,
      time_display: "10:00 - 10:59",
    },
    hash_params: item?.hash_params,
  };

  return data;
};
