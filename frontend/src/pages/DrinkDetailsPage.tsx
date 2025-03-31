import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

interface Drink {
  id: string;
  name: string;
  abv: string;
  baseLiquor: string;
}

function DrinkDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drink, setDrink] = useState<Drink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/menu/${id}`)
      .then(res => res.json())
      .then(data => {
        setDrink(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching drink:', err);
        setError('Failed to load drink details');
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-700 to-stone-900 font-mono">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link to="/admin" className="text-white hover:text-stone-300">
            &larr; Back to Admin
          </Link>
        </div>

        {loading ? (
          <p className="text-white text-center">Loading drink details...</p>
        ) : error ? (
          <div className="bg-red-800 text-white p-4 rounded">
            {error}
          </div>
        ) : drink ? (
          <div className="bg-stone-800/50 backdrop-blur-sm rounded-xl shadow-xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-6">{drink.name}</h1>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-stone-400">Base Liquor</p>
                  <p className="text-xl">{drink.baseLiquor}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-stone-400">ABV</p>
                  <p className="text-xl">{drink.abv}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-white text-center">Drink not found</p>
        )}
      </div>
    </div>
  );
}

export default DrinkDetailsPage; 