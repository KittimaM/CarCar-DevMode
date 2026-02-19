const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const allowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",")
  : [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

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

// const CustomerCarRoute = require("./Routes/Customer/CustomerCar");
// app.use("/customer/car", CustomerCarRoute);

//admin
const GeneralRoute = require("./Routes/Admin/Setting/GeneralRoute");
app.use("/admin/general", GeneralRoute);

const AdminSearchRoute = require("./Routes/Admin/AdminSearch");
app.use("/admin/search", AdminSearchRoute);

const AdminTemplateRoute = require("./Routes/Admin/AdminTemplate");
app.use("/admin/template", AdminTemplateRoute);

const AdminOnLeaveDetailRoute = require("./Routes/Admin/AdminOnLeave/AdminOnLeaveDetail");
app.use("/admin/onleave/detail", AdminOnLeaveDetailRoute);

const CustomerCarRoute = require("./Routes/Admin/User/CustomerCarRoute");
app.use("/admin/customer-car", CustomerCarRoute);

const CustomerUserRoute = require("./Routes/Admin/User/CustomerUserRoute");
app.use("/admin/customer", CustomerUserRoute);

const StatusRoute = require("./Routes/Admin/MasterData/StatusRoute");
app.use("/admin/status", StatusRoute);

const StatusGroupRoute = require("./Routes/Admin/MasterData/StatusGroupRoute");
app.use("/admin/status-group", StatusGroupRoute);

const ChannelRoute = require("./Routes/Admin/MasterData/ChannelRoute");
app.use("/admin/channel", ChannelRoute);

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

const CarSizeRoute = require("./Routes/Admin/MasterData/CarSizeRoute");
app.use("/admin/carsize", CarSizeRoute);

const LoginAdminRoute = require("./Routes/Admin/LoginAdminRoute");
app.use("/admin/login", LoginAdminRoute);

const AdminBookingRoute = require("./Routes/Admin/AdminBooking");
app.use("/admin/booking", AdminBookingRoute);

const StaffUserRoute = require("./Routes/Admin/User/StaffUserRoute");
app.use("/admin/user", StaffUserRoute);

const ServiceRoute = require("./Routes/Admin/MasterData/ServiceRoute");
app.use("/admin/service", ServiceRoute);

const AdminPermissionRoute = require("./Routes/Admin/AdminPermission");
app.use("/admin/permission", AdminPermissionRoute);

const AdminRoleRoute = require("./Routes/Admin/Setting/AccessConfig/RoleRoute");
app.use("/admin/role", AdminRoleRoute);

const ModulesRoutes = require("./Routes/Admin/Setting/AccessConfig/ModulesRoute");
app.use("/admin/module", ModulesRoutes);

const RolePermissionRoute = require("./Routes/Admin/Setting/AccessConfig/RolePermissionRoute");
app.use("/admin/role-permission", RolePermissionRoute);

const PaymentAccountRoute = require("./Routes/Admin/MasterData/PaymentAccountRoute");
app.use("/admin/payment-account", PaymentAccountRoute);

const BranchRoute = require("./Routes/Admin/MasterData/BranchRoute");
app.use("/admin/branch", BranchRoute);

const ServiceRatesRoute = require("./Routes/Admin/Management/ServiceRatesRoute");
app.use("/admin/service-rates", ServiceRatesRoute);

const PaymentTypeRoute = require("./Routes/Admin/MasterData/PaymentTypeRoute");
app.use("/admin/payment-type", PaymentTypeRoute);

const ChannelMatchingRoute = require("./Routes/Admin/Management/ChannelMatchingRoute");
app.use("/admin/channel-matching", ChannelMatchingRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
