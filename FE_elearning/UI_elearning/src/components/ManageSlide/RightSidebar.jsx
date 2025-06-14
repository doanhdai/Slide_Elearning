import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RightSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  lectureTitle,
  setLectureTitle,
  duplicateSlide,
  deleteSlide,
  resetContent,
  currentSlide,
  slides,
  getCurrentSlideContent,
  thumbnailsVisible,
}) => {
  const [teacherChecked, setTeacherChecked] = useState(false);
  const [studentChecked, setStudentChecked] = useState(false);

  useEffect(() => {
    const currentSlideData = slides.find((slide) => slide.id === currentSlide);
    console.log(currentSlideData);
    if (currentSlideData) {
      const role = currentSlideData.role?.id;
      if (role === 1) {
        setTeacherChecked(true);
        setStudentChecked(false);
      } else if (role === 2) {
        setTeacherChecked(false);
        setStudentChecked(true);
      } else if (role === 3) {
        setTeacherChecked(true);
        setStudentChecked(true);
      } else {
        setTeacherChecked(false);
        setStudentChecked(false);
      }
    }
  }, [currentSlide, slides]);

  return (
    <>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-1/2 transform -translate-y-1/2 z-40 w-8 h-16 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-l-xl flex items-center justify-center hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 ${
          sidebarOpen ? "right-80" : "right-0"
        }`}
      >
        {sidebarOpen ? (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Right Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white/80 backdrop-blur-sm border-l border-gray-200/50 transform transition-all duration-300 shadow-xl ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: "81px", height: "calc(100vh - 81px)" }}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="space-y-8">
            {/* Target Audience */}
            <div className="bg-white/60 rounded-xl p-5 border border-gray-200/50">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                <span>Đối tượng</span>
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={teacherChecked}
                    onChange={(e) => setTeacherChecked(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    Giáo viên
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={studentChecked}
                    onChange={(e) => setStudentChecked(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    Học sinh
                  </span>
                </label>
              </div>
            </div>

            {/* HTML Editor Button */}
            <div className="bg-white/60 rounded-xl p-3 border border-gray-200/50">
              <div className="flex items-center space-x-3 bg-white/60 rounded-lg px-4 py-2">
                <span className="text-sm font-medium text-gray-600">
                  Tiêu đề:
                </span>
                <input
                  type="text"
                  value={lectureTitle}
                  onChange={(e) => setLectureTitle(e.target.value)}
                  className="px-3 py-1 text-sm font-medium border-none outline-none text-gray-800 bg-transparent min-w-0 flex-1"
                  placeholder="Nhập tiêu đề slide..."
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/60 rounded-xl p-5 border border-gray-200/50">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
                <span>Thao tác nhanh</span>
              </h3>
              <div className="space-y-2">
                <button
                  onClick={duplicateSlide}
                  className="w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-white/80 rounded-lg transition-all duration-200 font-medium hover:text-gray-900"
                >
                  📋 Sao chép slide
                </button>
                <button
                  onClick={deleteSlide}
                  className="w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-white/80 rounded-lg transition-all duration-200 font-medium hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={slides.length <= 1}
                >
                  🗑️ Xóa slide
                </button>
                <button
                  onClick={resetContent}
                  className="w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-white/80 rounded-lg transition-all duration-200 font-medium hover:text-gray-900"
                >
                  🔄 Xóa nội dung
                </button>
              </div>
            </div>

            {/* Slide Info */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200/50">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                <span>Thông tin</span>
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Slide hiện tại:</span>
                  <span className="font-semibold text-purple-700">
                    {currentSlide}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tổng số slide:</span>
                  <span className="font-semibold text-purple-700">
                    {slides.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Có nội dung:</span>
                  <span
                    className={`font-semibold ${
                      getCurrentSlideContent()
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {getCurrentSlideContent() ? "✓ Có" : "✗ Chưa"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Thumbnails:</span>
                  <span
                    className={`font-semibold ${
                      thumbnailsVisible ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {thumbnailsVisible ? "✓ Hiện" : "✗ Ẩn"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
