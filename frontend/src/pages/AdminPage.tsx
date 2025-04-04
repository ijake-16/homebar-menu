import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Drink {
  id: string;
  name?: string;
  koreanName: string;
  abv: string;
  baseLiquor: string;
}

function AdminPage() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch drinks from the backend
    setLoading(true);
    fetch('http://localhost:8000/menu')
      .then(res => res.json())
      .then(data => {
        // Transform the data
        const transformedData = data.map(drink => ({
          id: drink.id,
          name: drink.name,
          koreanName: drink.korean_name,
          abv: drink.abv,
          baseLiquor: drink.base
        }));
        setDrinks(transformedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching drinks:', err);
        setError('Failed to load drinks. Using fallback data.');
        // Fallback data
        setDrinks([
          { id: '1', name: 'Margarita', koreanName: '마가리타', abv: '13%', baseLiquor: 'Tequila' },
          { id: '2', name: 'Negroni', koreanName: '네그로니', abv: '24%', baseLiquor: 'Gin' },
          { id: '3', name: 'Mojito', koreanName: '모히토', abv: '12%', baseLiquor: 'Rum' },
          { id: '4', name: 'Old Fashioned', koreanName: '올드 포셔드', abv: '32%', baseLiquor: 'Whiskey' },
          { id: '5', name: 'Moscow Mule', koreanName: '모스코 뮬', abv: '10%', baseLiquor: 'Vodka' },
          { id: '6', name: 'Whiskey Sour', koreanName: '위스키 소어', abv: '20%', baseLiquor: 'Whiskey' },
          { id: '7', name: 'Daiquiri', koreanName: '대이키리', abv: '15%', baseLiquor: 'Rum' },
          { id: '8', name: 'Gin & Tonic', koreanName: '진 앤 토닉', abv: '12%', baseLiquor: 'Gin' },
        ]);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (drinkId: string) => {
    if (!window.confirm('Are you sure you want to delete this drink?')) return;

    try {
      const response = await fetch(`http://localhost:8000/menu/${drinkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete drink');
      
      // Remove the deleted drink from the state
      setDrinks(drinks.filter(drink => drink.id !== drinkId));
    } catch (err) {
      console.error('Error deleting drink:', err);
      setError('Failed to delete drink. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-700 to-stone-900 font-mono">
      <h1 className="text-3xl font-bold py-6 text-center text-white font-mono">
        <span className="mr-2">🍸</span> Drink Management
      </h1>
      
      <div className="container mx-auto px-4 pb-8">
        {/* Navigation back to home */}
        <div className="mb-6">
          <Link to="/" className="text-white hover:text-stone-300 font-sans">
            &larr; Back to Home
          </Link>
        </div>

        {/* Error message if fetch failed */}
        {error && (
          <div className="bg-red-800 text-white p-4 rounded mb-6 font-mono">
            {error}
          </div>
        )}

        {/* Updated Drink Table */}
        <div className="bg-stone-800/50 backdrop-blur-sm rounded-xl shadow-xl p-8 text-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-mono tracking-tight">
              Current Drinks
            </h2>
            <button 
              onClick={() => navigate('/admin/add')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg 
                         transition-colors duration-150 text-sm font-medium flex items-center"
            >
              <span className="mr-2">+</span> Add New Drink
            </button>
          </div>
          
          {loading ? (
            <p className="text-center py-4 font-sans">Loading drinks...</p>
          ) : (
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full divide-y divide-stone-600/30">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-stone-300 uppercase tracking-wider w-24">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-stone-300 uppercase tracking-wider w-72">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-stone-300 uppercase tracking-wider w-48">
                      Base Liquor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-stone-300 uppercase tracking-wider w-32">
                      ABV
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-stone-300 uppercase tracking-wider w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-600/30 bg-stone-800/30">
                  {drinks.map((drink, index) => (
                    <tr 
                      key={drink.id} 
                      className={`
                        transition-colors duration-150 ease-in-out
                        hover:bg-stone-700/50
                        ${index % 2 === 0 ? 'bg-stone-800/20' : 'bg-stone-800/40'}
                      `}
                    >
                      <td className="px-4 py-2.5 text-sm font-mono text-stone-300 w-24">
                        {drink.id}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap font-medium w-72">
                        <div>
                          <div>{drink.koreanName}</div>
                          {drink.name && <div className="text-sm text-stone-400">{drink.name}</div>}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-stone-300 w-48">
                        {drink.baseLiquor}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-stone-300 w-32">
                        {drink.abv}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-xs w-32">
                        <Link 
                          to={`/admin/edit/${drink.id}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-150 mr-3 px-2 py-1 rounded-md bg-blue-400/10 hover:bg-blue-400/20"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(drink.id)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-150 px-2 py-1 rounded-md bg-red-400/10 hover:bg-red-400/20"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {!loading && drinks.length === 0 && (
            <p className="text-center py-4 text-stone-300">
              No drinks found. Add your first drink!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage; 