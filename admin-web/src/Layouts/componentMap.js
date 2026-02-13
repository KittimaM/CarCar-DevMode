import { lazy } from "react";

const componentMap = {
  home: lazy(() => import("./AdminHome")),
  //   schedule: lazy(() => import("./AdminSchedule")),
  booking: lazy(() => import("./Booking/Booking")),
  //   payment: lazy(() => import("./AdminPayment")),
  staff: lazy(() => import("./User/Staff/AdminStaff")),
  customer: lazy(() => import("./User/Customer/AdminCustomer")),
  customerCar: lazy(() => import("./User/CustomerCar/AdminCustomerCar")),
  //   onLeavePersonal: lazy(() => import("./AdminOnLeavePersonal")),
  //   dayOffList: lazy(() => import("./AdminDayOff")),
  carSize: lazy(() => import("./MasterData/CarSize/AdminCarSize")),
  //   service: lazy(() => import("./AdminService")),
  channel: lazy(() => import("./MasterData/Channel/AdminChannel")),
  //   template: lazy(() => import("./AdminTemplate")),
  //   search: lazy(() => import("./AdminSearch")),
  role: lazy(() => import("./Setting/AccessConfig/AdminRole")),
  //   account: lazy(() => import("./AdminAccount")),
  //   onLeaveList: lazy(() => import("./AdminOnLeaveList")),
  status: lazy(() => import("./MasterData/Status/AdminStatus")),
  //   onLeaveType: lazy(() => import("./AdminOnLeaveType")),
  paymentAccount: lazy(
    () => import("./MasterData/PaymentAccount/PaymentAccount"),
  ),
  general: lazy(() => import("./Setting/General/AdminGeneral")),
  service: lazy(() => import("./MasterData/Service/AdminService")),
  branch: lazy(() => import("./MasterData/Branch/Branch")),
};

export default componentMap;
