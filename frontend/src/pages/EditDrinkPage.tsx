import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  BASE_LIQUORS,
  GLASS_TYPES,
  ICE_TYPES,
  MIXING_METHODS,
  COMMON_INGREDIENTS
} from '../constants/drinkConstants';

interface Ingredient {
  item: string;
  amount: string;
}

interface DrinkFormData {
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

function EditDrinkPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<DrinkFormData>({
    name: '',
    abv: 0,
    baseLiquor: BASE_LIQUORS[0],
    glass: GLASS_TYPES[0],
    description: '',
    ingredients: [{ item: '', amount: '' }],
    ice: ICE_TYPES[0],
    shakeOrStir: MIXING_METHODS[0],
    instructions: [''],
    tags: [],
    imageUrl: ''
  });

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Spirits: true,
    Liqueurs: false,
    Mixers: false,
    Garnish: false,
  });

  // Fetch existing drink data
  useEffect(() => {
    const fetchDrink = async () => {
      try {
        const response = await fetch(`http://localhost:8000/menu/${id}`);
        if (!response.ok) throw new Error('Failed to fetch drink details');
        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError('Failed to load drink details');
      } finally {
        setLoading(false);
      }
    };

    fetchDrink();
  }, [id]);

  // Reuse the same handlers from AddDrinkPage
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIngredientChange = (index: number, field: 'item' | 'amount', value: string) => {
    setFormData(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = { ...newIngredients[index], [field]: value };
      return { ...prev, ingredients: newIngredients };
    });
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { item: '', amount: '' }]
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleInstructionChange = (index: number, value: string) => {
    setFormData(prev => {
      const newInstructions = [...prev.instructions];
      newInstructions[index] = value;
      return { ...prev, instructions: newInstructions };
    });
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const handleIngredientToggle = (item: string, defaultAmount: string) => {
    setFormData(prev => {
      const existingIndex = prev.ingredients.findIndex(ing => ing.item === item);
      
      if (existingIndex >= 0) {
        return {
          ...prev,
          ingredients: prev.ingredients.filter((_, i) => i !== existingIndex)
        };
      } else {
        return {
          ...prev,
          ingredients: [...prev.ingredients, { item, amount: defaultAmount }]
        };
      }
    });
  };

  const isIngredientSelected = (item: string) => {
    return formData.ingredients.some(ing => ing.item === item);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update drink');
      navigate('/admin');
    } catch (err) {
      setError('Failed to update drink. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-stone-700 to-stone-900 font-mono">
        <div className="container mx-auto px-4 py-8">
          <div className="text-white text-center">Loading drink details...</div>
        </div>
      </div>
    );
  }

  // Use the same JSX structure as AddDrinkPage but with updated title and button text
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-700 to-stone-900 font-mono">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link to="/admin" className="text-white hover:text-stone-300">
            &larr; Back to Admin
          </Link>
        </div>

        <div className="bg-stone-800/50 backdrop-blur-sm rounded-xl shadow-xl p-8 text-white max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Edit Drink</h1>

          {error && (
            <div className="bg-red-800/50 text-white p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Reuse the same form structure as AddDrinkPage */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Section */}
            {/* ... Copy the same form sections from AddDrinkPage ... */}
            
            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg
                         transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Drink'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditDrinkPage; 