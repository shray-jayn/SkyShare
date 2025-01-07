import React from "react";
import MainLayout from "../layouts/main.layout";
import FileCategoryCardsList from "../components/FileCategoryCardsList.component";
import FilesTable from "../components/FilesTable.component";

const Home: React.FC = () => {
  return (
    <MainLayout>

      <FileCategoryCardsList />
      
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Files</h2>
        <FilesTable />
      </div>
    </MainLayout>
  );
};

export default Home;
