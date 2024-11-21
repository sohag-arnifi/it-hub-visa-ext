import axios from "axios";
import React, { useEffect, useState } from "react";
import CheckerSection from "./components/CheckerSection";
import Header from "./components/Header/Header";
import UserSlug from "./components/UserSlug";
import SlugButton from "./UI/SlugButton";
import { useAppDispatch, useAppSelector } from "./redux/store";
import {
  setCsrfToken,
  setUserSlugData,
} from "./redux/features/appApi/appSlice";
import envConfig from "./configs/envConfig";

const App = ({ user }) => {
  const [initialLoading, setInitialLoading] = useState(false);
  const [activeSlug, setActiveSlug] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");

  const dispatch = useAppDispatch();
  const { csrfToken, userSlugData } = useAppSelector((state) => state?.app);

  const checkerFile =
    userSlugData?.length &&
    userSlugData[activeSlug].visaFiles?.length &&
    JSON.parse(userSlugData[activeSlug]?.visaFiles[0]?.appointmentFile ?? {});

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${envConfig.backendApi}/service-slug/${user?.id}`)
      .then((res) => {
        if (res?.data?.success) {
          dispatch(setUserSlugData(res?.data?.data));
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsError(error?.message ?? "Something went wrong");
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setInitialLoading(true);
    try {
      axios.get("/").then((res) => {
        const csrf_token = res?.data?.match(
          /var csrf_token\s*=\s*['"]([^'"]+)['"]/
        )?.[1];

        dispatch(setCsrfToken(csrf_token));
      });
    } catch (error) {
      console.log(error);
    }
    setInitialLoading(false);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#E4E0E1",
        zIndex: 100,
        overflow: "auto",
        paddingBottom: "5%",
      }}
    >
      <Header username={user?.username} />

      {isLoading || initialLoading ? (
        <div
          key={"loading"}
          style={{
            height: "70vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
              Please wait...
            </p>
          </div>
        </div>
      ) : isError ? (
        <div
          style={{
            height: "70vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "red" }}>
            {isError || "Something went wrong!"}
          </p>
        </div>
      ) : !csrfToken ? (
        <div
          style={{
            height: "70vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "red" }}>
            Could not load page successfully!
          </p>
        </div>
      ) : (
        <div key={"main-container"}>
          <p
            style={{
              textAlign: "center",
              fontSize: "18px",
              fontWeight: "bold",
              color: "green",
              padding: "10px",
            }}
          >
            All are good! Lets Start
          </p>

          {userSlugData?.length ? (
            <div>
              {checkerFile?.info?.length ? (
                <CheckerSection checkerFile={checkerFile} />
              ) : (
                ""
              )}

              <div
                style={{
                  paddingTop: "1.5rem",
                  display: " flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "4px",
                }}
              >
                {userSlugData?.map((slug, i) => {
                  return (
                    <SlugButton
                      key={i}
                      onClick={() => {
                        setActiveSlug(i);
                      }}
                      active={activeSlug === i}
                    >
                      Slug - {i + 1}
                    </SlugButton>
                  );
                })}
              </div>

              {userSlugData[activeSlug]?.visaFiles?.length ? (
                <UserSlug
                  csrfToken={csrfToken}
                  checkerFile={checkerFile}
                  data={userSlugData[activeSlug]}
                />
              ) : (
                <div>
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "18px",
                      fontWeight: "bold",
                      padding: "1rem",
                      color: "red",
                    }}
                  >
                    No data found in this Slug - {activeSlug + 1}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                No data found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
