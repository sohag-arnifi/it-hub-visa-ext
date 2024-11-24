import React, { useState } from "react";

import { format, addDays } from "date-fns";
import GlobalButton from "../../UI/GlobalButton";
import {
  useGenerateSlotTimeMutation,
  useManageQueueMutation,
} from "../../redux/features/appApi/appApi";

const getNextAvailableDate = () => {
  let date = addDays(new Date(), 1);

  if (date.getDay() === 5) {
    date = addDays(date, 2); // Move to Sunday
  }

  // Format the date as "YYYY-MM-DD"
  return format(date, "yyyy-MM-dd");
};

const VerifyedOTP = ({
  checkerFile,
  setOtp,
  otp,
  selectedDate,
  setSelectedDate,
  slotTime,
  setSlotTime,
  csrfToken,
  setPhoneNumbers,
  phoneNumbers,
  slugId,
}) => {
  const [sendResponse, setSentResponse] = useState(null);
  const [verifyResponse, setVerifyResponse] = useState(null);
  const slugPhone = phoneNumbers?.find((item) => item.slug === slugId)?.phone;
  const [phone, setPhone] = useState(slugPhone);
  const [loadingState, setLoadingState] = useState("");

  const [manageQueue, { isLoading: queueLoading, isFetching }] =
    useManageQueueMutation();
  const [generateSlotTime, { isLoading: timeSlotLoading }] =
    useGenerateSlotTimeMutation();

  const sendOtp = async () => {
    setLoadingState("send");
    checkerFile._token = csrfToken;
    checkerFile.apiKey = csrfToken;
    checkerFile.resend = 0;
    checkerFile.action = "sendOtp";

    checkerFile?.info?.forEach((item) => {
      item.phone = phone;
    });
    checkerFile.resend = sendResponse?.success ? 1 : 0;

    try {
      const response = await manageQueue(checkerFile).unwrap();
      console.log(response);

      if (response?.code === 200) {
        setSentResponse({
          success: true,
          message: response?.message[0],
        });
      } else {
        setSentResponse({
          success: false,
          message: response?.message[0],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyOtp = async () => {
    setLoadingState("verify");
    checkerFile._token = csrfToken;
    checkerFile.apiKey = csrfToken;

    checkerFile.action = "verifyOtp";
    checkerFile.otp = otp;

    checkerFile?.info?.forEach((item) => {
      item.otp = otp;
    });
    delete checkerFile.resend;

    try {
      const response = await manageQueue(checkerFile).unwrap();
      console.log(response);

      if (response?.code === 200) {
        const firstDate = response?.data?.slot_dates[0];

        setVerifyResponse({
          success: true,
          message: "OTP Verified",
          data: {
            ...response?.data,
            slot_dates: [
              firstDate
                ? [...response?.data?.slot_dates]
                : getNextAvailableDate(),
            ],
          },
        });

        setSelectedDate(firstDate ?? getNextAvailableDate());
      } else {
        setVerifyResponse({
          success: false,
          message: response?.message[0],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(
    (queueLoading || isFetching) && loadingState === "send" ? true : false
  );

  const getDateSlotHandlar = async () => {
    checkerFile._token = csrfToken;
    checkerFile.apiKey = csrfToken;
    checkerFile.action = "generateSlotTime";
    checkerFile?.info?.forEach((item) => {
      item.appointment_time = selectedDate;
      item.otp = otp;
    });
    checkerFile.specific_date = selectedDate;
    delete checkerFile.resend;

    try {
      const response = await generateSlotTime(checkerFile).unwrap();
      console.log(response);

      if (response?.status === "OK") {
        setSlotTime({
          success: true,
          message: "Slot Time Get Successfully",
          data: {
            ...response,
          },
        });
      } else {
        setSlotTime({
          success: false,
          message: response?.message[0],
          data: {
            ...response,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePhoneNumber = () => {
    if (phone?.length !== 11) {
      window.alert("Please enter a valid phone number");
    } else {
      const phoneData = {
        slug: slugId,
        phone: phone,
      };
      const remaining = phoneNumbers?.filter((item) => item?.slug !== slugId);
      setPhoneNumbers([...remaining, phoneData]);
      localStorage.setItem(
        "phoneNumbers",
        JSON.stringify([...remaining, phoneData])
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div>
        <input
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
          type="text"
          style={{
            height: "40px",
            width: "200px",
            border: "none",
            padding: "0px 30px",
            borderRadius: "20px 0px 0px 20px",
            fontSize: "14px",
            fontWeight: "semibold",
          }}
          placeholder="Enter Phone Number"
        />
        <button
          onClick={handlePhoneNumber}
          style={{
            height: "40px",
            width: "100px",
            fontSize: "14px",
            fontWeight: "bold",
            backgroundColor: slugPhone !== phone ? "red" : "green",
            color: "white",
            border: "none",
            borderRadius: "0px 20px 20px 0px",
            cursor: "pointer",
          }}
        >
          {!slugPhone ? "Add" : slugPhone !== phone ? "Update" : "Updated"}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GlobalButton
          onClick={sendOtp}
          loading={(queueLoading || isFetching) && loadingState === "send"}
          disabled={phone?.length !== 11 || slugPhone !== phone}
        >
          {sendResponse?.success ? "Resend OTP" : "Send OTP"}
        </GlobalButton>

        {sendResponse && (
          <p
            style={{
              color: sendResponse?.success ? "green" : "red",
              fontSize: "12px",
              fontWeight: "bold",
              padding: "0.2rem",
            }}
          >
            {sendResponse?.message}
          </p>
        )}
      </div>

      {sendResponse?.success && (
        <div>
          <input
            onChange={(e) => setOtp(e.target.value)}
            value={otp}
            type="number"
            style={{
              height: "40px",
              width: "200px",
              border: "none",
              padding: "0px 30px",
              borderRadius: "20px 0px 0px 20px",
              fontSize: "14px",
              fontWeight: "semibold",
            }}
            placeholder="Enter OTP"
          />
          <button
            onClick={verifyOtp}
            disabled={!otp}
            style={{
              height: "40px",
              width: "100px",
              fontSize: "14px",
              fontWeight: "bold",
              backgroundColor: "#1565c0",
              color: "white",
              border: "none",
              borderRadius: "0px 20px 20px 0px",
              cursor: otp ? "pointer" : "not-allowed",
            }}
          >
            {(queueLoading || isFetching) && loadingState === "verify"
              ? "Verifying..."
              : "Verify OTP"}
          </button>
          {verifyResponse && (
            <p
              style={{
                color: verifyResponse?.success ? "green" : "red",
                fontSize: "12px",
                fontWeight: "bold",
                padding: "0.2rem",
                textAlign: "center",
              }}
            >
              {verifyResponse?.message}
            </p>
          )}
        </div>
      )}

      {verifyResponse?.success && (
        <>
          <div>
            <select
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                height: "40px",
                width: "200px",
                border: "none",
                padding: "0px 30px",
                borderRadius: "20px 0px 0px 20px",
                fontSize: "14px",
                fontWeight: "semibold",
              }}
            >
              {verifyResponse?.data?.slot_dates?.map((date) => {
                return (
                  <option key={date} value={date}>
                    {date}
                  </option>
                );
              })}
            </select>

            <button
              onClick={getDateSlotHandlar}
              style={{
                height: "40px",
                width: "100px",
                fontSize: "14px",
                fontWeight: "bold",
                backgroundColor: "#1565c0",
                color: "white",
                border: "none",
                borderRadius: "0px 20px 20px 0px",
                cursor: "pointer",
              }}
            >
              {timeSlotLoading ? "Geting Slots..." : "Date Slot"}
            </button>

            {slotTime && (
              <p
                style={{
                  color: slotTime?.success ? "green" : "red",
                  fontSize: "12px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {slotTime?.message}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VerifyedOTP;
