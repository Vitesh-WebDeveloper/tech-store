import { useState, useEffect } from 'react';

// DAY 24: Fake database to test the cart logic
const MOCK_PRODUCTS = [
  { id: 1, name: "Wireless Headphones", price: 299, image: "🎧" },
  { id: 2, name: "Smartwatch Pro", price: 199, image: "⌚" },
  { id: 3, name: "Mechanical Keyboard", price: 149, image: "⌨️" }
];

function App() {
  // 1. STATE & LOCAL STORAGE INITIALIZATION
  // Passing a function to useState means it only reads from the hard drive ONCE when the app loads.
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("techstore-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // 2. THE SYNC ENGINE (useEffect)
  // Triggers automatically EVERY time the 'cart' changes to save the latest data.
  useEffect(() => {
    localStorage.setItem("techstore-cart", JSON.stringify(cart));
  }, [cart]);

  // 3. CORE LOGIC: ADD TO CART
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // IMMUTABILITY: Create a brand new array, modify only the matching item
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Spread operator copies the old cart and tacks the new product onto the end
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // 4. CORE LOGIC: REMOVE ENTIRELY
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // 5. CORE LOGIC: UPDATE QUANTITY
  const updateQuantity = (productId, amount) => {
    setCart((prevCart) => prevCart.map(item => {
      if (item.id === productId) {
        // Math.max forces the quantity to never drop below 1
        return { ...item, quantity: Math.max(1, item.quantity + amount) };
      }
      return item;
    }));
  };

  // 6. DERIVED STATE (Calculations)
  // We do NOT store total price in useState. We calculate it on the fly.
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // 7. THE UI
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">TechStore</h1>
          <div className="text-right">
            <p className="font-bold text-indigo-600">Cart: {totalItems} items</p>
            <p className="text-sm text-slate-500">Total: ${totalPrice}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left Side: Product List */}
          <div>
            <h2 className="text-xl font-bold text-slate-700 mb-4">Products</h2>
            <div className="space-y-4">
              {MOCK_PRODUCTS.map(product => (
                <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl bg-slate-50 p-3 rounded-lg">{product.image}</span>
                    <div>
                      <h3 className="font-bold text-slate-800">{product.name}</h3>
                      <p className="text-slate-500 font-medium">${product.price}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 transition-colors shadow-sm active:scale-95"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: The Cart */}
          <div>
            <h2 className="text-xl font-bold text-slate-700 mb-4">Your Cart</h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[300px]">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full mt-10 opacity-50">
                  <span className="text-6xl mb-4">🛒</span>
                  <p className="text-slate-500 font-medium">Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-100 pb-4 gap-4">
                      <div>
                        <h3 className="font-bold text-slate-800">{item.name}</h3>
                        <p className="text-indigo-600 font-semibold">${item.price * item.quantity}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200 w-fit">
                        {/* Minus Button */}
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-slate-100 text-slate-600 font-bold shadow-sm"
                        >
                          -
                        </button>
                        
                        <span className="w-8 text-center font-bold text-slate-700">{item.quantity}</span>
                        
                        {/* Plus Button */}
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-slate-100 text-slate-600 font-bold shadow-sm"
                        >
                          +
                        </button>

                        {/* Delete Button */}
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;