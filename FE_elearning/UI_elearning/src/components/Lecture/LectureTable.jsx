import React, { useState, useRef, useEffect } from "react";
import LectureRow from "./LectureRow";
import { ChevronDown, X } from "lucide-react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineReport } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { deleteLecture, updateLecture } from "../../services/lectureService";
import EditLectureModal from "./EditLectureModal";
import DeleteConfirmModal from "../Modal/DeleteConfirmModal";
import Notification from "../Notification/Notification";

const LectureTable = ({ lectures, onRefresh }) => {
  const navigate = useNavigate();
  const [modalState, setModalState] = useState({
    isOpen: false,
    lecture: null,
    position: { x: 0, y: 0 },
  });
  const [editModalState, setEditModalState] = useState({
    isOpen: false,
    lecture: null,
  });
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    lecture: null,
  });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (lecture, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalState({
      isOpen: true,
      lecture,
      position: {
        x: rect.right - 200,
        y: rect.top,
      },
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      lecture: null,
      position: { x: 0, y: 0 },
    });
  };

  const handleAddSlide = () => {
    if (modalState.lecture) {
      navigate(`/slides/${modalState.lecture.id}`);
    }
    handleCloseModal();
  };

  const handleDelete = async () => {
    try {
      const response = await deleteLecture(deleteModalState.lecture.id);
      if (response.status === 200) {
        setNotification({
          show: true,
          message: "Xóa bài giảng thành công!",
          type: "success",
        });
        onRefresh();
        setDeleteModalState({ isOpen: false, lecture: null });
      } else {
        setNotification({
          show: true,
          message: "Có lỗi xảy ra khi xóa bài giảng!",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting lecture:", error);
      setNotification({
        show: true,
        message: "Có lỗi xảy ra khi xóa bài giảng!",
        type: "error",
      });
    }
  };

  const handleReport = () => {
    console.log("Báo cáo bài giảng:", modalState.lecture.id);
    handleCloseModal();
  };

  const handleEditSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await updateLecture(editModalState.lecture.id, formData);
      if (response.status === 200) {
        setNotification({
          show: true,
          message: "Cập nhật bài giảng thành công!",
          type: "success",
        });
        setEditModalState({ isOpen: false, lecture: null });
        onRefresh();
      } else {
        setNotification({
          show: true,
          message: "Có lỗi xảy ra khi cập nhật bài giảng!",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error updating lecture:", error);
      setNotification({
        show: true,
        message: "Có lỗi xảy ra khi cập nhật bài giảng!",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalState.isOpen && !event.target.closest(".modal-content")) {
        handleCloseModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalState.isOpen]);

  return (
    <div className="relative">
      <table className="w-full border border-[#e5e7eb]">
        <thead className="bg-white border-b border-[#e5e7eb]">
          <tr>
            <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span className="font-semibold">Tên bài giảng</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs uppercase tracking-wider font-semibold">
              Người yêu cầu
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Ngày tạo
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>Link bài giảng</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold  uppercase tracking-wider">
              <div className="flex items-center space-x-1">
                <span>Trạng thái</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium  uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {lectures.map((lecture) => (
            <LectureRow
              key={lecture.id}
              lecture={lecture}
              onOpenModal={handleOpenModal}
              onOpenEditModal={(lecture) =>
                setEditModalState({ isOpen: true, lecture })
              }
            />
          ))}
        </tbody>
      </table>

      {/* Action Modal */}
      {modalState.isOpen && (
        <div
          className="fixed z-50 modal-content"
          style={{
            top: modalState.position.y,
            left: modalState.position.x,
            transform: "translateY(-50%)",
          }}
        >
          <div className="bg-white rounded-lg shadow-lg w-48 border border-gray-200">
            <div className="p-2">
              <div className="space-y-1">
                {modalState.lecture?.status === "New" && (
                  <button
                    onClick={handleAddSlide}
                    className="w-full flex items-center text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <IoIosAddCircleOutline />
                    Tạo bài giảng
                  </button>
                )}
                <button
                  onClick={() => {
                    setDeleteModalState({
                      isOpen: true,
                      lecture: modalState.lecture,
                    });
                    handleCloseModal();
                  }}
                  className="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                >
                  <AiOutlineDelete />
                  Xóa bài giảng
                </button>
                <button
                  onClick={handleReport}
                  className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <MdOutlineReport />
                  Báo cáo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditLectureModal
        isOpen={editModalState.isOpen}
        onClose={() => setEditModalState({ isOpen: false, lecture: null })}
        lecture={editModalState.lecture}
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, lecture: null })}
        onConfirm={handleDelete}
        title="Xác Nhận Xóa Bài Giảng"
        message="Bạn có chắc chắn muốn xóa bài giảng này? Hành động này không thể hoàn tác."
      />

      {/* Notification */}
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
    </div>
  );
};

export default LectureTable;
