const axios = require("axios");

async function getBrowserWSEndpoint() {
  try {
    const response = await axios.get("http://127.0.0.1:9222/json/version");
    const { webSocketDebuggerUrl } = response.data;
    return webSocketDebuggerUrl;
  } catch (err) {
    throw new Error(`Error in getBrowserWSEndpoint function: ${err}`);
  }
}

module.exports = {
  getBrowserWSEndpoint,
};
