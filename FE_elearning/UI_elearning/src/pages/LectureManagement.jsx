// pages/LectureManagement.jsx
import React, { useState, useEffect } from "react";
import LectureTable from "../components/Lecture/LectureTable";
import MainLayout from "../layouts/MainLayout";
import Header from "../components/Header";
import CreateLectureModal from "../components/Lecture/CreateLectureModal";
import { addLectureRequest, getAllLectures } from "../services/lectureService";
import { useNavigate } from "react-router-dom";

const LectureManagement = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lectures, setLectures] = useState([]);

  const fetchLectures = async () => {
    try {
      const response = await getAllLectures();
      setLectures(response.data.data);
    } catch (error) {
      console.error("Error fetching lectures:", error);
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

      if (response.data) {
        await fetchLectures();
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error("Error creating lecture:", error);
      alert("Có lỗi xảy ra khi tạo bài giảng!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Header onAddClick={() => setShowCreateModal(true)} />
      <div className="p-6">
        <div className="overflow-x-auto">
          <LectureTable lectures={lectures} onRefresh={fetchLectures} />
        </div>
      </div>

      {/* Create Lecture Modal */}
      <CreateLectureModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateLecture}
        isSubmitting={isSubmitting}
      />
    </MainLayout>
  );
};

export default LectureManagement;
