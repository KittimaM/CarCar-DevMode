const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// customer
const CustomerProfileRoute = require("./Routes/Customer/CustomerProfile");
app.use("/customer/profile", CustomerProfileRoute);

const CustomerLoginRoute = require("./Routes/Customer/CustomerLogin");
app.use("/customer/login", CustomerLoginRoute);

const CustomerBookingRoute = require("./Routes/Customer/CustomerBooking");
app.use("/customer/booking", CustomerBookingRoute);

const CustomerIndexRoute = require("./Routes/Customer/CustomerIndex");
app.use("/customer/index", CustomerIndexRoute);

const CustomerCarRoute = require("./Routes/Customer/CustomerCar");
app.use("/customer/car", CustomerCarRoute);

//admin
const AdminGeneralRoute = require("./Routes/Admin/Setting/AdminGeneral");
app.use("/admin/general", AdminGeneralRoute);

const AdminSearchRoute = require("./Routes/Admin/AdminSearch");
app.use("/admin/search", AdminSearchRoute);

const AdminTemplateRoute = require("./Routes/Admin/AdminTemplate");
app.use("/admin/template", AdminTemplateRoute);

const AdminOnLeaveDetailRoute = require("./Routes/Admin/AdminOnLeave/AdminOnLeaveDetail");
app.use("/admin/onleave/detail", AdminOnLeaveDetailRoute);

const AdminCustomerCarRoute = require("./Routes/Admin/AdminUser/AdminCustomerCar");
app.use("/admin/customer-car", AdminCustomerCarRoute);

const AdminCustomerRoute = require("./Routes/Admin/AdminUser/AdminCustomer");
app.use("/admin/customer", AdminCustomerRoute);

const AdminStatusRoute = require("./Routes/Admin/AdminStatus");
app.use("/admin/status", AdminStatusRoute);

const AdminStatusGroupRoute = require("./Routes/Admin/AdminStatusGroup");
app.use("/admin/status-group", AdminStatusGroupRoute);

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

const AdminRoleRoute = require("./Routes/Admin/Setting/AccessConfig/AdminRole");
app.use("/admin/role", AdminRoleRoute);

const ModulesRoutes = require("./Routes/Admin/Setting/AccessConfig/Modules");
app.use("/admin/module", ModulesRoutes);

const RolePermissionRoute = require("./Routes/Admin/Setting/AccessConfig/RolePermission");
app.use("/admin/role-permission", RolePermissionRoute);

const PaymentAccountRoute = require("./Routes/Admin/MasterData/PaymentAccount/PaymentAccount");
app.use("/admin/payment-account", PaymentAccountRoute);

app.listen(process.env.API_PORT, () => {
  console.log(`Server is running on port ${process.env.API_PORT}`);
});
