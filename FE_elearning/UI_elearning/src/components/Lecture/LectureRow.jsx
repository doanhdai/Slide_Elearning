// components/Lecture/LectureRow.jsx
import { FileText, MoreHorizontal, Copy } from "lucide-react";
import React, { useState } from "react";
import { formatDateTime } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";

const getStatusColor = (status) => {
  switch (status) {
    case "Created":
      return "text-[#05c3fb] bg-[#e6f9ff]";
    case "New":
      return "text-[#1abe17] bg-[#1abe171a]";
    case "Creating":
      return "text-[#1abe17] bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "Created":
      return "Đã tạo";
    case "New":
      return "Mới";
    case "Creating":
      return "Đang tạo";
    default:
      return status;
  }
};

const LectureRow = ({ lecture, onOpenModal, onOpenEditModal }) => {
  const navigate = useNavigate();
  console.log(lecture);
  const [showCopyButton, setShowCopyButton] = useState(false);

  const handleNameClick = () => {
    navigate(`/slides/${lecture.id}?mode=edit`);
  };

  const handleCopyLink = (e) => {
    e.stopPropagation();
    const lectureUrl = `${window.location.origin}/slides/${lecture.id}?mode=view`;
    navigator.clipboard.writeText(lectureUrl);
  };

  return (
    <tr className="hover:bg-gray-50">
      <td
        className="px-6 py-4 text-sm text-gray-900 cursor-pointer hover:text-indigo-600 hover:underline"
        onClick={() => onOpenEditModal(lecture)}
      >
        {lecture.id}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div>
            <div
              className="text-sm font-medium text-gray-900 cursor-pointer hover:underline"
              onClick={handleNameClick}
            >
              {lecture.lectureName}
            </div>
            <div className="text-sm text-gray-500">
              Môn {lecture.subject} - Lớp {lecture.studyClass}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {lecture.user?.fullName}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {formatDateTime(lecture.createdAt)}
      </td>
      <td
        className="px-6 py-4"
        onMouseEnter={() => setShowCopyButton(true)}
        onMouseLeave={() => setShowCopyButton(false)}
      >
        {lecture.lectureLink ? (
          <div className="space-y-1 relative group">
            <div className="relative inline-block">
              <div
                onClick={() => navigate(`/slides/${lecture.id}?mode=view`)}
                target="_blank"
                className="text-indigo-600 hover:text-indigo-900 hover:underline cursor-pointer"
              >
                Xem bài giảng
              </div>
              {showCopyButton && (
                <button
                  onClick={handleCopyLink}
                  className="absolute right-0 cursor-pointer bottom-full mb-1 p-2 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50"
                  title="Copy link"
                >
                  <Copy className="w-3 h-3 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <span className="text-gray-400">N/A</span>
        )}
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex px-2 py-1 text-xs badge font-bold rounded-full ${getStatusColor(
            lecture.status
          )}`}
        >
          • {getStatusText(lecture.status)}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={(e) => onOpenModal(lecture, e)}
          className="text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};

export default LectureRow;
