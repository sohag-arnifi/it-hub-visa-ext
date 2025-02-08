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

  const csrfTokenRegex = /var csrf_token = "([^"]+)"/;
  const csrfTokenMatch = htmlString.match(csrfTokenRegex);
  const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : "";

  localStorage.setItem("_token", csrfToken);
  localStorage.setItem("userImg", userImg);

  return {
    userImg,
    csrfToken,
  };
};
