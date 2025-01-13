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

  // const itemCopy = { ...item };
  // delete itemCopy.hash_params;
  // delete itemCopy.otp;
  // delete itemCopy.slot_dates;

  // const info = itemCopy?.info?.map((data) => {
  //   const updatedData = { ...data };
  //   delete updatedData.otp;
  //   delete updatedData.amountChangeData;
  //   delete updatedData.slot_dates;
  //   return updatedData;
  // });
  // return {
  //   ...itemCopy,
  //   info,
  //   action: "sendOtp",
  //   _token: localStorage.getItem("_token"),
  //   apiKey: localStorage.getItem("apiKey"),
  // };
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

  // const itemCopy = { ...item };
  // delete itemCopy.hash_params;
  // delete delete itemCopy.slot_dates;

  // const info = itemCopy?.info?.map((data) => {
  //   const updatedData = { ...data };
  //   delete updatedData.amountChangeData;
  //   delete updatedData.slot_dates;

  //   return {
  //     ...data,
  //     otp: item?.otp,
  //   };
  // });

  // return {
  //   ...itemCopy,
  //   action: "verifyOtp",
  //   _token: localStorage.getItem("_token"),
  //   apiKey: localStorage.getItem("apiKey"),
  //   info,
  // };
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
    specific_date: date,
    otp: item?.otp,
    amount: 10.0,
    ivac_id: info[0]?.ivac?.id,
    visa_type: info[0]?.visa_type?.id,
    info,
  };
  return data;

  // const itemCopy = { ...item };
  // delete itemCopy.hash_params;
  // delete itemCopy.slot_dates;
  // let ivacId = "";
  // let visaTypeId = "";
  // const info = item?.info?.map((data) => {
  //   const updatedData = { ...data };
  //   delete updatedData.slot_dates;
  //   ivacId = updatedData?.ivac?.id;
  //   visaTypeId = updatedData?.visa_type?.id;
  //   return {
  //     ...updatedData,
  //     amount: 800.0,
  //     is_open: true,
  //     confirm_tos: true,
  //     appointment_time: date,
  //   };
  // });
  // const data = {
  //   ...itemCopy,
  //   action: "verifyOtp",
  //   _token: localStorage.getItem("_token"),
  //   apiKey: localStorage.getItem("apiKey"),
  //   action: "generateSlotTime",
  //   amount: 10.0,
  //   ivac_id: ivacId,
  //   visa_type: visaTypeId,
  //   info,
  //   specific_date: date,
  // };
  // return data;
};

// return {
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
      otp: item?.otp,
      appointment_date: item?.specific_date,
      appointment_time: item?.slotTime?.hour,
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

  // const info = itemCopy?.info?.map((data) => {
  //   const updatedData = { ...data };
  //   delete updatedData.slot_dates;
  //   delete updatedData.slot_times;

  //   return {
  //     ...updatedData,
  //     amount: 800.0,
  //     is_open: true,
  //     confirm_tos: true,
  //     otp: item?.otp,
  //     appointment_date: item?.slot_dates?.length ? item?.slot_dates[0] : "",
  //     appointment_time: item?.slot_times?.length
  //       ? item?.slot_times[0]?.hour
  //       : "",
  //   };
  // });

  const data = {
    _token: localStorage.getItem("_token"),
    apiKey: localStorage.getItem("apiKey"),
    action: "payInvoice",
    info,
    otp: item?.otp,
    selected_slot: item?.slot_times?.length ? item?.slot_times[0] : {},
    selected_payment: {
      name: "Bkash",
      slug: "bkash",
      grand_total: info.length * 824,
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/bkash.png",
    },
    hash_params: item?.hash_params,
  };

  return data;
};
