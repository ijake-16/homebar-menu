import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

interface Ingredient {
  item: string;
  amount: string;
}

interface Drink {
  id: string;
  name: string;
  abv: number;
  baseLiquor: string;
  glass: string;
  description: string;
  ingredients: Ingredient[];
  ice: string;
  shakeOrStir: string;
  instructions: string[];
  tags: string[];
  imageUrl?: string;
}

function DrinkDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drink, setDrink] = useState<Drink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    fetch(`http://localhost:8000/menu/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Drink not found');
        return res.json();
      })
      .then(data => {
        // Transform backend data to frontend format
        setDrink({
          id: data.id,
          name: data.name,
          abv: data.abv,
          description: data.description,
          baseLiquor: data.base,  // Map base → baseLiquor
          glass: data.glass,
          ingredients: data.ingredients,
          ice: data.ice,
          shakeOrStir: data.shake_or_stir,  // Map shake_or_stir → shakeOrStir
          instructions: data.instructions || [],
          tags: data.tags || [],
          imageUrl: data.image_url || ""  // Map image_url → imageUrl
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching drink:', err);
        setError('Failed to load drink details.');
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this drink?')) return;

    try {
      const response = await fetch(`http://localhost:8000/menu/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete drink');
      navigate('/admin');
    } catch (err) {
      console.error('Error deleting drink:', err);
      setError('Failed to delete drink. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-700 to-stone-900 font-sans">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link to="/" className="text-white hover:text-stone-300">
            &larr; Back to Menu
          </Link>
        </div>

        {loading ? (
          <p className="text-white text-center">Loading drink details...</p>
        ) : error ? (
          <div className="bg-red-800 text-white p-4 rounded">
            {error}
          </div>
        ) : drink ? (
          <div className="bg-stone-800/50 backdrop-blur-sm rounded-xl shadow-xl p-8 text-white max-w-3xl mx-auto">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold">{drink.name}</h1>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="space-y-2">
                <p className="text-stone-400 text-sm">Base Liquor</p>
                <p className="text-lg">{drink.baseLiquor}</p>
              </div>
              <div className="space-y-2">
                <p className="text-stone-400 text-sm">ABV</p>
                <p className="text-lg">{drink.abv}%</p>
              </div>
              <div className="space-y-2">
                <p className="text-stone-400 text-sm">Glass</p>
                <p className="text-lg">{drink.glass}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3 border-b border-stone-600 pb-2">Description</h2>
              <p className="text-stone-300 font-serif">{drink.description}</p>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full py-3 px-4 bg-stone-700/50 hover:bg-stone-700/70 
                       rounded-lg transition-colors duration-150 mb-8 flex items-center justify-between"
            >
              <span className="text-stone-300 font-medium">
                {showDetails ? 'Hide Details' : 'Show Details'}
              </span>
              <span 
                className="transform transition-transform duration-200"
                style={{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                ▼
              </span>
            </button>

            {/* Detailed Information */}
            {showDetails && (
              <div className="space-y-8 animate-fade-in">
                {/* Ingredients */}
                <div>
                  <h2 className="text-xl font-semibold mb-3 border-b border-stone-600 pb-2">Ingredients</h2>
                  <ul className="space-y-2">
                    {drink.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex justify-between items-center py-1">
                        <span className="text-stone-300">{ingredient.item}</span>
                        <span className="text-stone-400">{ingredient.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preparation */}
                <div>
                  <h2 className="text-xl font-semibold mb-3 border-b border-stone-600 pb-2">Preparation</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-stone-400 text-sm">Ice</p>
                      <p className="text-lg">{drink.ice}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-stone-400 text-sm">Method</p>
                      <p className="text-lg">{drink.shakeOrStir}</p>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h2 className="text-xl font-semibold mb-3 border-b border-stone-600 pb-2">Instructions</h2>
                  <ol className="list-decimal list-inside space-y-2">
                    {drink.instructions.map((instruction, index) => (
                      <li key={index} className="text-stone-300 pl-2">{instruction}</li>
                    ))}
                  </ol>
                </div>

                {/* Tags */}
                {drink.tags && drink.tags.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3 border-b border-stone-600 pb-2">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {drink.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-stone-700 px-3 py-1 rounded-full text-sm text-stone-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image */}
                {drink.imageUrl && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3 border-b border-stone-600 pb-2">Image</h2>
                    <img
                      src={drink.imageUrl}
                      alt={drink.name}
                      className="rounded-lg w-full max-w-md mx-auto"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-white text-center">Drink not found</p>
        )}
      </div>
    </div>
  );
}

// Add this to your CSS or tailwind config
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.2s ease-out forwards;
  }
`;

export default DrinkDetailsPage; 