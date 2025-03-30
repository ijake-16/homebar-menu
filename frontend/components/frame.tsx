import React, { FunctionComponent } from 'react';

interface Drink {
  id: string;
  name: string;
  abv: string;
}

interface FrameProps {
  drinks: Drink[];
}

const Frame: FunctionComponent<FrameProps> = ({ drinks }) => {
  // Split drinks into two columns
  const column1 = drinks.filter((_, index) => index % 2 === 0);
  const column2 = drinks.filter((_, index) => index % 2 === 1);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1 */}
        <div className="space-y-3">
          {column1.map(drink => (
            <div key={drink.id} className="bg-white rounded-md shadow-sm p-3 w-full">
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium text-gray-800">{drink.name}</div>
                <div className="text-sm text-gray-500">ABV: {drink.abv}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Column 2 */}
        <div className="space-y-3">
          {column2.map(drink => (
            <div key={drink.id} className="bg-white rounded-md shadow-sm p-3 w-full">
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium text-gray-800">{drink.name}</div>
                <div className="text-sm text-gray-500">ABV: {drink.abv}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Frame; 