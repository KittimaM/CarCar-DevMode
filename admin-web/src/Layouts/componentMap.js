import { lazy } from "react";

const componentMap = {
  home: lazy(() => import("./AdminHome")),
  //   schedule: lazy(() => import("./AdminSchedule")),
  booking: lazy(() => import("./Booking/Booking")),
  //   payment: lazy(() => import("./AdminPayment")),
  staff: lazy(() => import("./User/Staff/StaffPage")),
  customer: lazy(() => import("./User/Customer/CustomerPage")),
  customerCar: lazy(() => import("./User/CustomerCar/CustomerCarPage")),
  //   onLeavePersonal: lazy(() => import("./AdminOnLeavePersonal")),
  //   dayOffList: lazy(() => import("./AdminDayOff")),
  md_car_size: lazy(() => import("./MasterData/CarSize/CarSizePage")),
  //   service: lazy(() => import("./AdminService")),
  md_channel: lazy(() => import("./MasterData/Channel/ChannelPage")),
  //   template: lazy(() => import("./AdminTemplate")),
  //   search: lazy(() => import("./AdminSearch")),
  role: lazy(() => import("./Setting/AccessConfig/RolePage")),
  //   account: lazy(() => import("./AdminAccount")),
  //   onLeaveList: lazy(() => import("./AdminOnLeaveList")),
  md_status: lazy(() => import("./MasterData/Status/StatusPage")),
  //   onLeaveType: lazy(() => import("./AdminOnLeaveType")),
  md_payment_account: lazy(
    () => import("./MasterData/PaymentAccount/PaymentAccountPage"),
  ),
  general: lazy(() => import("./Setting/General/GeneralPage")),
  md_service: lazy(() => import("./MasterData/Service/ServicePage")),
  md_branch: lazy(() => import("./MasterData/Branch/BranchPage")),
  manage_service: lazy(
    () => import("./Management/ServiceRates/ServiceRatesPage"),
  ),
  manage_channel: lazy(
    () => import("./Management/ChannelMatching/ChannelMatchingPage"),
  ),
};

export default componentMap;
