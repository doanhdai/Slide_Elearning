import React, { useEffect } from "react";
import { X } from "lucide-react";

const Notification = ({
  message,
  type = "success",
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = type === "success" ? "bg-green-50" : "bg-red-50";
  const textColor = type === "success" ? "text-green-800" : "text-red-800";
  const borderColor =
    type === "success" ? "border-green-200" : "border-red-200";

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`${bgColor} border ${borderColor} rounded-lg shadow-lg p-4 min-w-[300px]`}
      >
        <div className="flex items-center justify-between">
          <div className={`${textColor} font-medium`}>{message}</div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
