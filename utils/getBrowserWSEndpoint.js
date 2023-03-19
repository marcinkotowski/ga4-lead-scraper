import axios from "axios";

export default async function getBrowserWSEndpoint() {
  const response = await axios.get("http://127.0.0.1:9222/json/version");
  const { webSocketDebuggerUrl } = response.data;
  return webSocketDebuggerUrl;
}
