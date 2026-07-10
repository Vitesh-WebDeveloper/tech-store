import { useState, useEffect } from 'react';

// 1. MOCK DATA: Fixed broken images and changed prices to pure numbers!
const mockProducts = [
  { id: 1, name: "Wireless Headphones", price: 299, category: "Audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
  { id: 2, name: "Smartwatch Pro", price: 199, category: "Wearables", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" },
  { id: 3, name: "Mechanical Keyboard", price: 149, category: "Accessories", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80" }, // Fixed Image
  { id: 4, name: "4K Ultra Monitor", price: 399, category: "Displays", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80" },
  { id: 5, name: "Gaming Mouse", price: 89, category: "Accessories", image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80" }, // Fixed Image
  { id: 6, name: "Studio Microphone", price: 129, category: "Audio", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&q=80" },
];

const categories = ["All", "Audio", "Wearables", "Accessories", "Displays"];

function App() {
  // 2. STATE: The control layer
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Prevents lag while typing
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState(""); // "" | "low" | "high"

  // 3. DEBOUNCE EFFECT: Wait 300ms after user stops typing to update the actual search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 4. THE FILTER & SORT ENGINE
  const filteredProducts = mockProducts
    .filter((product) => {
      // Check if product matches search text
      const matchesSearch = product.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      // Check if product matches selected category
      const matchesCategory = category === "All" || product.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort the remaining products by price! (This is why price must be a number)
      if (sortOrder === "low") return a.price - b.price;
      if (sortOrder === "high") return b.price - a.price;
      return 0; // Don't sort if ""
    });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* NAVBAR */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-indigo-600 tracking-tight">TechStore <span className="text-xl">🚀</span></h1>
          <button className="px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
            <span>Cart</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-md text-sm">0</span>
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* TOP CONTROLS (Search, Filter, Sort) */}
        <div className="flex flex-col gap-6 mb-10 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
          
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-1/3">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all text-slate-700 bg-slate-50 focus:bg-white"
              />
              <span className="absolute left-3.5 top-3.5 text-slate-400">🔍</span>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full md:w-auto px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-slate-700 font-medium bg-slate-50 cursor-pointer"
            >
              <option value="">Sort by Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>

          {/* Category Pill Buttons */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-200 ${
                  category === cat 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS COUNT */}
        <p className="text-sm font-semibold text-slate-500 mb-6 uppercase tracking-wider">
          Showing {filteredProducts.length} Products
        </p>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col">
              
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Details */}
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1.5">{product.category}</span>
                <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{product.name}</h3>
                
                {/* Notice we added the $ sign back here! */}
                <p className="text-2xl font-black text-slate-900 mt-auto pt-4">${product.price}</p>
                
                <button className="mt-4 w-full py-3 bg-slate-900 text-white font-bold rounded-xl md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-600 shadow-md">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}

        </div>

        {/* EMPTY STATE UI */}
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm mt-8">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">👻</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              We couldn't find any matches for <span className="font-bold text-slate-700">"{searchTerm}"</span> in the {category} category.
            </p>
            <button 
              onClick={() => {setSearchTerm(""); setCategory("All"); setSortOrder("");}}
              className="px-6 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;