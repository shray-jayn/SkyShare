import React from "react";
import Sidebar from "../components/Sidebar.component";
import TopNavBar from "../components/TopNavBar.component";
import FileCategoryCardsList from "../components/FileCategoryCardsList.component";
import RecentFilesTable from "../components/FilesTable.component";

const Home: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 bg-gray-50">
        {/* Top Navigation Bar */}
        <TopNavBar />

        {/* File Category Cards */}
        <FileCategoryCardsList />

        {/* Recent Files Table */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Files
          </h2>
          <RecentFilesTable />
        </div>
      </div>
    </div>
  );
};

export default Home;
