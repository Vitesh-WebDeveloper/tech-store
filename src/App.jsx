import { useState } from 'react';

// 1. MOCK DATA: Before we connect to a real database, we use an array of objects.
// This is what our .map() function will loop through!
const mockProducts = [
  { id: 1, name: "Wireless Headphones", price: "$299", category: "Audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
  { id: 2, name: "Smartwatch Pro", price: "$199", category: "Wearables", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" },
  { id: 3, name: "Mechanical Keyboard", price: "$149", category: "Accessories", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80" },
  { id: 4, name: "4K Ultra Monitor", price: "$399", category: "Displays", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80" },
  { id: 5, name: "Gaming Mouse", price: "$89", category: "Accessories", image: "https://images.unsplash.com/photo-1527814050087-379381547969?w=500&q=80" },
  { id: 6, name: "Studio Microphone", price: "$129", category: "Audio", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&q=80" },
];

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* 2. THE NAVBAR: Clean, sticky layout using Tailwind Flexbox */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-indigo-600">TechStore 🚀</h1>
          <button className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition shadow-md hover:shadow-lg">
            Cart (0)
          </button>
        </div>
      </header>

      {/* 3. THE MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Trending Products</h2>

        {/* 4. THE RESPONSIVE GRID: 1 column on phones, 2 on tablets, 3 on desktops */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          
          {/* 5. THE MAP FUNCTION: We loop over the mockProducts array. For each product, we draw one Card. */}
          {mockProducts.map((product) => (
            
            // The "group" class here lets us do cool hover effects on the whole card!
            <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col cursor-pointer">
              
              {/* Product Image with Hover Zoom */}
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Product Details */}
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">{product.category}</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{product.name}</h3>
                <p className="text-2xl font-extrabold text-slate-900 mt-auto">{product.price}</p>
                
                {/* The Add to Cart Button (Fades in on hover on desktops!) */}
                <button className="mt-4 w-full py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-600 hover:text-white shadow-sm">
                  Add to Cart
                </button>
              </div>

            </div>
          ))}

        </div>
      </main>
    </div>
  );
}

export default App;