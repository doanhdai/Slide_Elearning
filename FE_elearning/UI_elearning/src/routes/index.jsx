import { Routes, Route } from "react-router-dom";
import React from "react";
import MainLayout from "../layouts/MainLayout";
import LectureManagement from "../pages/LectureManagement";
import SlideManage from "../pages/SlideManage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<LectureManagement />} />
      <Route path="slides/:id" element={<SlideManage />} />
    </Routes>
  );
};

export default AppRoutes;
