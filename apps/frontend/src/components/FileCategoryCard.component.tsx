import React from "react";

interface FileCategoryCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  color: string;
}

const FileCategoryCard: React.FC<FileCategoryCardProps> = ({
  icon,
  title,
  count,
  color,
}) => {
  return (
    <div
      className="flex items-center p-4 rounded-lg shadow-sm"
      style={{ backgroundColor: color }}
    >
    
      <div className="text-white text-2xl mr-4">{icon}</div>

      
      <div>
        <h3 className="text-white text-lg font-semibold">{title}</h3>
        <p className="text-white text-sm">{count} Files</p>
      </div>
    </div>
  );
};

export default FileCategoryCard;
