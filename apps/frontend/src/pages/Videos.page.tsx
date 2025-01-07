import React from "react";
import MainLayout from "../layouts/main.layout";
import FilesTable from "../components/FilesTable.component";

const Videos: React.FC = () => {
  return (
    <MainLayout>
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Videos</h2>
        <FilesTable category="VIDEO"/>
      </div>
    </MainLayout>
  );
};

export default Videos;
