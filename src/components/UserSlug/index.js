import React, { useState } from "react";
import VerifyedOTP from "../VerifyedOTP";
import WebFileContainer from "../WebfileContainer";

const UserSlug = ({ data, csrfToken, checkerFile }) => {
  const [phoneNumbers, setPhoneNumbers] = useState(() => {
    const data = localStorage.getItem("phoneNumbers");
    return data ? JSON.parse(data) : [];
  });

  const [otp, setOtp] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [slotTime, setSlotTime] = useState("");

  return (
    <div>
      <VerifyedOTP
        key={data?.id}
        setPhoneNumbers={setPhoneNumbers}
        phoneNumbers={phoneNumbers}
        checkerFile={checkerFile}
        setOtp={setOtp}
        otp={otp}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        slotTime={slotTime}
        setSlotTime={setSlotTime}
        csrfToken={csrfToken}
        slugId={data?.id}
      />

      {slotTime?.success && (
        <WebFileContainer
          key={data?.id + "webfile"}
          data={data?.visaFiles}
          slotTime={slotTime}
          selectedDate={selectedDate}
          otp={otp}
          csrfToken={csrfToken}
        />
      )}
    </div>
  );
};

export default UserSlug;
