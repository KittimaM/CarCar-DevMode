import { useEffect, useState } from "react";

const Notification = ({ message, status, duration = 3000 }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(timer);
  }, [status, duration]);

  if (!show) return null;

  const getAlertClass = () => {
    switch (status) {
      case "ERROR":
        return "bg-red-100 text-red-800";
      case "WARNING":
        return "bg-yellow-100 text-yellow-800";
      case "SUCCESS":
        return "bg-green-100 text-green-800";
      default:
        return;
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 w-full max-w-sm">
      <div role="alert" className={`alert shadow-lg ${getAlertClass()}`}>
        <span>{message}</span>
        <button
          onClick={() => setShow(false)}
          className="btn btn-sm btn-ghost ml-auto"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Notification;
