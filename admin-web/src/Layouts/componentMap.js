import { lazy } from "react";

const componentMap = {
  home: lazy(() => import("./AdminHome")),
  //   schedule: lazy(() => import("./AdminSchedule")),
  //   booking: lazy(() => import("./AdminBooking")),
  //   payment: lazy(() => import("./AdminPayment")),
  staff: lazy(() => import("./AdminStaff/AdminStaff")),
  customer: lazy(() => import("./AdminCustomer/AdminCustomer")),
  customerCar: lazy(() => import("./AdminCustomerCar/AdminCustomerCar")),
  //   onLeavePersonal: lazy(() => import("./AdminOnLeavePersonal")),
  //   dayOffList: lazy(() => import("./AdminDayOff")),
  carSize: lazy(() => import("./MasterData/CarSize/AdminCarSize")),
  //   service: lazy(() => import("./AdminService")),
  //   channel: lazy(() => import("./AdminChannel")),
  //   template: lazy(() => import("./AdminTemplate")),
  //   search: lazy(() => import("./AdminSearch")),
  role: lazy(() => import("./AdminRole/AdminRole")),
  //   account: lazy(() => import("./AdminAccount")),
  //   onLeaveList: lazy(() => import("./AdminOnLeaveList")),
  //   status: lazy(() => import("./AdminStatus")),
  //   onLeaveType: lazy(() => import("./AdminOnLeaveType")),
  //   paymentType: lazy(() => import("./AdminPaymentType")),
  //   advSetting: lazy(() => import("./AdminAdvanceSetting")),
  service: lazy(() => import ("./MasterData/Service/AdminService")),
};

export default componentMap;
