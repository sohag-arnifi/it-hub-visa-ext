const backendProdApi = "https://it-hub-date-service.vercel.app/api";
// const prodBaseUrl = "https://payment.ivacbd.com";
const prodBaseUrl = "";
const devBaseUrl = "http://localhost:5000/api";

const env = "production";
const isTesting = false;

const envConfig = {
  environment: env,
  backendBaseUrl: env === "development" ? devBaseUrl : prodBaseUrl,
  backendApi: isTesting ? devBaseUrl + "/v1" : backendProdApi + "/v1",
};

export default envConfig;
