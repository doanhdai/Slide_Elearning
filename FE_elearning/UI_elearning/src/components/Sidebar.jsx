import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  FileText,
  BookOpen,
  Settings,
  User,
  Users,
  HelpCircle,
  Database,
} from "lucide-react";

export const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-sm">
      {/* Logo */}
      <div className="p-4.5 flex justify-center items-center">
        <img
          className="w-[130px]"
          src="https://admin-dev.kientre.vn/assets/img/logo.jpg"
        />
      </div>

      {/* Navigation */}
      <nav className="mt-4">
        <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider mt-4">
          NGƯỜI DÙNG
        </div>
        <div className="px-4 py-2 flex items-center justify-between text-gray-700 hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-3" />
            Học sinh
          </div>
          <ChevronDown className="w-4 h-4" />
        </div>
        <div className="px-4 py-2 flex items-center justify-between text-gray-700 hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-3" />
            Giáo viên
          </div>
          <ChevronDown className="w-4 h-4" />
        </div>

        <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider mt-4">
          CHƯƠNG TRÌNH
        </div>
        <div className="px-4 py-2 flex items-center text-red-600 bg-red-50 cursor-pointer border-r-2 border-red-600">
          <FileText className="w-4 h-4 mr-3" />
          Danh sách bài giảng
        </div>
        <div className="px-4 py-2 flex items-center text-gray-700 hover:bg-gray-50 cursor-pointer">
          <BookOpen className="w-4 h-4 mr-3" />
          {/* Danh sách bài giảng */}
        </div>

        <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider mt-4">
          BÁO CÁO
        </div>
        <div className="px-4 py-2 flex items-center text-gray-700 hover:bg-gray-50 cursor-pointer">
          <FileText className="w-4 h-4 mr-3" />
          Báo cáo học sinh
        </div>

        <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider mt-4">
          QUẢN TRỊ ADMIN
        </div>
        <div className="px-4 py-2 flex items-center text-gray-700 hover:bg-gray-50 cursor-pointer">
          <Users className="w-4 h-4 mr-3" />
          Danh sách nhân sự
        </div>
        <div className="px-4 py-2 flex items-center text-gray-700 hover:bg-gray-50 cursor-pointer">
          <Settings className="w-4 h-4 mr-3" />
          Quyền hạn
        </div>

        <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider mt-4">
          HỖ TRỢ
        </div>
        <div className="px-4 py-2 flex items-center text-gray-700 hover:bg-gray-50 cursor-pointer">
          <HelpCircle className="w-4 h-4 mr-3" />
          Tin nhắn hỗ trợ
        </div>
        <div className="px-4 py-2 flex items-center text-gray-700 hover:bg-gray-50 cursor-pointer">
          <FileText className="w-4 h-4 mr-3" />
          Yêu cầu
        </div>
      </nav>
    </div>
  );
};
