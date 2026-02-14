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
  md_car_size: lazy(() => import("./MasterData/CarSize/AdminCarSize")),
  //   service: lazy(() => import("./AdminService")),
  md_channel: lazy(() => import("./MasterData/Channel/AdminChannel")),
  //   template: lazy(() => import("./AdminTemplate")),
  //   search: lazy(() => import("./AdminSearch")),
  role: lazy(() => import("./Setting/AccessConfig/AdminRole")),
  //   account: lazy(() => import("./AdminAccount")),
  //   onLeaveList: lazy(() => import("./AdminOnLeaveList")),
  md_status: lazy(() => import("./MasterData/Status/AdminStatus")),
  //   onLeaveType: lazy(() => import("./AdminOnLeaveType")),
  md_payment_account: lazy(
    () => import("./MasterData/PaymentAccount/PaymentAccount"),
  ),
  general: lazy(() => import("./Setting/General/AdminGeneral")),
  md_service: lazy(() => import("./MasterData/Service/AdminService")),
  md_branch: lazy(() => import("./MasterData/Branch/Branch")),
  manage_service: lazy(() => import("./Management/ServiceRates/ServiceRates")),
};

export default componentMap;
