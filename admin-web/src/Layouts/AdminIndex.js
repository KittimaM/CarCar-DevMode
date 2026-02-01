import { useEffect, useState, Suspense, useMemo } from "react";
import { GetModuleByPermission } from "./Modules/Api";
import { FaAngleDown, FaAngleRight, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import componentMap from "./componentMap";

function AdminIndex() {
  const [permission, setPermission] = useState([]);
  const [modules, setModules] = useState([]);
  const [activeCode, setActiveCode] = useState("home");
  const [data, setData] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});

  useEffect(() => {
    GetModuleByPermission().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        const result = Object.values(
          msg.reduce((acc, item) => {
            if (!acc[item.module_id]) {
              acc[item.module_id] = {
                module_id: item.module_id,
                code: item.code,
                name: item.name,
                parent_id: item.parent_id,
                permission_actions: [],
              };
            }
            acc[item.module_id].permission_actions.push(item.permission_action);
            return acc;
          }, {}),
        ).filter((m) => m.permission_actions.includes("view"));

        setModules(result);
        setPermission(result);
      }
    });
  }, []);

  const parentModules = useMemo(
    () => modules.filter((m) => Number(m.parent_id) === 0),
    [modules],
  );

  const getSubModules = (parentId) =>
    modules.filter((m) => Number(m.parent_id) === Number(parentId));

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleMenuClick = (item, hasSub) => {
    if (hasSub) {
      setOpenSubmenus((prev) => ({
        ...prev,
        [item.module_id]: !prev[item.module_id],
      }));
      return;
    }

    setActiveCode(item.code);
    setData({ labelValue: item.name, permission, code: item.code });

    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const ActiveComponent = componentMap[activeCode] || componentMap["home"];

  return (
    <div className="min-h-screen bg-gray-100">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white z-50
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
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
                className="p-3 cursor-pointer hover:bg-gray-600 flex justify-between"
                onClick={() => handleMenuClick(item, hasSub)}
              >
                {item.name}
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
      </aside>

      <div className="lg:ml-64">
        <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow flex items-center px-4 z-30 lg:ml-64">
          <button className="lg:hidden" onClick={toggleSidebar}>
            <FaBars size={20} />
          </button>

          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm">
                {sessionStorage.getItem("username")}
              </div>
            </div>

            <Link to="/" className="text-sm text-red-600 hover:underline">
              Log out
            </Link>
          </div>
        </header>

        <main className="pt-20 p-4">
          <Suspense fallback={<div>Loading...</div>}>
            <ActiveComponent data={data} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default AdminIndex;
