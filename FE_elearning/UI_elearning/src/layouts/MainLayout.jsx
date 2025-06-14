import {Sidebar} from "../components/Sidebar";
import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default MainLayout;
