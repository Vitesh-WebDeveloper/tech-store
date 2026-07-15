// 1. We import our React tools. useState is for memory, useEffect is for auto-saving.
import { useState, useEffect } from 'react';

// 2. This is our fake database. It's just a simple array of objects.
const MOCK_PRODUCTS = [
  { id: 1, name: "Wireless Headphones", price: 299, image: "🎧" },
  { id: 2, name: "Smartwatch Pro", price: 199, image: "⌚" },
  { id: 3, name: "Mechanical Keyboard", price: 149, image: "⌨️" }
];

function App() {
  /* =========================================================================
     SECTION A: STATE & LOCAL STORAGE (The Auto-Save Memory)
     ========================================================================= */
  
  // We are creating a memory box called 'cart'.
  // Normally we just do useState([]). But here, we pass an arrow function inside it.
  // Why? Because we want React to look inside the browser's hard drive FIRST.
  const [cart, setCart] = useState(() => {
    // Look in the hard drive for a saved file named "techstore-cart"
    const savedCart = localStorage.getItem("techstore-cart");
    
    // If the file exists, decode it from text back into a Javascript Array (JSON.parse). 
    // If it DOES NOT exist (null), just start with an empty array [].
    return savedCart ? JSON.parse(savedCart) : [];
  }); 
  
  // UX STATE: This memory box holds the message for our temporary green pop-up.
  const [toast, setToast] = useState(null);
  
  // THE SYNC ENGINE: 
  // useEffect watches the 'cart' array. Every single time the cart changes (item added or removed)...
  // ...it runs this code to save the new cart to the hard drive as a text string (JSON.stringify).
  useEffect(() => {
    localStorage.setItem("techstore-cart", JSON.stringify(cart));
  }, [cart]);


  /* =========================================================================
     SECTION B: CORE LOGIC (Adding, Removing, Updating)
     ========================================================================= */

  // THE BOUNCER: How we add items without making duplicates.
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Step 1: Check the cart. "Is this exact product ID already in our cart?"
      const existingItem = prevCart.find(item => item.id === product.id);
      
      // Step 2: If the product IS already inside...
      if (existingItem) {
        // We loop through the cart using .map(). 
        // When we find the exact product, we copy it (...item) and just change its quantity to + 1.
        // If it's a different product, we just leave it alone (return item).
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      // Step 3: If the product is NOT inside yet...
      // We copy the whole existing cart (...prevCart) and stick the brand new product at the end.
      // We also give it a starting quantity of 1.
      return [...prevCart, { ...product, quantity: 1 }];
    });

    // UX FEEDBACK: After adding the item, show a green message.
    setToast(`Added ${product.name} to cart! ✅`);
    
    // Hide the message after 2.5 seconds (2500 milliseconds)
    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  // THE SIEVE: How we delete an item completely.
  const removeFromCart = (productId) => {
    // .filter() creates a brand new list. It keeps ONLY the items whose ID 
    // DOES NOT match the one we clicked 'Delete' on.
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // THE MATH TRICK: How we handle the + and - buttons.
  const updateQuantity = (productId, amount) => {
    setCart((prevCart) => prevCart.map(item => {
      // Find the specific item the user clicked + or - on.
      if (item.id === productId) {
        // EDGE CASE: If a user has 1 item, and clicks '-', the math is (1 + -1) = 0.
        // We don't want 0 items in the cart! 
        // Math.max(1, 0) compares the two numbers and forces the answer to be the highest one (1).
        return { ...item, quantity: Math.max(1, item.quantity + amount) };
      }
      return item; // If it's not the product we clicked, leave it alone.
    }));
  };

  /* =========================================================================
     SECTION C: DERIVED STATE (The Calculator)
     ========================================================================= */
  // We don't save totals in useState. We just calculate them instantly from the cart data.
  // .reduce() loops through the cart. It adds up all the quantities.
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  // .reduce() loops through the cart. It multiplies (price * quantity) and adds it to the grand total.
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  /* =========================================================================
     SECTION D: THE UI (What the user sees)
     ========================================================================= */
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans relative overflow-hidden">
      
      {/* EDGE CASE UX: The Toast Notification UI */}
      {/* If 'toast' has a message inside it, draw this floating green box */}
      {toast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg font-bold animate-bounce text-sm md:text-base">
          {toast}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">TechStore</h1>
          <div className="text-right">
            <p className="font-bold text-indigo-600">Cart: {totalItems} items</p>
            <p className="text-sm text-slate-500">Total: ${totalPrice}</p>
          </div>
        </header>

        {/* Main Grid: 2 Columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* LEFT SIDE: PRODUCT LIST */}
          <div>
            <h2 className="text-xl font-bold text-slate-700 mb-4">Products</h2>
            <div className="space-y-4">
              
              {/* Loop through our fake database and draw a card for each product */}
              {MOCK_PRODUCTS.map(product => (
                <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl bg-slate-50 p-3 rounded-lg">{product.image}</span>
                    <div>
                      <h3 className="font-bold text-slate-800">{product.name}</h3>
                      <p className="text-slate-500 font-medium">${product.price}</p>
                    </div>
                  </div>
                  
                  {/* The Add Button: Calls our addToCart function and passes the product data */}
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

          {/* RIGHT SIDE: THE CART */}
          <div>
            <h2 className="text-xl font-bold text-slate-700 mb-4">Your Cart</h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[300px]">
              
              {/* EDGE CASE UX: Handling the Empty State */}
              {/* If the cart has 0 items, show this friendly message. */}
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full mt-10 opacity-50">
                  <span className="text-6xl mb-4">🛒</span>
                  <p className="text-slate-500 font-medium">Your cart is empty.</p>
                  <p className="text-sm text-slate-400 mt-2">Add some products to get started!</p>
                </div>
              ) : (
                
                /* If the cart is NOT empty, draw the items */
                <div className="space-y-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-100 pb-4 gap-4">
                      
                      {/* Item Name and Total Price (Price * Quantity) */}
                      <div>
                        <h3 className="font-bold text-slate-800">{item.name}</h3>
                        <p className="text-indigo-600 font-semibold">${item.price * item.quantity}</p>
                      </div>
                      
                      {/* Quantity Controls (+ / - / Delete) */}
                      <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200 w-fit">
                        
                        {/* Minus Button: Passes -1 to our Math Trick function */}
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-slate-100 text-slate-600 font-bold shadow-sm"
                        >
                          -
                        </button>
                        
                        {/* The Quantity Number */}
                        <span className="w-8 text-center font-bold text-slate-700">{item.quantity}</span>
                        
                        {/* Plus Button: Passes 1 to our Math Trick function */}
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-slate-100 text-slate-600 font-bold shadow-sm"
                        >
                          +
                        </button>

                        {/* Delete Button: Calls our Sieve function */}
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          {/* SVG Icon for Trash Can */}
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