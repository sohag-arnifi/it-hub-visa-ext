import React, { useState } from "react";
import { usePayInvoiceMutation } from "../../redux/features/appApi/appApi";
import LoadingSpinner from "../../UI/LoadingSpinner";

const Button = ({ onClick, children, loading, disabled, type }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const baseStyle = {
    height: "40px",
    width: "100%",
    fontSize: "1rem",
    fontWeight: "semibold",
    borderRadius: "5px",
    backgroundColor: type
      ? type === "secondary"
        ? "green"
        : "red"
      : "#1565c0",
    color: "white",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.2 : 1,
    transition: "background-color 0.3s, transform 0.1s",
  };

  const hoverStyle = isHovered
    ? { backgroundColor: "#1565c0", opacity: 0.8 }
    : {};

  const activeStyle = isActive
    ? { backgroundColor: "#0d47a1", transform: "scale(0.98)" }
    : {};

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        ...baseStyle,
        ...hoverStyle,
        ...activeStyle,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
    >
      {loading ? <LoadingSpinner /> : children}
    </button>
  );
};

const paymentOptions = {
  1: {
    name: "Bkash",
    slug: "bkash",
    grand_total: 10.2912621,
    link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/bkash.png",
  },
  7: {
    name: "Nagad",
    slug: "nagad",
    grand_total: 10.2912621,
    link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/nagad.png",
  },
  0: {
    name: "DBBL MOBILE BANKING",
    slug: "dbblmobilebanking",
    grand_total: 10.2912621,
    link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/dbblmobilebank.png",
  },
};

const FileContainer = ({
  file,
  slotTime,
  otp,
  selectedDate,
  csrfToken,
  retrying,
  timeOut,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [selectedTimeSlotIndex, setSelectedTimeSlotIndex] = useState(0);

  const [payInvoice, { isLoading }] = usePayInvoiceMutation();

  const handleSelect = (key, file) => {
    setActiveFile(file);
    setSelectedOption(key);
  };

  const confirmNowHandlar = async () => {
    const fileInfo = activeFile?.info?.map((item) => {
      return {
        web_id: item?.web_id,
        web_id_repeat: item?.web_id_repeat,
        name: item?.name,
        phone: item?.phone,
        email: item?.email,
        amount: item?.amount,
        center: {
          id: item?.center?.id,
          // c_name: item?.center?.c_name,
          // prefix: item?.center?.prefix,
        },
        ivac: {
          id: item?.ivac?.id,
          ivac_name: item?.ivac?.ivac_name,
          // address: item?.ivac?.address,
          // visa_fee: item?.ivac?.visa_fee,
          // charge: item?.ivac?.charge,
          // new_visa_fee: item?.ivac?.new_visa_fee,
          // notification_text_beside_amount:
          // item?.ivac?.notification_text_beside_amount,
        },
        visa_type: {
          id: item?.visa_type?.id,
          type_name: item?.visa_type?.type_name,
        },
        confirm_tos: item?.visa_type?.confirm_tos,
        appointment_date: selectedDate,
        otp: otp,
      };
    });

    const data = {
      _token: csrfToken,
      apiKey: csrfToken,
      action: "payInvoice",
      info: fileInfo,
      otp: otp,
      selected_slot: slotTime?.data?.slot_times[selectedTimeSlotIndex],
      selected_payment: {
        ...paymentOptions[selectedOption],
        grand_total: activeFile?.info?.length * 824,
      },
    };

    console.log(data);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let attempt = 0;

    while (attempt < retrying) {
      try {
        const response = await payInvoice(data).unwrap();
        console.log(response);
        break;
      } catch (error) {
        console.log(error);
        const statusCode = error?.response?.status;

        if (statusCode === 504) {
          setVerifyResponse({
            success: false,
            message: `Attempt: ${attempt + 1} - 504 Gateway Timeout error.}`,
          });
        } else if (statusCode === 502) {
          setVerifyResponse({
            success: false,
            message: `Attempt: ${attempt + 1} - 502 Gateway Timeout error.}`,
          });
        } else {
          setVerifyResponse({
            success: false,
            message: `Attempt: ${attempt + 1} - ${"Unknown error occurred"}- ${
              error?.status
            }`,
          });
        }
      }
      attempt += 1;
      await delay(timeOut); // 1-second timeout
    }

    // try {
    //   activeFile._token = csrfToken;
    //   activeFile.apiKey = csrfToken;
    //   activeFile.action = "payInvoice";
    //   activeFile?.info?.forEach((item) => {
    //     item.appointment_date = selectedDate;
    //     item.otp = otp;
    //   });

    //   activeFile.selected_payment = {
    //     ...paymentOptions[selectedOption],
    //     grand_total: activeFile?.info?.length * 824,
    //   };

    //   activeFile.otp = otp;
    //   activeFile.selected_slot =
    //     slotTime?.data?.slot_times[selectedTimeSlotIndex];
    //   delete activeFile.resend;

    //   const response = await payInvoice(activeFile).unwrap();
    //   console.log("response", response);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <div
      style={{
        backgroundColor: "#F5F7F8",
        borderRadius: "5px",
        border: "1px solid #E4E0E1",
        width: "300px",
        height: "400px",
        padding: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
        flexDirection: "column",
      }}
    >
      <div>
        <p>Web File - {file?.info?.length}</p>
        {file?.info?.map((info, i) => {
          return (
            <div key={i}>
              <p
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  lineHeight: "none",
                  margin: "0px",
                  padding: "0px",
                }}
              >
                {i + 1}. {info?.web_id}
              </p>

              <p
                style={{
                  fontSize: "1rem",
                  fontWeight: "semibold",
                  lineHeight: "none",
                  margin: "0px",
                  padding: "0px",
                  marginLeft: "20px",
                }}
              >
                {info?.name}
              </p>
            </div>
          );
        })}
      </div>

      <div
        style={{
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {Object.keys(paymentOptions).map((key, i) => (
            <div
              key={i}
              onClick={() => handleSelect(key, file)}
              style={{
                display: "flex",
                width: "30%",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                  borderRadius: "5px",
                  boxShadow:
                    activeFile?.apiKey === file?.apiKey &&
                    key === selectedOption
                      ? "rgba(0, 0, 0, 0.24) 0px 3px 8px"
                      : "",
                  position: "relative",
                  transition: "all .3s ease",
                }}
              >
                <img
                  src={paymentOptions[key]?.link}
                  alt={key}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "contain",
                  }}
                />

                {activeFile?.apiKey === file?.apiKey &&
                  key === selectedOption && (
                    <div
                      style={{
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        width: "100%",
                        zIndex: 10,
                        backgroundColor: "rgba(144, 238, 144, 0.4)",
                        color: "#2f4f4f",
                      }}
                    >
                      <p
                        style={{
                          textAlign: "center",
                          fontSize: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        Selected
                      </p>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            width: "100%",
            marginTop: ".5rem",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <select
            onChange={(e) => setSelectedTimeSlotIndex(e.target.value)}
            style={{ width: "100%", padding: "5px" }}
          >
            {slotTime?.data?.slot_times?.map((time, i) => {
              return (
                <option key={i} value={i}>
                  {time?.time_display} ({time?.availableSlot})
                </option>
              );
            })}
          </select>

          <Button
            loading={isLoading}
            onClick={confirmNowHandlar}
            disabled={
              selectedTimeSlotIndex === null ||
              activeFile?.apiKey !== file?.apiKey
            }
          >
            Confirm Now
          </Button>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Button
              type={"secondary"}
              loading={false}
              onClick={() => {}}
              disabled={false}
            >
              Pay Now
            </Button>

            <Button
              loading={false}
              onClick={() => {}}
              disabled={false}
              type={"base"}
            >
              Copy Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WebFileContainer = ({
  data,
  slotTime,
  selectedDate,
  otp,
  csrfToken,
  timeOut,
  retrying,
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {data?.map((slugFile, i) => {
        const file = JSON.parse(slugFile?.appointmentFile);
        return (
          <FileContainer
            key={i}
            file={file}
            slotTime={slotTime}
            selectedDate={selectedDate}
            otp={otp}
            csrfToken={csrfToken}
            retrying={retrying}
            timeOut={timeOut}
          />
        );
      })}
    </div>
  );
};

export default WebFileContainer;
