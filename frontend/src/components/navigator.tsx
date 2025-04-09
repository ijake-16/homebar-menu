import React from 'react';

interface NavigatorProps {
  categories: string[];
  onCategorySelect: (category: string) => void;
}

const Navigator: React.FC<NavigatorProps> = ({ categories, onCategorySelect }) => {
  return (
    <div className="sticky top-0 bg-opacity-70 bg-stone-900 backdrop-blur-sm z-20 py-3 px-8 md:px-16 lg:px-32">
      <div className="flex flex-wrap gap-4 justify-center">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className="text-white hover:text-stone-300 focus:outline-none px-4 py-2 
                     bg-transparent hover:border-stone-500 rounded-xl
                     transition-all duration-300 ease-in-out transform hover:scale-105
                     font-quintessential"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigator; 