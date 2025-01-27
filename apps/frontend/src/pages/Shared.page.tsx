import React from "react";
import MainLayout from "../layouts/main.layout";
import SharedFilesTable from "../components/SharedFileTable.component";

const Shared: React.FC = () => {
  return (
    <MainLayout>
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Shared</h2>
        <SharedFilesTable />
      </div>
    </MainLayout>
  );
};

export default Shared;
