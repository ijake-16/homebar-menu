import { useEffect, useState, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Frame from './components/frame';
import Navigator from './components/navigator';
import AdminPage from './pages/AdminPage';
import DrinkDetailsPage from './pages/DrinkDetailsPage';
import AddDrinkPage from './pages/AddDrinkPage';

interface Drink {
  id: string;
  name: string;
  abv: string;
  baseLiquor: string;
}

function HomePage() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const sectionRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  useEffect(() => {
    // This would call your FastAPI backend
    fetch('http://localhost:8000/menu')
      .then(res => res.json())
      .then(data => setDrinks(data))
      .catch(() => {
        // fallback for now
        setDrinks([
          { id: '1', name: 'Margarita', abv: '13%', baseLiquor: 'Tequila' },
          { id: '2', name: 'Negroni', abv: '24%', baseLiquor: 'Gin' },
          { id: '3', name: 'Mojito', abv: '12%', baseLiquor: 'Rum' },
          { id: '4', name: 'Old Fashioned', abv: '32%', baseLiquor: 'Whiskey' },
          { id: '5', name: 'Moscow Mule', abv: '10%', baseLiquor: 'Vodka' },
          { id: '6', name: 'Whiskey Sour', abv: '20%', baseLiquor: 'Whiskey' },
          { id: '7', name: 'Daiquiri', abv: '15%', baseLiquor: 'Rum' },
          { id: '8', name: 'Gin & Tonic', abv: '12%', baseLiquor: 'Gin' },
        ]);
      });
  }, []);

  useEffect(() => {
    // Extract unique categories and create refs for each
    const uniqueCategories = Array.from(new Set(drinks.map(drink => drink.baseLiquor))).sort();
    setCategories(uniqueCategories);
  }, [drinks]);

  const setRef = useCallback((element: HTMLDivElement | null, category: string) => {
    if (element) {
      sectionRefs.current[category] = element;
    }
  }, []);

  const scrollToCategory = (category: string) => {
    sectionRefs.current[category]?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-700 to-stone-900">
      <h1 className="text-3xl font-bold py-6 text-center text-white">
        <span className="mr-2">🍸</span> Home Bar Menu
      </h1>
      
      <Navigator categories={categories} onCategorySelect={scrollToCategory} />
      
      <div className="mt-8">
        {categories.map(category => (
          <div 
            key={category} 
            ref={(el) => setRef(el, category)} 
            className="mb-12"
          >
            <h3 className="text-2xl font-quintessential text-white px-8 md:px-16 lg:px-32 mb-4">
              {category}
            </h3>
            <Frame drinks={drinks.filter(drink => drink.baseLiquor === category)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/add" element={<AddDrinkPage />} />
        <Route path="/drinks/:id" element={<DrinkDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
