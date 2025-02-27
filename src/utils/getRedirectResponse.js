const getUrlToPathName = (url) => {
  const urlObj = new URL(url);
  const pathName = urlObj.pathname;
  return pathName;
};

const generateRedirectResponse = async () => {
  return new Promise((resolve) => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "REDIRECT") {
        if (message?.data?.statusCode === 302) {
          const { redirectUrl, statusCode, url } = message?.data;
          const data = {
            isRedirect: true,
            statusCode,
            requestPath: getUrlToPathName(url),
            redirectPath: getUrlToPathName(redirectUrl),
          };
          resolve(data);
        }
      }
    });
  });
};

export default generateRedirectResponse;
