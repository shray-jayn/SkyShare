import React from "react";
import MainLayout from "../layouts/main.layout";
import FilesTable from "../components/FilesTable.component";

const Pictures: React.FC = () => {
  return (
    <MainLayout>
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pictures</h2>
        <FilesTable category="IMAGE"/>
      </div>
    </MainLayout>
  );
};

export default Pictures;
