import axios from "axios";
import URLList from "./Url/URLList";

const initialUrl = "http://localhost:5000/";

const putApi = async (url, jsonData, isUseToken = false) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (isUseToken) {
      const token = localStorage.getItem("token");
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.put(initialUrl + url, jsonData, { headers });
    const { status, msg } = response.data;
    if (msg == "token expired") {
      localStorage.removeItem("token");
    }
    return { status: status, msg: msg };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const postApi = async (url, jsonData, isUseToken = false) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (isUseToken) {
      const token = localStorage.getItem("token");
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.post(initialUrl + url, jsonData, { headers });
    const { status, msg } = response.data;
    if (msg == "token expired") {
      localStorage.removeItem("token");
    }
    return { status: status, msg: msg };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const deleteApi = async (url, jsonData, isUseToken = false) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (isUseToken) {
      const token = localStorage.getItem("token");
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.delete(initialUrl + url, {
      headers: headers,
      data: jsonData,
    });
    const { status, msg } = response.data;
    if (msg == "token expired") {
      localStorage.removeItem("token");
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
      const token = localStorage.getItem("token");
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
    if (msg == "token expired") {
      localStorage.removeItem("token");
    }
    return { status: status, msg: msg };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const GetPermission = () => {
  const isUseToken = true;
  return getApi(URLList.AdminPermission, null, isUseToken);
};

export const GetAllAdminRole = (url) => {
  return getApi(url);
};

export const PostAdminAddRole = (url, jsonData) => {
  return postApi(url, jsonData);
};

export const DeleteRole = (url, jsonData) => {
  return deleteApi(url, jsonData);
};

export const UpdateRole = (url, jsonData) => {
  return putApi(url, jsonData);
};

export const GetAllBooking = (options = null) => {
  return getApi("admin/booking", options);
};

export const PostAddStaffUser = (url, jsonData) => {
  return postApi(url, jsonData);
};

export const PostLogin = (jsonData) => {
  return postApi("admin/login", jsonData);
};

export const PostUpDateBookingStatus = (jsonData) => {
  return postApi("admin/booking/update-status", jsonData);
};

export const GetAllStaff = (url) => {
  return getApi(url);
};

export const DeleteStaffUser = (url, jsonData) => {
  return deleteApi(url, jsonData);
};

export const UpdateStaffUser = (url, jsonData) => {
  return putApi(url, jsonData);
};

export const GetAllCarSize = (url) => {
  return getApi(url);
};

export const PostAddCarSize = (url, jsonData) => {
  return postApi(url, jsonData);
};

export const DeleteCarSize = (url, jsonData) => {
  return deleteApi(url, jsonData);
};

export const UpdateCarSize = (url, jsonData) => {
  return putApi(url, jsonData);
};

export const GetAllService = (url) => {
  return getApi(url);
};

export const PostAddService = (url, jsonData) => {
  return postApi(url, jsonData);
};

export const DeleteService = (url, jsonData) => {
  return deleteApi(url, jsonData);
};

export const UpdateService = (url, jsonData) => {
  return putApi(url, jsonData);
};

export const GetCustomerCar = () => {
  const isUseToken = true;
  return getApi("customer/car", null, isUseToken);
};

export const PostAddCustomerCar = (jsonData) => {
  const isUseToken = true;
  return postApi("customer/car", jsonData, isUseToken);
};

export const DeleteCustomerCar = (jsonData) => {
  return deleteApi("customer/car", jsonData);
};

export const UpdateCustomerCar = (jsonData) => {
  return putApi("customer/car", jsonData);
};

export const GetAllCustomerBooking = () => {
  const isUseToken = true;
  return getApi("customer/booking", null, isUseToken);
};

export const DeleteCustomerBooking = (jsonData) => {
  return deleteApi("customer/booking", jsonData);
};

export const PostAddCustomer = (jsonData) => {
  return postApi("customer/register", jsonData);
};

export const PostAddCustomerBooking = (jsonData) => {
  const isUseToken = true;
  return postApi("customer/booking", jsonData, isUseToken);
};

export const PostAddAdminBooking = (jsonData) => {
  const isUseToken = true;
  return postApi("admin/booking", jsonData, isUseToken);
};

export const PostAddPaymentType = (url, jsonData) => {
  return postApi(url, jsonData);
};

export const GetAllPaymentType = (url) => {
  return getApi(url);
};

export const UpdatePaymentType = (url, jsonData) => {
  return putApi(url, jsonData);
};

export const DeletePaymentType = (url, jsonData) => {
  return deleteApi(url, jsonData);
};

export const GetAllAccount = () => {
  return getApi("admin/account");
};

export const PostAddAccount = (jsonData) => {
  return postApi("admin/account", jsonData);
};

export const DeleteAccount = (jsonData) => {
  return deleteApi("admin/account", jsonData);
};

export const UpdateAccount = (jsonData) => {
  return putApi("admin/account", jsonData);
};

export const GetAllOnLeave = (url) => {
  return getApi(url);
};

export const PostAddOnLeave = (url, jsonData) => {
  return postApi(url, jsonData);
};

export const DeleteOnLeave = (url, jsonData) => {
  return deleteApi(url, jsonData);
};

export const ApproveOnLeave = (url, jsonData) => {
  return putApi(url, jsonData, true);
};

export const GetOnLeavePersonal = (url) => {
  const isUseToken = true;
  return getApi(url, null, isUseToken);
};

export const PostAddOnLeavePersonal = (url, jsonData) => {
  const isUseToken = true;
  return postApi(url, jsonData, isUseToken);
};

export const GetAllDayOff = () => {
  return getApi("admin/dayoff");
};

export const UpdateDayOff = (jsonData) => {
  return putApi("admin/dayoff", jsonData);
};

export const GetAllOnLeaveType = (url) => {
  return getApi(url);
};

export const DeleteOnLeaveType = (url, jsonData) => {
  return deleteApi(url, jsonData);
};

export const UpdateOnLeaveType = (url, jsonData) => {
  return putApi(url, jsonData);
};

export const AddOnLeaveType = (url, jsonData) => {
  return postApi(url, jsonData);
};

export const GetAllProvince = (url) => {
  return getApi(url);
};

export const GetCustomerProfile = () => {
  const isUseToken = true;
  return getApi("customer/profile", null, isUseToken);
};

export const UpdateCustomerProfile = (jsonData) => {
  const isUseToken = true;
  return putApi("customer/profile", jsonData, isUseToken);
};

export const GetChannel = (url) => {
  return getApi(url);
};

export const PostAddChannel = (url, jsonData) => {
  return postApi(url, jsonData);
};

export const DeleteChannel = (url, jsonData) => {
  return deleteApi(url, jsonData);
};

export const UpdateChannel = (url, jsonData) => {
  return putApi(url, jsonData);
};

export const GetAllStatus = (url) => {
  return getApi(url);
};

export const PostAddStatus = (url, jsonData) => {
  return postApi(url, jsonData);
};

export const UpdateStatus = (url, jsonData) => {
  return putApi(url, jsonData);
};

export const DeleteStatus = (url, jsonData) => {
  return deleteApi(url, jsonData);
};

export const GetAllStatusGroup = (url) => {
  return getApi(url);
};

export const PostAddStatusGroup = (url, jsonData) => {
  return postApi(url, jsonData);
};

export const UpdateStatusGroup = (url, jsonData) => {
  return putApi(url, jsonData);
};

export const DeleteStatusGroup = (url, jsonData) => {
  return deleteApi(url, jsonData);
};

export const GetAdminCustomer = () => {
  return getApi(URLList.AdminCustomerURL);
};

export const UpdateAdminCustomer = (url, jsonData) => {
  return putApi(url, jsonData);
};

export const PostAdminAddCustomer = (url, jsonData) => {
  return postApi(url, jsonData);
};

export const DeleteAdminCustomer = (url, jsonData) => {
  return deleteApi(url, jsonData);
};

export const GetAdminCustomerCar = () => {
  return getApi(URLList.AdminCustomerCarURL);
};

export const DeleteAdminCustomerCar = (url, jsonData) => {
  return deleteApi(url, jsonData);
};

export const PostAddAdminCustomerCar = (url, jsonData) => {
  return postApi(url, jsonData);
};

export const UpdateAdminCustomerCar = (url, jsonData) => {
  return putApi(url, jsonData);
};

export const GetAllAdminRoleLabel = () => {
  return getApi(URLList.AdminRoleLabel);
};

export const AdminGetLatestOnLeaveByType = (url, jsonData) => {
  const isUseToken = true;
  return getApi(url, jsonData, isUseToken);
};

export const PostAdminTemplate = (jsonData) => {
  return postApi(URLList.AdminTemplate, jsonData);
};

export const GetAdminAllTemplate = () => {
  return getApi(URLList.AdminTemplate);
};

export const DeleteAdminTemplate = (jsonData) => {
  return deleteApi(URLList.AdminTemplate, jsonData);
};

export const UpdateAdminTemplate = (jsonData) => {
  return putApi(URLList.AdminTemplate, jsonData);
};

export const GetAdminSearchFilter = () => {
  return getApi(URLList.AdminSearch);
};

export const GetAdminSearchResult = (jsonData) => {
  return postApi(URLList.AdminSearch, jsonData);
};
