import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  koreanName: string;
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

function AddDrinkPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DrinkFormData>({
    name: '',
    koreanName: '',
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Spirits: true,
    Liqueurs: false,
    Mixers: false,
    Garnish: false,
  });

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
      // Check if ingredient already exists
      const existingIndex = prev.ingredients.findIndex(ing => ing.item === item);
      
      if (existingIndex >= 0) {
        // Remove if exists
        return {
          ...prev,
          ingredients: prev.ingredients.filter((_, i) => i !== existingIndex)
        };
      } else {
        // Add if doesn't exist
        return {
          ...prev,
          ingredients: [...prev.ingredients, { item, amount: defaultAmount }]
        };
      }
    });
  };

  // Helper function to check if an ingredient is selected
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
      // Transform the data to match the backend model
      const backendData = {
        name: formData.name || null,
        korean_name: formData.koreanName,
        abv: formData.abv,
        description: formData.description,
        base: formData.baseLiquor,
        glass: formData.glass,
        ingredients: formData.ingredients,
        ice: formData.ice,
        shake_or_stir: formData.shakeOrStir,
        instructions: formData.instructions,
        tags: formData.tags,
        image_url: formData.imageUrl || "",
        available: true
      };

      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/menu`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(backendData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.detail || 'Failed to add drink');
      }
      
      navigate('/admin');
    } catch (err) {
      console.error('Error adding drink:', err);
      setError('Failed to add drink. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-700 to-stone-900 font-mono">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link to="/admin" className="text-white hover:text-stone-300">
            &larr; Back to Admin
          </Link>
        </div>

        <div className="bg-stone-800/50 backdrop-blur-sm rounded-xl shadow-xl p-8 text-white max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Add New Drink</h1>

          {error && (
            <div className="bg-red-800/50 text-white p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-stone-600 pb-2">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
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
                <label className="block text-sm font-medium mb-2">Korean Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="koreanName"
                  value={formData.koreanName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-stone-700 border border-stone-600 
                           text-white focus:outline-none focus:border-stone-500 font-korean"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">ABV (%)</label>
                <input
                  type="number"
                  name="abv"
                  value={formData.abv}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-32 px-4 py-2 rounded-lg bg-stone-700 border border-stone-600 
                           text-white focus:outline-none focus:border-stone-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Base Spirit</label>
                  <select
                    name="baseLiquor"
                    value={formData.baseLiquor}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-stone-700 border border-stone-600 
                             text-white focus:outline-none focus:border-stone-500"
                  >
                    {BASE_LIQUORS.map(liquor => (
                      <option key={liquor} value={liquor}>{liquor}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Glass Type</label>
                  <select
                    name="glass"
                    value={formData.glass}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-stone-700 border border-stone-600 
                             text-white focus:outline-none focus:border-stone-500"
                  >
                    {GLASS_TYPES.map(glass => (
                      <option key={glass} value={glass}>{glass}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-stone-600 pb-2">Description</h2>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-stone-700 border border-stone-600 
                         text-white focus:outline-none focus:border-stone-500"
                required
              />
            </div>

            {/* Updated Ingredients Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-stone-600 pb-2">
                <h2 className="text-xl font-semibold">Ingredients</h2>
              </div>

              {/* Common Ingredients Toggles with Collapsible Categories */}
              <div className="space-y-4">
                {Object.entries(COMMON_INGREDIENTS).map(([category, items]) => (
                  <div key={category} className="border border-stone-600 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className="w-full px-4 py-3 flex justify-between items-center bg-stone-700/50 hover:bg-stone-700/70 transition-colors duration-150"
                    >
                      <h3 className="text-lg font-medium text-stone-300">{category}</h3>
                      <span className="text-stone-400 transition-transform duration-200" 
                            style={{ transform: expandedCategories[category] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        ▼
                      </span>
                    </button>
                    
                    {expandedCategories[category] && (
                      <div className="p-4 bg-stone-800/30">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {items.map(({ item, defaultAmount }) => (
                            <div
                              key={item}
                              className={`px-3 py-2 rounded-lg text-sm transition-colors duration-150 flex items-center justify-between
                                ${isIngredientSelected(item)
                                  ? 'bg-emerald-600/50 hover:bg-emerald-600/40 border-emerald-500'
                                  : 'bg-stone-700/50 hover:bg-stone-700/70 border-stone-600'
                                } border`}
                            >
                              <button
                                type="button"
                                onClick={() => handleIngredientToggle(item, defaultAmount)}
                                className="flex-1 text-left"
                              >
                                {item}
                              </button>
                              {isIngredientSelected(item) && (
                                <span className="text-emerald-400 ml-2">✓</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Custom Ingredients List */}
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-stone-300">Current Ingredients</h3>
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="text-emerald-400 hover:text-emerald-300 text-sm"
                  >
                    + Add Custom
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-4 items-center bg-stone-700/30 p-3 rounded-lg">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={ingredient.item}
                          onChange={(e) => handleIngredientChange(index, 'item', e.target.value)}
                          placeholder="Ingredient"
                          className="w-full px-3 py-1.5 rounded-md bg-stone-700 border border-stone-600 
                                   text-white focus:outline-none focus:border-stone-500"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={ingredient.amount}
                          onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                          placeholder="Amount"
                          className="w-full px-3 py-1.5 rounded-md bg-stone-700 border border-stone-600 
                                   text-white focus:outline-none focus:border-stone-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Preparation Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-stone-600 pb-2">Preparation</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ice</label>
                  <select
                    name="ice"
                    value={formData.ice}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-stone-700 border border-stone-600 
                             text-white focus:outline-none focus:border-stone-500"
                  >
                    {ICE_TYPES.map(ice => (
                      <option key={ice} value={ice}>{ice}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Method</label>
                  <select
                    name="shakeOrStir"
                    value={formData.shakeOrStir}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-stone-700 border border-stone-600 
                             text-white focus:outline-none focus:border-stone-500"
                  >
                    {MIXING_METHODS.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-stone-600 pb-2">
                <h2 className="text-xl font-semibold">Instructions</h2>
                <button
                  type="button"
                  onClick={addInstruction}
                  className="text-emerald-400 hover:text-emerald-300 text-sm"
                >
                  + Add Step
                </button>
              </div>
              
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <span className="text-stone-400 pt-2">{index + 1}.</span>
                  <input
                    type="text"
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    placeholder="Instruction step"
                    className="flex-1 px-4 py-2 rounded-lg bg-stone-700 border border-stone-600 
                             text-white focus:outline-none focus:border-stone-500"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="text-red-400 hover:text-red-300 px-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Optional Image URL */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-stone-600 pb-2">Additional Details</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Image URL (optional)</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-lg bg-stone-700 border border-stone-600 
                           text-white focus:outline-none focus:border-stone-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
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