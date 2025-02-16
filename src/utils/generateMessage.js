export const setCSRFToken = (htmlString) => {
  const csrfTokenRegex = /var csrf_token = "([^"]+)"/;
  const csrfTokenMatch = htmlString.match(csrfTokenRegex);
  const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : "";

  if (csrfToken) {
    const url = new URL(window.location.href);
    url.searchParams.set("key", csrfToken);
    window.history.pushState({}, "", url);
  }
  return csrfToken;
};

export const getCSRFToken = () => {
  const url = new URL(window.location.href);
  const key = url.searchParams.get("key");
  return key ?? "";
};

export const getLoginOtpErrorMessage = (htmlString) => {
  const startWith = `<span class="text-danger">`;
  const endWith = "</span>";

  const startIndex = htmlString.indexOf(startWith);
  const endIndex = htmlString.indexOf(endWith, startIndex + startWith.length);

  if (startIndex !== -1 && endIndex !== -1) {
    const errorMessage = htmlString.substring(
      startIndex + startWith.length,
      endIndex
    );
    console.log("errorMessage", errorMessage);
    return errorMessage.trim();
  }
  return "Something went wrong!";
};

export const getLoginInfo = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const userImgElement = doc.querySelector("img.rounded-circle");
  const userImg = userImgElement ? userImgElement.getAttribute("src") : "";

  const csrfToken = setCSRFToken(htmlString);
  localStorage.setItem("userImg", userImg);

  return {
    userImg,
    csrfToken,
  };
};

export const getDateReleaseInfo = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const textElement = doc.querySelector(
    ".tab-pane.active .col-md-12.text-center.text-danger"
  );
  const text = textElement.innerText;
  setCSRFToken(htmlString);

  if (text === "Please wait until slot is available") {
    localStorage.setItem(
      "relasedInfo",
      JSON.stringify({ relased: false, message: text })
    );
    return {
      relased: false,
      message: text,
    };
  } else {
    localStorage.setItem(
      "relasedInfo",
      JSON.stringify({
        relased: true,
        message: "Appointment date released!",
      })
    );
    return {
      relased: false,
      message: text,
    };
  }
};
