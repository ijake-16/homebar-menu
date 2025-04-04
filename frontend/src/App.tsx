import { useEffect, useState, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Frame from './components/frame';
import Navigator from './components/navigator';
import AdminPage from './pages/AdminPage';
import DrinkDetailsPage from './pages/DrinkDetailsPage';
import AddDrinkPage from './pages/AddDrinkPage';
import EditDrinkPage from './pages/EditDrinkPage';
import backgroundImage from './assets/background_main.png';

interface Drink {
  id: string;
  name: string;
  abv: string;
  baseLiquor: string;
}

function HomePage() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const sectionRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const updateMaxScroll = () => {
      if (contentRef.current) {
        // Calculate the total scrollable height
        const scrollHeight = contentRef.current.scrollHeight - window.innerHeight;
        setMaxScroll(scrollHeight);
      }
    };

    // Initial calculation
    updateMaxScroll();

    // Update on scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Update on resize
    window.addEventListener('resize', updateMaxScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateMaxScroll);
    };
  }, []);

  useEffect(() => {
    // This would call your FastAPI backend
    fetch('http://localhost:8000/menu')
      .then(res => res.json())
      .then(data => {
        // Transform the data
        const transformedData = data.map(drink => ({
          id: drink.id,
          name: drink.name,
          abv: drink.abv,
          baseLiquor: drink.base // Map base to baseLiquor
        }));
        setDrinks(transformedData);
      })
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
          // Additional drinks
          { id: '9', name: 'Paloma', abv: '12%', baseLiquor: 'Tequila' },
          { id: '10', name: 'Ranch Water', abv: '10%', baseLiquor: 'Tequila' },
          { id: '11', name: 'Tequila Sunrise', abv: '11%', baseLiquor: 'Tequila' },
          { id: '12', name: 'Tommys Margarita', abv: '13%', baseLiquor: 'Tequila' },
          { id: '13', name: 'El Diablo', abv: '12%', baseLiquor: 'Tequila' },
          
          { id: '14', name: 'Martini', abv: '28%', baseLiquor: 'Gin' },
          { id: '15', name: 'Aviation', abv: '21%', baseLiquor: 'Gin' },
          { id: '16', name: 'Last Word', abv: '23%', baseLiquor: 'Gin' },
          { id: '17', name: 'Gimlet', abv: '20%', baseLiquor: 'Gin' },
          { id: '18', name: 'Corpse Reviver #2', abv: '22%', baseLiquor: 'Gin' },
          
          { id: '19', name: 'Dark & Stormy', abv: '11%', baseLiquor: 'Rum' },
          { id: '20', name: 'Piña Colada', abv: '13%', baseLiquor: 'Rum' },
          { id: '21', name: 'Mai Tai', abv: '14%', baseLiquor: 'Rum' },
          { id: '22', name: 'Hurricane', abv: '15%', baseLiquor: 'Rum' },
          { id: '23', name: 'Jungle Bird', abv: '13%', baseLiquor: 'Rum' },
          
          { id: '24', name: 'Manhattan', abv: '30%', baseLiquor: 'Whiskey' },
          { id: '25', name: 'Boulevardier', abv: '28%', baseLiquor: 'Whiskey' },
          { id: '26', name: 'Paper Plane', abv: '25%', baseLiquor: 'Whiskey' },
          { id: '27', name: 'Penicillin', abv: '23%', baseLiquor: 'Whiskey' },
          { id: '28', name: 'Gold Rush', abv: '25%', baseLiquor: 'Whiskey' },
          
          { id: '29', name: 'Espresso Martini', abv: '18%', baseLiquor: 'Vodka' },
          { id: '30', name: 'Cosmopolitan', abv: '20%', baseLiquor: 'Vodka' },
          { id: '31', name: 'Black Russian', abv: '25%', baseLiquor: 'Vodka' },
          { id: '32', name: 'White Russian', abv: '20%', baseLiquor: 'Vodka' },
          { id: '33', name: 'Vodka Gimlet', abv: '16%', baseLiquor: 'Vodka' },
          
          // Adding some drinks with other base spirits for variety
          { id: '34', name: 'Sidecar', abv: '25%', baseLiquor: 'Cognac' },
          { id: '35', name: 'Vieux Carré', abv: '29%', baseLiquor: 'Cognac' },
          { id: '36', name: 'French 75', abv: '15%', baseLiquor: 'Cognac' },
          
          { id: '37', name: 'Aperol Spritz', abv: '11%', baseLiquor: 'Aperitif' },
          { id: '38', name: 'Campari Spritz', abv: '11%', baseLiquor: 'Aperitif' },
          
          // Adding some Mezcal cocktails
          { id: '39', name: 'Mezcal Negroni', abv: '24%', baseLiquor: 'Mezcal' },
          { id: '40', name: 'Mezcal Mule', abv: '12%', baseLiquor: 'Mezcal' },
          { id: '41', name: 'Naked & Famous', abv: '22%', baseLiquor: 'Mezcal' }
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

  const smoothScrollTo = (targetPosition: number, duration: number = 1000) => {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    function animation(currentTime: number) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Easing function for smooth acceleration and deceleration
      const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      
      window.scrollTo(0, startPosition + distance * ease(progress));

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  };

  const scrollToCategory = (category: string) => {
    const element = sectionRefs.current[category];
    if (!element) return;

    // Get the element's position relative to the top of the page
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const headerOffset = 100;
    const offsetPosition = elementPosition - headerOffset;

    // Use our custom smooth scroll instead of window.scrollTo
    smoothScrollTo(Math.max(0, offsetPosition), 1500); // Increased duration to 1500ms

    // Add a class to the element for a subtle fade-in effect
    element.classList.add('scroll-highlight');
    setTimeout(() => {
      element.classList.remove('scroll-highlight');
    }, 1000);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Background container */}
        <div className="absolute inset-0">
          <div 
            className="absolute w-full bg-no-repeat"
            style={{ 
              backgroundImage: `url(${backgroundImage})`,
              height: maxScroll ? `${Math.max(window.innerHeight * 6, window.innerHeight + maxScroll * 6)}px` : '600vh',
              transform: `translateY(${maxScroll ? -(scrollY * 0.3) : 0}px)`,
              backgroundSize: '100% auto', // Full width, auto height to maintain aspect ratio
              backgroundPosition: 'center top',
              left: '0',
              width: '100%',
              top: '0',
              backgroundRepeat: 'no-repeat', // Show image only once
            }}
          />
          <div 
            className="absolute w-full backdrop-blur-sm bg-black/40"
            style={{ 
              height: maxScroll ? `${Math.max(window.innerHeight * 6, window.innerHeight + maxScroll * 6)}px` : '600vh',
              transform: `translateY(${maxScroll ? -(scrollY * 0.3) : 0}px)`,
              left: '0',
              width: '100%',
              top: '0',
            }}
          />
        </div>

        {/* Content */}
        <div ref={contentRef} className="relative z-10">
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

          <div className="text-center pb-6 pt-8">
            <div className="text-white/60 text-sm">• • •</div>
            <div className="text-white/40 mt-2 font-quintessential">End of Menu</div>
          </div>
        </div>
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
        <Route path="/admin/edit/:id" element={<EditDrinkPage />} />
        <Route path="/drinks/:id" element={<DrinkDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

