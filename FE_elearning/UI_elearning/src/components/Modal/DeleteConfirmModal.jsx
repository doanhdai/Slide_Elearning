import React from "react";
import { X } from "lucide-react";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-lg shadow-xl z-10 w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {title || "Xác Nhận Xóa"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 mb-6">
            {message ||
              "Bạn có chắc chắn muốn xóa bài giảng này? Hành động này không thể hoàn tác."}
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-all"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-all"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
