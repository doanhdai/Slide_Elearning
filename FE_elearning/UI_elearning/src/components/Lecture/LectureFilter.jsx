import React, { memo } from "react";

const LectureFilter = memo(
  ({
    search,
    setSearch,
    subject,
    setSubject,
    status,
    setStatus,
    chapter,
    setChapter,
    studyClass,
    setStudyClass,
  }) => {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              id="searchInput"
              placeholder="Tìm kiếm theo tên bài giảng..."
              className="w-full p-3 border bg-white border-gray-300 text-sm rounded-none focus:ring-1  focus:ring-indigo-500 focus:border-indigo-500 "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div>
            <select
              id="subjectFilter"
              className="w-full p-3 border bg-white border-gray-300 text-sm rounded-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">Tất Cả Môn Học</option>
              <option value="Math">Toán</option>
              <option value="Science">Khoa Học</option>
              <option value="English">Tiếng Anh</option>
              <option value="History">Lịch Sử</option>
            </select>
          </div>
          <div>
            <select
              id="statusFilter"
              className="w-full p-3 border bg-white border-gray-300 text-sm rounded-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Tất Cả Trạng Thái</option>
              <option value="New">Mới</option>
              <option value="Creating">Đang Tạo</option>
              <option value="Created">Đã Tạo</option>
            </select>
          </div>
          <div>
            <select
              id="chapterFilter"
              className="w-full p-3 border bg-white border-gray-300 text-sm rounded-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
            >
              <option value="">Tất Cả Chương</option>
              <option value="Chapter 1">Chương 1</option>
              <option value="Chapter 2">Chương 2</option>
              <option value="Chapter 3">Chương 3</option>
            </select>
          </div>
          <div>
            <select
              id="classFilter"
              className="w-full p-3 border bg-white border-gray-300 text-sm rounded-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              value={studyClass}
              onChange={(e) => setStudyClass(e.target.value)}
            >
              <option value="">Tất Cả Lớp</option>
              <option value="1">Lớp 1</option>
              <option value="2">Lớp 2</option>
              <option value="3">Lớp 3</option>
              <option value="4">Lớp 4</option>
              <option value="5">Lớp 5</option>
              <option value="6">Lớp 6</option>
              <option value="7">Lớp 7</option>
              <option value="8">Lớp 8</option>
              <option value="9">Lớp 9</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
);

export default LectureFilter;
