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
              <div className="flex flex-col max-w-[70%]">
                {drink.name ? (
                  <>
                    <Link 
                      to={`/drinks/${drink.id}`} 
                      className="text-white hover:text-stone-300 transition-colors block w-full"
                    >
                      <div className="text-xl truncate">{drink.name}</div>
                    </Link>
                    <div className="text-sm text-stone-400 font-korean ml-12 truncate">
                      {drink.koreanName}
                    </div>
                  </>
                ) : (
                  <Link 
                    to={`/drinks/${drink.id}`} 
                    className="text-white hover:text-stone-300 transition-colors block w-full"
                  >
                    <div className="text-base font-korean truncate">{drink.koreanName}</div>
                  </Link>
                )}
              </div>
              <div className="flex-shrink-0 text-right">
                <span className="text-2xl text-gray-300 font-normal whitespace-nowrap">ABV: {drink.abv}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Frame; 