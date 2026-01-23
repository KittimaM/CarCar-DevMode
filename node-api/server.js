const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
app.use(cors());
app.use(bodyParser.json());

// customer
const CustomerProfileRoute = require("./Routes/Customer/CustomerProfile");
app.use("/customer/profile", CustomerProfileRoute);

const CustomerRegisterRoute = require("./Routes/Customer/CustomerRegister");
app.use("/customer/register", CustomerRegisterRoute);

const CustomerLoginRoute = require("./Routes/Customer/CustomerLogin");
app.use("/customer/login", CustomerLoginRoute);

const CustomerBookingRoute = require("./Routes/Customer/CustomerBooking");
app.use("/customer/booking", CustomerBookingRoute);

const CustomerIndexRoute = require("./Routes/Customer/CustomerIndex");
app.use("/customer/index", CustomerIndexRoute);

const CustomerCarRoute = require("./Routes/Customer/CustomerCar");
app.use("/customer/car", CustomerCarRoute);

//admin
const AdminAdvanceSettingRoute = require("./Routes/Admin/AdminAdvanceSetting");
app.use("/admin/advance_setting", AdminAdvanceSettingRoute);

const AdminSearchRoute = require("./Routes/Admin/AdminSearch");
app.use("/admin/search", AdminSearchRoute);

const AdminTemplateRoute = require("./Routes/Admin/AdminTemplate");
app.use("/admin/template", AdminTemplateRoute);

const AdminOnLeaveDetailRoute = require("./Routes/Admin/AdminOnLeave/AdminOnLeaveDetail");
app.use("/admin/onleave/detail", AdminOnLeaveDetailRoute);

const AdminRoleLabelRoute = require("./Routes/Admin/AdminRole/AdminRoleLabel");
app.use("/admin/role-label", AdminRoleLabelRoute);

const AdminCustomerCarRoute = require("./Routes/Admin/AdminUser/AdminCustomerCar");
app.use("/admin/customer-car", AdminCustomerCarRoute);

const AdminCustomerRoute = require("./Routes/Admin/AdminUser/AdminCustomer");
app.use("/admin/customer", AdminCustomerRoute);

const AdminStatusGroupRoute = require("./Routes/Admin/AdminStatusGroup");
app.use("/admin/status-group", AdminStatusGroupRoute);

const AdminStatusRoute = require("./Routes/Admin/AdminStatus");
app.use("/admin/status", AdminStatusRoute);

const AdminChannelRoute = require("./Routes/Admin/AdminChannel");
app.use("/admin/channel", AdminChannelRoute);

const AdminProvinceRoute = require("./Routes/Admin/AdminProvince");
app.use("/admin/province", AdminProvinceRoute);

const AdminOnLeaveTypeRoute = require("./Routes/Admin/AdminOnLeave/AdminOnLeaveType");
app.use("/admin/onleave/type", AdminOnLeaveTypeRoute);

const AdminDayOffRoute = require("./Routes/Admin/AdminDayOff");
app.use("/admin/dayoff", AdminDayOffRoute);

const AdminOnLeaveRoute = require("./Routes/Admin/AdminOnLeave/AdminOnLeave");
app.use("/admin/onleave", AdminOnLeaveRoute);

const AdminAccountRoute = require("./Routes/Admin/AdminAccount");
app.use("/admin/account", AdminAccountRoute);

const AdminPaymentTypeRoute = require("./Routes/Admin/AdminPaymentType");
app.use("/admin/paymenttype", AdminPaymentTypeRoute);

const AdminCarSizeRoute = require("./Routes/Admin/AdminCarSize");
app.use("/admin/carsize", AdminCarSizeRoute);

const AdminLoginRoute = require("./Routes/Admin/AdminLogin");
app.use("/admin/login", AdminLoginRoute);

const AdminBookingRoute = require("./Routes/Admin/AdminBooking");
app.use("/admin/booking", AdminBookingRoute);

const AdminUserRoute = require("./Routes/Admin/AdminUser/AdminUser");
app.use("/admin/user", AdminUserRoute);

const AdminServiceRoute = require("./Routes/Admin/AdminService");
app.use("/admin/service", AdminServiceRoute);

const AdminPermissionRoute = require("./Routes/Admin/AdminPermission");
app.use("/admin/permission", AdminPermissionRoute);

const AdminRoleRoute = require("./Routes/Admin/AdminRole/AdminRole");
app.use("/admin/role", AdminRoleRoute);

const ModulesRoutes = require("./Routes/Admin/AdminRole/Modules");
app.use("/admin/module", ModulesRoutes);

const RolePermissionRoue = require("./Routes/Admin/AdminRole/RolePermission");
app.use("/admin/role-permission", RolePermissionRoue);

const testPathRoute = require("./Routes/testPath");
app.use("/api/test", testPathRoute);

// Start the server
app.listen(process.env.API_PORT, () => {
  console.log(`Server is running on port ${process.env.API_PORT}`);
});
