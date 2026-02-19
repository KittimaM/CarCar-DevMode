import axios from "axios";
import URLList from "./URLList";

const initialUrl = process.env.REACT_APP_NODE_API_URL;

const postApi = async (url, data, isUseToken = false) => {
  try {
    const headers = {};
    if (!(data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    if (isUseToken) {
      const token = sessionStorage.getItem("token");
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.post(initialUrl + url, data, { headers });
    const { status, msg } = response.data;
    if (msg === "token expired") {
      sessionStorage.removeItem("token");
    }
    return { status: status, msg: msg };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const getApi = async (url, jsonData = null, isUseToken = false) => {
  try {
    let headers = {};
    if (isUseToken) {
      const token = sessionStorage.getItem("token");
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
    }
    if (jsonData) {
      headers.params = JSON.stringify(jsonData);
    }
    const response = await axios.get(initialUrl + url, { headers });
    const { status, msg } = response.data;
    if (msg === "token expired") {
      sessionStorage.removeItem("token");
      window.location.href = process.env.REACT_APP_STORE_WEB_URL || "/";
    }
    return { status: status, msg: msg };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const PostAdminLogin = (jsonData) => {
  return postApi(URLList.AdminLogin, jsonData);
};

export const GetAdminGeneral = () => {
  return getApi(URLList.AdminGeneral);
};
