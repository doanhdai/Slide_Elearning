import React from "react";
import { RefreshCw, ChevronDown, Download, Plus } from "lucide-react";

const Header = ({ onAddClick }) => {
  return (
    <div className="bg-white px-6 py-4 border border-[#e5e7eb]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Danh sách bài giảng
          </h1>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <span>Bài giảng</span>
            <span></span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onAddClick}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm bài giảng</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
