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

export const GetAllAdminRole = () => {
  return getApi(URLList.AdminRole);
};

export const PostAdminAddRole = (url, jsonData) => {
  return postApi(url, jsonData);
};

export const DeleteRole = (jsonData) => {
  return deleteApi(URLList.AdminRole, jsonData);
};

export const UpdateRole = (url, jsonData) => {
  return putApi(url, jsonData);
};

export const GetAllBooking = (options = null) => {
  return getApi("admin/booking", options);
};

export const PostAddStaffUser = (jsonData) => {
  return postApi(URLList.AdminStaff, jsonData);
};

export const PostAdminLogin = (jsonData) => {
  return postApi(URLList.AdminLogin, jsonData);
};

export const PostUpDateBookingStatus = (jsonData) => {
  return postApi("admin/booking/update-status", jsonData);
};

export const GetAllStaff = () => {
  return getApi(URLList.AdminStaff);
};

export const DeleteStaffUser = (jsonData) => {
  return deleteApi(URLList.AdminStaff, jsonData);
};

export const UpdateStaffUser = (jsonData) => {
  return putApi(URLList.AdminStaff, jsonData);
};

export const GetAllCarSize = () => {
  return getApi(URLList.AdminCarSizeURL);
};

export const PostAddCarSize = (jsonData) => {
  return postApi(URLList.AdminCarSizeURL, jsonData);
};

export const DeleteCarSize = (jsonData) => {
  return deleteApi(URLList.AdminCarSizeURL, jsonData);
};

export const UpdateCarSize = (jsonData) => {
  return putApi(URLList.AdminCarSizeURL, jsonData);
};

export const GetAllService = () => {
  return getApi(URLList.AdminService);
};

export const PostAddService = (jsonData) => {
  return postApi(URLList.AdminService, jsonData);
};

export const DeleteService = (jsonData) => {
  return deleteApi(URLList.AdminService, jsonData);
};

export const UpdateService = (jsonData) => {
  return putApi(URLList.AdminService, jsonData);
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

export const PostAddPaymentType = (jsonData) => {
  return postApi(URLList.AdminPaymentType, jsonData);
};

export const GetAllPaymentType = () => {
  return getApi(URLList.AdminPaymentType);
};

export const UpdatePaymentType = (jsonData) => {
  return putApi(URLList.AdminPaymentType, jsonData);
};

export const DeletePaymentType = (jsonData) => {
  return deleteApi(URLList.AdminPaymentType, jsonData);
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

export const GetAllOnLeave = () => {
  return getApi(URLList.AdminOnLeave);
};

export const PostAddOnLeave = (jsonData) => {
  return postApi(URLList.AdminOnLeave, jsonData);
};

export const DeleteOnLeave = (jsonData) => {
  return deleteApi(URLList.AdminOnLeave, jsonData);
};

export const ApproveOnLeave = (jsonData) => {
  return putApi(URLList.AdminOnLeaveApprove, jsonData, true);
};

export const GetOnLeavePersonal = () => {
  return getApi(URLList.AdminOnLeavePersonal, null, true);
};

export const PostAddOnLeavePersonal = (jsonData) => {
  return postApi(URLList.AdminOnLeavePersonal, jsonData, true);
};

export const GetAllDayOff = () => {
  return getApi("admin/dayoff");
};

export const UpdateDayOff = (jsonData) => {
  return putApi("admin/dayoff", jsonData);
};

export const GetAllOnLeaveType = () => {
  return getApi(URLList.AdminOnLeaveType);
};

export const DeleteOnLeaveType = (jsonData) => {
  return deleteApi(URLList.AdminOnLeaveType, jsonData);
};

export const UpdateOnLeaveType = (jsonData) => {
  return putApi(URLList.AdminOnLeaveType, jsonData);
};

export const AddOnLeaveType = (jsonData) => {
  return postApi(URLList.AdminOnLeaveType, jsonData);
};

export const GetAllProvince = (url) => {
  return getApi(url);
};

export const GetCustomerProfile = () => {
  const isUseToken = true;
  return getApi(URLList.CustomerProfile, null, isUseToken);
};

export const UpdateCustomerProfile = (jsonData) => {
  const isUseToken = true;
  return putApi(URLList.CustomerProfile, jsonData, isUseToken);
};

export const GetChannel = () => {
  return getApi(URLList.AdminChannel);
};

export const PostAddChannel = (jsonData) => {
  return postApi(URLList.AdminChannel, jsonData);
};

export const DeleteChannel = (jsonData) => {
  return deleteApi(URLList.AdminChannel, jsonData);
};

export const UpdateChannel = (jsonData) => {
  return putApi(URLList.AdminChannel, jsonData);
};

export const GetAllStatus = () => {
  return getApi(URLList.AdminStatus);
};

export const PostAddStatus = (jsonData) => {
  return postApi(URLList.AdminStatus, jsonData);
};

export const UpdateStatus = (jsonData) => {
  return putApi(URLList.AdminStatus, jsonData);
};

export const DeleteStatus = (jsonData) => {
  return deleteApi(URLList.AdminStatus, jsonData);
};

export const GetAllStatusGroup = () => {
  return getApi(URLList.AdminStatusGroup);
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

export const UpdateAdminCustomer = (jsonData) => {
  return putApi(URLList.AdminCustomerURL, jsonData);
};

export const PostAdminAddCustomer = (jsonData) => {
  return postApi(URLList.AdminCustomerURL, jsonData);
};

export const DeleteAdminCustomer = (jsonData) => {
  return deleteApi(URLList.AdminCustomerURL, jsonData);
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

export const AdminGetLatestOnLeaveByType = (jsonData) => {
  return getApi(URLList.AdminLatestOnLeaveByTypePersonal, jsonData, true);
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

export const PostCustomerLogin = (jsonData) => {
  return postApi(URLList.CustomerLogin, jsonData);
};

export const GetAdminGeneralSetting = () => {
  return getApi(URLList.AdminGeneralSetting);
};

export const UpdateAdminGeneralSetting = (jsonData) => {
  return putApi(URLList.AdminGeneralSetting, jsonData);
};

export const UpdateAdminActiveCustomer = (jsonData) => {
  return putApi(URLList.AdminCustomerURL + "/active-user", jsonData);
};

export const UpdateAdminUnlockCustomer = (jsonData) => {
  return putApi(URLList.AdminCustomerURL + "/unlock-user", jsonData);
};

export const UpdateAdminActiveStaff = (jsonData) => {
  return putApi(URLList.AdminStaff + "/active-user", jsonData);
};

export const UpdateAdminUnlockStaff = (jsonData) => {
  return putApi(URLList.AdminStaff + "/unlock-user", jsonData);
};

export const GetAdminAllTemplateField = () => {
  return getApi(URLList.AdminTemplateField);
};

export const GetAdminAllActiveTemplate = () => {
  return getApi(URLList.AdminActiveTemplate);
};
