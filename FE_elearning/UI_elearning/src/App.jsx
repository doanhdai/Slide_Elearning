import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Courses } from "./pages/Courses";
// import { Lessons } from "./pages/Lessons";
import LectureManagement from "./pages/LectureManagement";
import SlideManage from "./pages/SlideManage";
import AppRoutes from "./routes";

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
