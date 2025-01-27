import React from "react";
import MainLayout from "../layouts/main.layout";
import FavouriteFilesTable from "../components/FavouriteFileTable.component";

const Favorites: React.FC = () => {
  return (
    <MainLayout>
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Favourites</h2>
        <FavouriteFilesTable />
      </div>
    </MainLayout>
  );
};

export default Favorites;
