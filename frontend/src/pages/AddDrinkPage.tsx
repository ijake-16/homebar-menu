import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface DrinkFormData {
  name: string;
  abv: string;
  baseLiquor: string;
}

function AddDrinkPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DrinkFormData>({
    name: '',
    abv: '',
    baseLiquor: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add drink');
      }

      navigate('/admin');
    } catch (err) {
      setError('Failed to add drink. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-700 to-stone-900 font-mono">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link to="/admin" className="text-white hover:text-stone-300">
            &larr; Back to Admin
          </Link>
        </div>

        <div className="bg-stone-800/50 backdrop-blur-sm rounded-xl shadow-xl p-8 text-white max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Add New Drink</h1>

          {error && (
            <div className="bg-red-800/50 text-white p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Drink Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-stone-700 border border-stone-600 
                         text-white focus:outline-none focus:border-stone-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Base Liquor
              </label>
              <input
                type="text"
                name="baseLiquor"
                value={formData.baseLiquor}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-stone-700 border border-stone-600 
                         text-white focus:outline-none focus:border-stone-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                ABV
              </label>
              <input
                type="text"
                name="abv"
                value={formData.abv}
                onChange={handleChange}
                placeholder="e.g., 40%"
                className="w-full px-4 py-2 rounded-lg bg-stone-700 border border-stone-600 
                         text-white focus:outline-none focus:border-stone-500"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg
                         transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Drink'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddDrinkPage; 