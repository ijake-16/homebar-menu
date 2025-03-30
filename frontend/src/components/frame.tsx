import React, { FunctionComponent } from 'react';

interface Drink {
  id: string;
  name: string;
  abv: string;
  baseLiquor: string;
}

interface FrameProps {
  drinks: Drink[];
}

const Frame: FunctionComponent<FrameProps> = ({ drinks }) => {
  return (
    <div className="w-full px-8 md:px-16 lg:px-32">
      <div className="grid grid-cols-2 gap-x-36 gap-y-2">
        {drinks.map(drink => (
          <div key={drink.id} className="text-white p-2">
            <div className="flex justify-between items-center">
              <span className="text-base md:text-lg font-bold">{drink.name}</span>
              <span className="text-sm text-gray-300 ml-12 font-normal">ABV: {drink.abv}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Frame; 