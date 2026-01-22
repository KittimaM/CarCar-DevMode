import { useEffect, useState, useRef, Suspense } from "react";
import { GetModuleByPermission } from "../Api";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import componentMap from "./componentMap";

function AdminIndex() {
  const defaultPage = sessionStorage.setItem("activeMenu", "home");
  const [permission, setPermission] = useState();
  const [modules, setModules] = useState([]);
  const [activeCode, setActiveCode] = useState(defaultPage);
  const [data, setData] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const sidebarRef = useRef(null);

  useEffect(() => {
    GetModuleByPermission().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {      
        let result = Object.values(
          msg.reduce((role, item) => {
            const { module_id, permission_action } = item;
            if (!role[module_id]) {
              role[module_id] = {
                module_id: item.module_id,
                code: item.code,
                name: item.name,
                parent_id: item.parent_id,
                permission_actions: [],
              };
            }
            role[module_id].permission_actions.push(permission_action);
            return role;
          }, {})
        );

        result = result.filter((item) => item.permission_actions.includes('view'));       
        setModules(result);
        setPermission(result);
      } else {
        console.log(data);
      }
    });

    const saved = sessionStorage.getItem("activeMenu");
    if (saved) {
      setActiveCode(saved);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  const handleMenuClick = (item, hasSubmenu) => {
    if (hasSubmenu) {
      setOpenSubmenus((prev) => ({
        ...prev,
        [item.module_id]: !prev[item.module_id],
      }));
      return;
    }

    setActiveCode(item.code);
    sessionStorage.setItem("activeMenu", item.code);

    setData({ labelValue: item.name, permission: permission });

    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const ActiveComponent = componentMap[activeCode] || componentMap["home"];

  return (
    <div className="lg:flex">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 w-64 h-screen bg-gray-800 text-white z-50 transform
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition`}
      >
        <div className="p-5 font-bold text-xl">Carcare</div>

        {modules
          .filter((m) => Number(m.parent_id) === 0)
          .map((item) => {
            const subs = modules.filter(
              (s) => Number(s.parent_id) === Number(item.module_id)
            );

            return (
              <div key={item.module_id}>
                <div
                  className="p-3 cursor-pointer hover:bg-gray-600 flex justify-between"
                  onClick={() => handleMenuClick(item, subs.length > 0)}
                >
                  {item.name}
                  {subs.length > 0 &&
                    (openSubmenus[item.module_id] ? (
                      <FaAngleDown />
                    ) : (
                      <FaAngleRight />
                    ))}
                </div>

                {subs.length > 0 && openSubmenus[item.module_id] && (
                  <div className="ml-4 border-l border-gray-600">
                    {subs.map((sub) => (
                      <div
                        key={sub.module_id}
                        className="p-2 cursor-pointer hover:bg-gray-600"
                        onClick={() => handleMenuClick(sub, false)}
                      >
                        {sub.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Content */}
      <div className="flex-1 bg-gray-100 min-h-screen">
        <div className="lg:ml-64 mt-16 p-4">
          <Suspense fallback={<div>Loading...</div>}>
            <ActiveComponent data={data} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default AdminIndex;
