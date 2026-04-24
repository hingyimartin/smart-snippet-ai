import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

const DURATION = 3000;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, DURATION);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {createPortal(
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-9999 flex flex-col gap-3 items-center">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-4 py-3 rounded-2xl text-white shadow-lg min-w-64
                animate-toast-in ${getToastStyle(toast.type)}`}
            >
              {toast.message}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
};

const getToastStyle = (type) => {
  switch (type) {
    case "success":
      return "bg-green-700";
    case "error":
      return "bg-red-700";
    case "info":
      return "bg-blue-600";
    default:
      return "bg-gray-800";
  }
};
