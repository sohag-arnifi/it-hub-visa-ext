export const url = window.location.origin;
const appBaseUrl = url === "https://payment.ivacbd.com" ? url : url + "/api/v1";
// const appBaseUrl = "https://payment.ivacbd.com";
// const backendBaseUrl = "http://localhost:5000";

const dbblMobileBankingUrl = "http://127.0.0.1:5500";

const backendBaseUrl =
  url === "http://localhost:5000"
    ? url
    : url === dbblMobileBankingUrl
    ? "http://localhost:5000"
    : "https://it-hub.mdripon.xyz";

// const appBaseUrl = "http://localhost:5000/api/v1";
// const backendBaseUrl = "http://localhost:5000";
// url === "http://localhost:5000" ? url : "https://it-hub.mdripon.xyz";

const isTesting = url === "https://payment.ivacbd.com" ? false : true;

const backendProdApi = "https://it-hub-date-service.vercel.app/api";
const devBaseUrl = "http://localhost:5000/api";

const env = "production";
// const env = "development";

const envConfig = {
  environment: env,
  backendApi: isTesting ? devBaseUrl + "/v1" : backendProdApi + "/v1",
  appBaseUrl,
  backendBaseUrl,
  isTesting,
};

export default envConfig;
