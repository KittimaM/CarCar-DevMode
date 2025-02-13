import React, { useEffect, useState } from "react";
import { GetPermission, GetAllAdminRoleLabel } from "../Api";


import 'remixicon/fonts/remixicon.css';
import { NavLink } from 'react-router-dom';


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

function AdminIndex() {
  const [permission, setPermission] = useState(null);
  const [roleLabelList, setRoleLabelList] = useState([]);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isMasterTable, setIsMasterTable] = useState(false);
  const [isStatus, setIsStatus] = useState(false);
  const [isChannel, setIsChannel] = useState(false);
  const [isDayOffList, setIsDayOffList] = useState(false);
  const [isOnLeaveList, setIsOnLeaveList] = useState(false);
  const [isOnLeavePersonal, setIsOnLeavePersonal] = useState(false);
  const [isPayment, setIsPayment] = useState(false);
  const [isAccount, setIsAccount] = useState(false);
  const [isRole, setIsRole] = useState(false);
  const [isService, setIsService] = useState(false);
  const [isCarSize, setIsCarSize] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isSchedule, setIsSchedule] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isGeneralSetting, setIsGeneralSetting] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    GetPermission().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setPermission(msg);
      } else {
        console.log(data);
      }
    });
    GetAllAdminRoleLabel().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setRoleLabelList(msg);
      } else {
        console.log(data);
      }
    });
  }, []);

  const handleSelectedContent = (event) => {
    event.preventDefault();
    const dataValue = event.currentTarget.getAttribute("data-value");
    const labelValue = event.currentTarget.getAttribute("label-value");
    const roleValue = event.currentTarget.getAttribute("role-value");

    setIsFirstPage(dataValue == "firstPage" ? true : false);
    setIsMasterTable(dataValue == "masterTable" ? true : false);
    setIsStatus(dataValue == "status" ? true : false);
    setIsChannel(dataValue == "channel" ? true : false);
    setIsDayOffList(dataValue == "dayOffList" ? true : false);
    setIsOnLeaveList(dataValue == "onLeaveList" ? true : false);
    setIsOnLeavePersonal(dataValue == "onLeavePersonal" ? true : false);
    setIsPayment(dataValue == "payment" ? true : false);
    setIsAccount(dataValue == "account" ? true : false);
    setIsRole(dataValue == "role" ? true : false);
    setIsService(dataValue == "service" ? true : false);
    setIsCarSize(dataValue == "carSize" ? true : false);
    setIsUser(dataValue == "user" ? true : false);
    setIsBooking(dataValue == "booking" ? true : false);
    setIsSchedule(dataValue == "schedule" ? true : false);
    setIsTemplate(dataValue == "template" ? true : false);
    setIsSearch(dataValue == "search" ? true : false);
    setIsGeneralSetting(dataValue == "generalSetting" ? true : false);

    const data = {
      labelValue: labelValue,
      permission: permission[roleValue],
    };
    setData(data);
  };

// -----------------------------------------------------

  const [activeMenu, setActiveMenu] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);



  const handleMenuClick = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
};

const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
};




  return (
    <div>
      {/* <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div class="px-3 py-3 lg:px-5 lg:pl-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 "
                
              >
                <span class="sr-only">Open sidebar</span>
                <svg
                  class="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a class="flex ms-2 md:me-24">
                <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Carcare
                </span>
              </a>
            </div>
            <div class="flex items-center">
              <div class="flex items-center ms-3">
                <div>
                  <button
                    type="button"
                    class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                  >
                    <span class="sr-only">Open user menu</span>
                    <img class="w-8 h-8 rounded-full" src="" alt="user photo" />
                  </button>
                </div>
                <div
                  class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                  id="dropdown-user"
                >
                  <div class="px-4 py-3" role="none">
                    <p
                      class="text-sm text-gray-900 dark:text-white"
                      role="none"
                    >
                      Neil Sims
                    </p>
                    <p
                      class="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                      role="none"
                    >
                      neil.sims@flowbite.com
                    </p>
                  </div>
                  <ul class="py-1" role="none">
                    <li>
                      <a
                        href="#"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav> */}

      {/* <aside
      
        id="logo-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >

        <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <div className='flex justify-between items-center p-5'>
                    <h1 className='text-2xl font-bold'>Sidebar</h1>
                    <button className='lg:hidden rounded-full hover:bg-gray-700 w-10' onClick={toggleSidebar}>
                        <i class="ri-close-large-line text-xl"></i>
                    </button>
                </div>
          <ul class="space-y-2 font-medium">
            <li>
              <a
                onClick={handleSelectedContent}
                data-value="firstPage"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span class="ms-3">Home</span>
              </a>
            </li>
            {roleLabelList &&
              roleLabelList.map((roleLabel) => (
                <div>
                  {roleLabel.module_level == 1 &&
                    permission &&
                    permission[roleLabel.role].includes("1") && (
                      <li>
                        <a
                          onClick={handleSelectedContent}
                          data-value={roleLabel.data_value}
                          label-value={roleLabel.label}
                          role-value={roleLabel.role}
                          class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                          <svg
                            class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 21"
                          >
                            <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                            <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                          </svg>
                          <span class="ms-3">{roleLabel.label}</span>
                        </a>
                      </li>
                    )}
                </div>
              ))}
          </ul>
        </div>
      </aside> */}

  <div className='lg:flex'>
            <div className={`fixed inset-y-0 left-0 overflow-y-auto z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out w-64 bg-gray-800 text-white h-screen lg:translate-x-0 lg:static lg:inset-auto`}>
                <div className='flex justify-between items-center p-5'>
                    <h1 className='text-2xl font-bold'>Sidebar</h1>
                    <button className='lg:hidden rounded-full hover:bg-gray-700 w-10' onClick={toggleSidebar}>
                        <i class="ri-close-large-line text-xl"></i>
                    </button>
                </div>

                <div className='overflow-y-auto'>
                {roleLabelList &&
                  roleLabelList.map((roleLabel) => (
                    <div>
                      {roleLabel.module_level == 1 &&
                        permission &&
                        permission[roleLabel.role].includes("1") && (

                           <div key={roleLabel.id}>
                              
                            <div className='flex items-center p-4 hover:bg-gray-700 cursor-pointer' onClick={handleSelectedContent}>
                                <div className='mr-4'>  </div>
                                <div>{roleLabel.label}</div>
                                {roleLabel.submenu && (
                                    <div className={`ml-auto transition-transform ${activeMenu === roleLabel.id ? 'rotate-90' : ''}`}>
                                        <i className="ri-arrow-right-s-line"></i>
                                    </div>
                                )}
                            </div>
                            {roleLabel.submenu && activeMenu === roleLabel.id && (
                                <div className='ml-8'>
                                    {roleLabel.submenu.map((subitem) => (
                                        <NavLink to={subitem.path} key={subitem.id} className='flex items-center p-4 hover:bg-gray-700' activeClassName='bg-gray-700'>
                                            <div>{subitem.name}</div>
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>

                        )}
                      </div>  
                       
                    ))}
                </div>
            </div>
            <div className='flex-1 p-4'>
                <button className='lg:hidden' onClick={toggleSidebar}>
                    <i className="ri-menu-line text-2xl"></i>
                </button>
                {/* Main content goes here */}
            </div>
        </div>

      {isFirstPage && <AdminFirstPage />}
      {isSchedule && (
        <AdminSchedule permission={permission["have_schedule_access"]} />
      )}
      {isBooking && <AdminBooking />}
      {isUser && (
        <AdminUser
          staffPermission={permission["have_staff_access"]}
          customerPermission={permission["have_customer_access"]}
        />
      )}
      {isCarSize && <AdminCarSize data={data} />}
      {isService && <AdminService data={data} />}
      {isRole && <AdminRole data={data} />}
      {isAccount && <AdminAccount data={data} />}
      {isPayment && <AdminPayment />}
      {isOnLeavePersonal && <AdminOnLeavePersonal data={data} />}
      {isOnLeaveList && <AdminOnLeaveList data={data} />}
      {isDayOffList && <AdminDayOff data={data} />}
      {isChannel && <AdminChannel data={data} />}
      {isMasterTable && (
        <AdminMasterTable
          onLeaveTypePermission={permission["have_on_leave_type_access"]}
          paymentTypePermission={permission["have_payment_type_access"]}
        />
      )}
      {isStatus && <AdminStatus data={data} />}
      {isTemplate && <AdminTemplate data={data} />}
      {isSearch && <AdminSearch data={data} />}
      {isGeneralSetting && <AdminGeneralSetting data={data} />}
    </div>
  );
}

export default AdminIndex;
