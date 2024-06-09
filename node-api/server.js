const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
app.use(cors());
app.use(bodyParser.json());

// customer
const CustomerProfileRoute = require("./Routes/Customer/CustomerProfile");
app.use("/api/customer/profile", CustomerProfileRoute);

const CustomerRegisterRoute = require("./Routes/Customer/CustomerRegister");
app.use("/api/customer/register", CustomerRegisterRoute);

const CustomerLoginRoute = require("./Routes/Customer/CustomerLogin");
app.use("/api/customer/login", CustomerLoginRoute);

const CustomerBookingRoute = require("./Routes/Customer/CustomerBooking");
app.use("/api/customer/booking", CustomerBookingRoute);

const CustomerIndexRoute = require("./Routes/Customer/CustomerIndex");
app.use("/api/customer/index", CustomerIndexRoute);

const CustomerCarRoute = require("./Routes/Customer/CustomerCar");
app.use("/api/customer/car", CustomerCarRoute);

//admin
const AdminRoleLabelRoute = require("./Routes/Admin/AdminRole/AdminRoleLabel");
app.use("/api/admin/role-label", AdminRoleLabelRoute);

const AdminCustomerCarRoute = require("./Routes/Admin/AdminUser/AdminCustomerCar");
app.use("/api/admin/customer-car", AdminCustomerCarRoute);

const AdminCustomerRoute = require("./Routes/Admin/AdminUser/AdminCustomer");
app.use("/api/admin/customer", AdminCustomerRoute);

const AdminStatusGroupRoute = require("./Routes/Admin/AdminStatusGroup");
app.use("/api/admin/status-group", AdminStatusGroupRoute);

const AdminStatusRoute = require("./Routes/Admin/AdminStatus");
app.use("/api/admin/status", AdminStatusRoute);

const AdminChannelRoute = require("./Routes/Admin/AdminChannel");
app.use("/api/admin/channel", AdminChannelRoute);

const AdminProvinceRoute = require("./Routes/Admin/AdminProvince");
app.use("/api/admin/province", AdminProvinceRoute);

const AdminOnLeaveTypeRoute = require("./Routes/Admin/AdminOnLeaveType");
app.use("/api/admin/onleave-type", AdminOnLeaveTypeRoute);

const AdminDayOffRoute = require("./Routes/Admin/AdminDayOff");
app.use("/api/admin/dayoff", AdminDayOffRoute);

const AdminOnLeaveRoute = require("./Routes/Admin/AdminOnLeave");
app.use("/api/admin/onleave", AdminOnLeaveRoute);

const AdminAccountRoute = require("./Routes/Admin/AdminAccount");
app.use("/api/admin/account", AdminAccountRoute);

const AdminPaymentTypeRoute = require("./Routes/Admin/AdminPaymentType");
app.use("/api/admin/paymenttype", AdminPaymentTypeRoute);

const AdminCarSizeRoute = require("./Routes/Admin/AdminCarSize");
app.use("/api/admin/carsize", AdminCarSizeRoute);

const AdminLoginRoute = require("./Routes/Admin/AdminLogin");
app.use("/api/admin/login", AdminLoginRoute);

const AdminBookingRoute = require("./Routes/Admin/AdminBooking");
app.use("/api/admin/booking", AdminBookingRoute);

const AdminUserRoute = require("./Routes/Admin/AdminUser/AdminUser");
app.use("/api/admin/user", AdminUserRoute);

const AdminServiceRoute = require("./Routes/Admin/AdminService");
app.use("/api/admin/service", AdminServiceRoute);

const AdminPermissionRoute = require("./Routes/Admin/AdminPermission");
app.use("/api/admin/permission", AdminPermissionRoute);

const AdminRoleRoute = require("./Routes/Admin/AdminRole/AdminRole");
app.use("/api/admin/role", AdminRoleRoute);

// Start the server
app.listen(process.env.API_PORT, () => {
  console.log(`Server is running on port ${process.env.API_PORT}`);
});
