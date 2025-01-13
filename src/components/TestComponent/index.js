import React from "react";
import { useManageQueueMutation } from "../../redux/features/appApi/appApi";
import CheckerSection from "../CheckerSection";

const TestComponent = ({ gToken, csrf_token }) => {
  const [manageQueue, { isLoading: queueLoading, isFetching }] =
    useManageQueueMutation();
  const data = {
    _token: csrf_token,
    apiKey: csrf_token,
    action: "sendOtp",
    info: [
      {
        web_id: "BGDDW1B9CB24",
        web_id_repeat: "BGDDW1B9CB24",
        passport: "",
        name: "NIRENDRO NATH ROY",
        phone: "01760567555",
        email: "anathroy010@gmail.com",
        amount: 800.0,
        captcha: "",
        center: {
          id: 1,
          c_name: "Dhaka",
          prefix: "D",
          is_delete: 0,
          created_by: "",
          created_at: "",
          updated_at: "",
        },
        is_open: true,
        ivac: {
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
        amountChangeData: {
          allow_old_amount_until_new_date: 2,
          max_notification_count: 0,
          old_visa_fees: 800.0,
          new_fees_applied_from: "2018-08-05 00:00:00",
          notice: false,
          notice_short: "",
          notice_popup: "",
          new_visa_fee: 800.0,
        },
        visa_type: {
          id: 13,
          type_name: "MEDICAL/MEDICAL ATTENDANT VISA",
          order: 2,
          is_active: 1,
          $$hashKey: "object:50",
        },
        confirm_tos: true,
      },
    ],
    resend: 0,
    hashed_param: gToken,
  };

  const handleSendOtp = async () => {
    const response = await manageQueue(data).unwrap();
    console.log(response);

    console.log("click");
  };

  return (
    <div>
      <CheckerSection checkerFile={data} />
      <button onClick={handleSendOtp}>call</button>
    </div>
  );
};

export default TestComponent;
