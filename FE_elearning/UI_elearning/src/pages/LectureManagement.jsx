// pages/LectureManagement.jsx
import React, { useState, useEffect, useMemo } from "react";
import LectureTable from "../components/Lecture/LectureTable";
import MainLayout from "../layouts/MainLayout";
import Header from "../components/Header";
import CreateLectureModal from "../components/Lecture/CreateLectureModal";
import { addLectureRequest, getAllLectures } from "../services/lectureService";
import { useNavigate } from "react-router-dom";
import Notification from "../components/Notification/Notification";
import LectureFilter from "../components/Lecture/LectureFilter";

const filterLecture = (
  lecture,
  { search, subject, status, chapter, studyClass }
) => {
  if (
    search &&
    (!lecture.lectureName ||
      !lecture.lectureName.toLowerCase().includes(search.toLowerCase()))
  )
    return false;
  if (subject && lecture.subject !== subject) return false;
  if (status && lecture.status !== status) return false;
  if (chapter && lecture.chapter !== chapter) return false;
  if (studyClass && lecture.studyClass !== studyClass) return false;
  return true;
};

const LectureManagement = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lectures, setLectures] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Search & filter states
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState("");
  const [chapter, setChapter] = useState("");
  const [studyClass, setStudyClass] = useState("");

  const fetchLectures = async () => {
    try {
      const response = await getAllLectures();
      if (response.status === 200) {
        setLectures(response.data.data);
      } else {
        setNotification({
          show: true,
          message: "Có lỗi xảy ra khi tải danh sách bài giảng!",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching lectures:", error);
      setNotification({
        show: true,
        message: "Có lỗi xảy ra khi tải danh sách bài giảng!",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  const handleCreateLecture = async (formData) => {
    try {
      setIsSubmitting(true);

      const response = await addLectureRequest({
        userId: "1",
        subject: formData.subject,
        chapter: formData.chapter,
        lectureName: formData.lectureName,
        linkGenspack: formData.linkGenspack,
        description: formData.description,
        studyClass: formData.studyClass,
      });

      if (response.status === 201) {
        setNotification({
          show: true,
          message: "Tạo bài giảng thành công!",
          type: "success",
        });
        await fetchLectures();
        setShowCreateModal(false);
      } else {
        setNotification({
          show: true,
          message: "Có lỗi xảy ra khi tạo bài giảng!",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error creating lecture:", error);
      setNotification({
        show: true,
        message: "Có lỗi xảy ra khi tạo bài giảng!",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filterParams = { search, subject, status, chapter, studyClass };
  const filteredLectures = useMemo(() => {
    // Only recalculate if lectures or filterParams change
    return lectures.filter((lecture) => filterLecture(lecture, filterParams));
  }, [lectures, search, subject, status, chapter, studyClass]);

  return (
    <MainLayout>
      <Header onAddClick={() => setShowCreateModal(true)} />
      <LectureFilter
        search={search}
        setSearch={setSearch}
        subject={subject}
        setSubject={setSubject}
        status={status}
        setStatus={setStatus}
        chapter={chapter}
        setChapter={setChapter}
        studyClass={studyClass}
        setStudyClass={setStudyClass}
      />
      <div className="px-6">
        <div className="overflow-x-auto">
          <LectureTable lectures={filteredLectures} onRefresh={fetchLectures} />
        </div>
      </div>

      {/* Create Lecture Modal */}
      <CreateLectureModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateLecture}
        isSubmitting={isSubmitting}
      />

      {/* Notification */}
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
    </MainLayout>
  );
};

export default LectureManagement;
