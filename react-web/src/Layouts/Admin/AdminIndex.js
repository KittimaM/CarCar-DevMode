import React, { useEffect, useState ,useRef} from "react";
import { GetPermission, GetAllAdminMenuItems } from "../Api";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import "remixicon/fonts/remixicon.css";
import AdminHome from "./AdminHome";
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
import AdminBooking from "./AdminBooking";
import AdminSchedule from "./AdminSchedule";
import AdminTemplate from "./AdminTemplate";
import AdminSearch from "./AdminSearch";
import AdminAdvanceSetting from "./AdminAdvanceSetting";
import AdminStaff from "./AdminUser/AdminStaff";
import AdminCustomerCar from "./AdminUser/AdminCustomerCar";
import AdminCustomer from "./AdminUser/AdminCustomer";
import AdminOnLeaveType from "./AdminOnLeaveType";
import AdminPaymentType from "./AdminPaymentType";

const COMPONENT_MAP = {
  home: AdminHome,
  schedule: AdminSchedule,
  booking: AdminBooking,
  payment: AdminPayment,
  staff: AdminStaff,
  customer: AdminCustomer,
  customerCar: AdminCustomerCar,
  onLeavePersonal: AdminOnLeavePersonal,
  dayOffList: AdminDayOff,
  carSize: AdminCarSize,
  service: AdminService,
  channel: AdminChannel,
  template: AdminTemplate,
  search: AdminSearch,
  role: AdminRole,
  account: AdminAccount,
  onLeaveList: AdminOnLeaveList,
  status: AdminStatus,
  onLeaveType: AdminOnLeaveType,
  paymentType: AdminPaymentType,
  advSetting: AdminAdvanceSetting,
};

function AdminIndex() {
  const [permission, setPermission] = useState({});
  const [menuItemsList, setMenuItemsList] = useState([]);
  const [activeComponent, setActiveComponent] = useState("home");
  const [data, setData] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  
  const [activeMenu, setActiveMenu] = useState("home"); 
  const sidebarRef = useRef(null);

  useEffect(() => {
    GetPermission().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
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

    // Retrieve active menu from localStorage
    const storedActiveMenu = localStorage.getItem("activeMenu");
    if (storedActiveMenu) {
      setActiveMenu(storedActiveMenu);
      setActiveComponent(storedActiveMenu);
    }

    // Attach event listener when sidebar is open
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };


  }, [isSidebarOpen]);


   // Function to handle clicks outside sidebar
   const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };


  const handleMenuClick = (item, hasSubmenu) => {
      if (hasSubmenu) {
      setOpenSubmenus((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    } else {
      setActiveComponent(item.alias);
      setActiveMenu(item.id);
      localStorage.setItem("activeMenu", item.alias);

       // Close sidebar only if screen width is less than 1024px (responsive mode)
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
      // Set permission for the selected component
      const permissionResult = permission.find((pm) => pm.page_alias === item.alias);
      setData({ labelValue: item.name, permission: permissionResult });
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

 
  

  const ActiveComponent = COMPONENT_MAP[activeComponent] || AdminHome;



  return (
    <div className="lg:flex ">
      {/* Sidebar */}
      <div
        ref={sidebarRef} // Attach ref to sidebar
        className={`fixed top-0 left-0 overflow-y-auto z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out w-64 bg-gray-800 text-white h-screen lg:translate-x-0 lg:fixed lg:inset-auto `}
      >
        <div className="flex justify-between items-center p-5">
          <h1 className="text-2xl font-bold cursor-pointer">Carcare</h1>
          <button
            className="lg:hidden rounded-full hover:bg-gray-700 w-10"
            onClick={toggleSidebar}
          >
            <i className="ri-close-large-line text-xl"></i>
          </button>
        </div>

        <ul className="space-y-2">
          {Object.keys(permission).length != 0 &&
            menuItemsList
              .filter((item) => {
                const hasPermission =
                  !item.parent_alias &&
                  permission.find(
                    (pm) => pm.page_alias == item.alias && pm.access == "1"
                  );

                return hasPermission || item.alias === "home";
              })
              .map((item) => {
                const subItems = menuItemsList.filter(
                  (sub) =>
                    sub.parent_alias == item.alias &&
                    permission.find(
                      (pm) => pm.page_alias == sub.alias && pm.access == "1"
                    )
                );
                const hasSubmenu = subItems.length > 0;
                return (
                  <li key={item.id}>
                    <div
                      className={`flex items-center justify-between p-3 rounded cursor-pointer 
                      ${activeMenu === item.id ? "bg-blue-500 text-white" : "hover:bg-gray-500"}`}
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
                        {subItems.map((sub) => (
                          <li
                            key={sub.id}
                            className={`p-2 rounded cursor-pointer 
                            ${activeMenu === sub.id ? "bg-blue-500 text-white" : "hover:bg-gray-500"}`}
                            onClick={() => handleMenuClick(sub, false)}
                          >
                            <div onClick={() => handleMenuClick(sub, false)}>
                              {sub.name}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 bg-[#e8ebed] lg:ml-64  h-screen overflow-y-auto">
        <button
          className="lg:hidden fixed bg-[#181d2a] p-2 rounded-lg top-1 left-1"
          onClick={toggleSidebar}
        >
          <i className="ri-menu-line text-3xl text-[#ececec]"></i>
        </button>

        <ActiveComponent data={data} permission={permission} />
        
      </div>
    </div>
  );
}

export default AdminIndex;
