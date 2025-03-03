import React, { useEffect, useState } from "react";
import {
  GetPermission,
  GetAllAdminRoleLabel,
  GetAllAdminMenuItems,
} from "../Api";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import "remixicon/fonts/remixicon.css";
import AdminFirstPage from "./AdminFirstPage";
import AdminMasterTable from "./AdminMasterTable";
import AdminStatus from "./AdminStatus";
import AdminChannel from "./AdminChannel";
import AdminDayOff from "./AdminDayOff";
import AdminOnLeaveList from "./AdminOnLeaveList";
import AdminOnLeavePersonal from "./AdminOnLeavePersonal";
import AdminPayment from "./AdminPayment";
import AdminAccount from "./AdminAccount";
import AdminRole from "./AdminRole/AdminRole";
import AdminService from "./AdminService";
import AdminCarSize from "./AdminCarSize";
import AdminUser from "./AdminUser/AdminUser";
import AdminBooking from "./AdminBooking";
import AdminSchedule from "./AdminSchedule";
import AdminTemplate from "./AdminTemplate";
import AdminSearch from "./AdminSearch";
import AdminGeneralSetting from "./AdminGeneralSetting";
import AdminStaff from "./AdminUser/AdminStaff";

const COMPONENT_MAP = {
  firstPage: AdminFirstPage,
  masterTable: AdminMasterTable,
  status: AdminStatus,
  channel: AdminChannel,
  dayOffList: AdminDayOff,
  onLeaveList: AdminOnLeaveList,
  onLeavePersonal: AdminOnLeavePersonal,
  payment: AdminPayment,
  account: AdminAccount,
  role: AdminRole,
  service: AdminService,
  carSize: AdminCarSize,
  user: AdminUser,
  booking: AdminBooking,
  schedule: AdminSchedule,
  template: AdminTemplate,
  search: AdminSearch,
  generalSetting: AdminGeneralSetting,
  staff: AdminStaff,
};

function AdminIndex() {
  const [permission, setPermission] = useState({});
  const [menuItemsList, setMenuItemsList] = useState([]);
  const [activeComponent, setActiveComponent] = useState("firstPage");
  const [data, setData] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});

  useEffect(() => {
    GetPermission().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        console.log("permission : ", msg);

        setPermission(msg);
      } else {
        console.log(data);
      }
    });
    GetAllAdminMenuItems().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setMenuItemsList(msg);
      } else {
        console.log(data);
      }
    });
  }, []);

  const handleMenuClick = (item, hasSubmenu) => {
    if (hasSubmenu) {
      setOpenSubmenus((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    } else {
      setActiveComponent(item.alias);
      setData({ labelValue: item.name, permission: permission[item.role] });
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const ActiveComponent = COMPONENT_MAP[activeComponent] || AdminFirstPage;

  return (
    <div className="lg:flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 overflow-y-auto z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out w-64 bg-gray-800 text-white h-screen lg:translate-x-0 lg:static lg:inset-auto`}
      >
        <div className="flex justify-between items-center p-5">
          <h1
            className="text-2xl font-bold cursor-pointer"
            onClick={() =>
              handleMenuClick(
                {
                  name: "firstPage",
                  alias: "firstPage",
                  role: "have_firstPage_access",
                },
                false
              )
            }
          >
            Carcare
          </h1>
          <button
            className="lg:hidden rounded-full hover:bg-gray-700 w-10"
            onClick={toggleSidebar}
          >
            <i className="ri-close-large-line text-xl"></i>
          </button>
        </div>

        <ul className="space-y-2">
          {permission &&
            menuItemsList
              .filter(
                (item) => !item.parent_id && permission[item.role].includes("1")
              )
              .map((item) => {
                const subItems = menuItemsList.filter(
                  (sub) => sub.parent_id === item.id
                );
                const hasSubmenu = subItems.length > 0;
                return (
                  <li key={item.id}>
                    <div
                      className="flex items-center justify-between p-3 hover:bg-gray-500 rounded cursor-pointer"
                      onClick={() => handleMenuClick(item, hasSubmenu)}
                    >
                      <span>{item.name}</span>
                      {hasSubmenu && (
                        <span>
                          {openSubmenus[item.id] ? (
                            <FaAngleDown />
                          ) : (
                            <FaAngleRight />
                          )}
                        </span>
                      )}
                    </div>

                    {hasSubmenu && openSubmenus[item.id] && (
                      <ul className="ml-4 border-l-2 border-gray-600 pl-2">
                        {subItems.map(
                          (sub) =>
                            permission[sub.role].includes("1") && (
                              <li
                                key={sub.id}
                                className="p-2 hover:bg-gray-500 rounded"
                              >
                                <div
                                  onClick={() => handleMenuClick(sub, false)}
                                >
                                  {sub.name}
                                </div>
                              </li>
                            )
                        )}
                      </ul>
                    )}
                  </li>
                );
              })}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <button className="lg:hidden" onClick={toggleSidebar}>
          <i className="ri-menu-line text-2xl"></i>
        </button>

        <ActiveComponent data={data} permission={permission} />
      </div>
    </div>
  );
}

export default AdminIndex;
