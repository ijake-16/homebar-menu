import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

interface Drink {
  id: string;
  name: string;
  abv: string;
  baseLiquor: string;
  koreanName: string;
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
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                {drink.name ? (
                  <>
                    <Link 
                      to={`/drinks/${drink.id}`} 
                      className="text-white hover:text-stone-300 transition-colors"
                    >
                      <div className="text-xl">{drink.name}</div>
                    </Link>
                    <div className="text-sm text-stone-400 font-korean ml-4">
                      {drink.koreanName}
                    </div>
                  </>
                ) : (
                  <Link 
                    to={`/drinks/${drink.id}`} 
                    className="text-white hover:text-stone-300 transition-colors"
                  >
                    <div className="text-base font-korean">{drink.koreanName}</div>
                  </Link>
                )}
              </div>
              <span className="text-2xl text-gray-300 ml-12 font-normal mt-1">ABV: {drink.abv + "%"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Frame; 