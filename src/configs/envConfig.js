export const url = window.location.origin;
const appBaseUrl =
  url === "https://payment.ivacbd.com" ||
  url === "http://127.0.0.1:8787" ||
  url === "https://it-hub-vps.pkshohag240.workers.dev"
    ? url
    : url + "/";
// const appBaseUrl = "https://payment.ivacbd.com";
// const backendBaseUrl = "http://localhost:5000";

const dbblMobileBankingUrl = "http://127.0.0.1:5500";

const backendBaseUrl =
  url === "http://localhost:5000"
    ? url // "https://api.it-hub.agency" // url
    : url === dbblMobileBankingUrl
    ? "http://localhost:5000"
    : "https://api.it-hub.agency";

// const appBaseUrl = "http://localhost:5000/api/v1";
// const backendBaseUrl = "http://localhost:5000";
// url === "http://localhost:5000" ? url : "https://api.it-hub.agency";

const isTesting =
  url === "https://payment.ivacbd.com" ||
  url === "https://it-hub-vps.pkshohag240.workers.dev"
    ? false
    : true;

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
