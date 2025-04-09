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
  koreanName: string;
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
        const transformedData = data.map((drink: any) => ({
          id: drink.id,
          name: drink.name,
          koreanName: drink.korean_name,
          abv: drink.abv,
          baseLiquor: drink.base // Map base to baseLiquor
        }));
        setDrinks(transformedData);
      })
      .catch(() => {
        // fallback for now
        setDrinks([
          { id: '1', name: 'Margarita', koreanName: '마가리타', abv: '13%', baseLiquor: 'Tequila' },
          { id: '2', name: 'Negroni', koreanName: '네그로니', abv: '24%', baseLiquor: 'Gin' },
          { id: '3', name: 'Mojito', koreanName: '모히토', abv: '12%', baseLiquor: 'Rum' },
          { id: '4', name: 'Old Fashioned', koreanName: '올드 포데드', abv: '32%', baseLiquor: 'Whiskey' },
          { id: '5', name: 'Moscow Mule', koreanName: '모스코 물', abv: '10%', baseLiquor: 'Vodka' },
          { id: '6', name: 'Whiskey Sour', koreanName: '위스키 소어', abv: '20%', baseLiquor: 'Whiskey' },
          { id: '7', name: 'Daiquiri', koreanName: '대이키리', abv: '15%', baseLiquor: 'Rum' },
          { id: '8', name: 'Gin & Tonic', koreanName: '진 앤 토닉', abv: '12%', baseLiquor: 'Gin' },
          // Additional drinks
          { id: '9', name: 'Paloma', koreanName: '팔로마', abv: '12%', baseLiquor: 'Tequila' },
          { id: '10', name: 'Ranch Water', koreanName: '랜지 워터', abv: '10%', baseLiquor: 'Tequila' },
          { id: '11', name: 'Tequila Sunrise', koreanName: '테키라 산리오', abv: '11%', baseLiquor: 'Tequila' },
          { id: '12', name: 'Tommys Margarita', koreanName: '톰미의 마가리타', abv: '13%', baseLiquor: 'Tequila' },
          { id: '13', name: 'El Diablo', koreanName: '엘 디아보로', abv: '12%', baseLiquor: 'Tequila' },
          
          { id: '14', name: 'Martini', koreanName: '마티니', abv: '28%', baseLiquor: 'Gin' },
          { id: '15', name: 'Aviation', koreanName: '에이비전', abv: '21%', baseLiquor: 'Gin' },
          { id: '16', name: 'Last Word', koreanName: '라스트 워드', abv: '23%', baseLiquor: 'Gin' },
          { id: '17', name: 'Gimlet', koreanName: '지믈트', abv: '20%', baseLiquor: 'Gin' },
          { id: '18', name: 'Corpse Reviver #2', koreanName: '코프스 리버 #2', abv: '22%', baseLiquor: 'Gin' },
          
          { id: '19', name: 'Dark & Stormy', koreanName: '다크 앤 스톰리', abv: '11%', baseLiquor: 'Rum' },
          { id: '20', name: 'Piña Colada', koreanName: '피나 콜라다', abv: '13%', baseLiquor: 'Rum' },
          { id: '21', name: 'Mai Tai', koreanName: '마이 타이', abv: '14%', baseLiquor: 'Rum' },
          { id: '22', name: 'Hurricane', koreanName: '허리켄', abv: '15%', baseLiquor: 'Rum' },
          { id: '23', name: 'Jungle Bird', koreanName: '정글 버드', abv: '13%', baseLiquor: 'Rum' },
          
          { id: '24', name: 'Manhattan', koreanName: '맨해튼', abv: '30%', baseLiquor: 'Whiskey' },
          { id: '25', name: 'Boulevardier', koreanName: '부로빌리어', abv: '28%', baseLiquor: 'Whiskey' },
          { id: '26', name: 'Paper Plane', koreanName: '페이퍼 플레인', abv: '25%', baseLiquor: 'Whiskey' },
          { id: '27', name: 'Penicillin', koreanName: '페니실린', abv: '23%', baseLiquor: 'Whiskey' },
          { id: '28', name: 'Gold Rush', koreanName: '골드 러시', abv: '25%', baseLiquor: 'Whiskey' },
          
          { id: '29', name: 'Espresso Martini', koreanName: '에스프레소 마티니', abv: '18%', baseLiquor: 'Vodka' },
          { id: '30', name: 'Cosmopolitan', koreanName: '코스모폴리탄', abv: '20%', baseLiquor: 'Vodka' },
          { id: '31', name: 'Black Russian', koreanName: '블랙 러시안', abv: '25%', baseLiquor: 'Vodka' },
          { id: '32', name: 'White Russian', koreanName: '화이트 러시안', abv: '20%', baseLiquor: 'Vodka' },
          { id: '33', name: 'Vodka Gimlet', koreanName: '보드카 지믈트', abv: '16%', baseLiquor: 'Vodka' },
          
          // Adding some drinks with other base spirits for variety
          { id: '34', name: 'Sidecar', koreanName: '사이드카', abv: '25%', baseLiquor: 'Cognac' },
          { id: '35', name: 'Vieux Carré', koreanName: '비우 카레', abv: '29%', baseLiquor: 'Cognac' },
          { id: '36', name: 'French 75', koreanName: '프랑스 75', abv: '15%', baseLiquor: 'Cognac' },
          
          { id: '37', name: 'Aperol Spritz', koreanName: '에펠로 스프리츠', abv: '11%', baseLiquor: 'Aperitif' },
          { id: '38', name: 'Campari Spritz', koreanName: '캄파리 스프리츠', abv: '11%', baseLiquor: 'Aperitif' },
          
          // Adding some Mezcal cocktails
          { id: '39', name: 'Mezcal Negroni', koreanName: '메즐 네그로니', abv: '24%', baseLiquor: 'Mezcal' },
          { id: '40', name: 'Mezcal Mule', koreanName: '메즐 물', abv: '12%', baseLiquor: 'Mezcal' },
          { id: '41', name: 'Naked & Famous', koreanName: '네이크드 앤 포네임', abv: '22%', baseLiquor: 'Mezcal' }
        ]);
      });
  }, []);

  useEffect(() => {
    // Extract unique categories and create refs for each
    const uniqueCategories = Array.from(new Set(drinks.map(drink => drink.baseLiquor)));
    
    // Define the specific order for base spirits
    const baseOrder = ['Gin', 'Rum', 'Vodka', 'Whiskey', 'Tequila', 'Liquor', 'Mixed'];
    
    // Sort categories according to the specified order
    // If a category is in the baseOrder array, sort by its index
    // If not, place it after all specified categories
    const sortedCategories = uniqueCategories.sort((a, b) => {
      const indexA = baseOrder.indexOf(a);
      const indexB = baseOrder.indexOf(b);
      
      // If both categories are in baseOrder, sort by their indices
      if (indexA >= 0 && indexB >= 0) {
        return indexA - indexB;
      }
      
      // If only a is in baseOrder, it comes first
      if (indexA >= 0) {
        return -1;
      }
      
      // If only b is in baseOrder, it comes first
      if (indexB >= 0) {
        return 1;
      }
      
      // If neither is in baseOrder, maintain alphabetical ordering
      return a.localeCompare(b);
    });
    
    setCategories(sortedCategories);
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
            <span className="mr-2">🍸</span> The Top of Banpo Bar
          </h1>
          
          <Navigator categories={categories} onCategorySelect={scrollToCategory} />
          
          <div className="mt-8">
            {categories.map(category => (
              <div 
                key={category} 
                ref={(el) => setRef(el, category)} 
                className="mb-12"
              >
                <h3 className="text-2xl font-korean text-white px-8 md:px-16 lg:px-32 mb-4">
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

