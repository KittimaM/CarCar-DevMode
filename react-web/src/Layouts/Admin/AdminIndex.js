import { useEffect, useState, useRef, Suspense, useMemo } from "react";
import { GetModuleByPermission } from "../Api";
import { FaAngleDown, FaAngleRight, FaBars } from "react-icons/fa";
import componentMap from "./componentMap";

function AdminIndex() {
  const [permission, setPermission] = useState([]);
  const [modules, setModules] = useState([]);
  const [activeCode, setActiveCode] = useState("home");
  const [data, setData] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const sidebarRef = useRef(null);

  useEffect(() => {
    GetModuleByPermission().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        let result = Object.values(
          msg.reduce((acc, item) => {
            const { module_id, permission_action } = item;

            if (!acc[module_id]) {
              acc[module_id] = {
                module_id: item.module_id,
                code: item.code,
                name: item.name,
                parent_id: item.parent_id,
                permission_actions: [],
              };
            }

            acc[module_id].permission_actions.push(permission_action);
            return acc;
          }, {})
        );

        result = result.filter((m) =>
          m.permission_actions.includes("view")
        );

        setModules(result);
        setPermission(result);
      }
    });

    const saved = sessionStorage.getItem("activeMenu");
    if (saved) setActiveCode(saved);

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickOutside = (e) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(e.target)
    ) {
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

    setData({
      labelValue: item.name,
      permission: permission,
    });

    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const parentModules = useMemo(
    () => modules.filter((m) => Number(m.parent_id) === 0),
    [modules]
  );

  const getSubModules = (parentId) =>
    modules.filter(
      (m) => Number(m.parent_id) === Number(parentId)
    );

  const ActiveComponent =
    componentMap[activeCode] || componentMap["home"];

  return (
    <div className="lg:flex">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 w-64 h-screen bg-gray-800 text-white z-50 transform
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 transition-transform duration-300`}
      >
        <div className="p-5 font-bold text-xl border-b border-gray-700">
          Carcare
        </div>

        {parentModules.map((item) => {
          const subs = getSubModules(item.module_id);
          const hasSub = subs.length > 0;

          return (
            <div key={item.module_id}>
              <div
                className="p-3 cursor-pointer hover:bg-gray-600 flex justify-between items-center"
                onClick={() => handleMenuClick(item, hasSub)}
              >
                <span>{item.name}</span>
                {hasSub &&
                  (openSubmenus[item.module_id] ? (
                    <FaAngleDown />
                  ) : (
                    <FaAngleRight />
                  ))}
              </div>

              {hasSub && openSubmenus[item.module_id] && (
                <div className="ml-4 border-l border-gray-600">
                  {subs.map((sub) => (
                    <div
                      key={sub.module_id}
                      className="p-2 cursor-pointer hover:bg-gray-600"
                      onClick={() =>
                        handleMenuClick(sub, false)
                      }
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

      <div className="flex-1 bg-gray-100 min-h-screen">
        <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow flex items-center px-4 lg:ml-64 z-30">
          <button
            className="lg:hidden mr-4"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FaBars size={20} />
          </button>
          <span className="font-semibold">
            {data.labelValue || "Home"}
          </span>
        </div>

        <div className="pt-20 lg:ml-64 p-4">
          <Suspense fallback={<div>Loading...</div>}>
            <ActiveComponent data={data} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default AdminIndex;
