Day 27: TypeScript Edge (Days 31-34 Combined)

Startups prefer TypeScript because it acts as a strict "spellchecker" for your JavaScript, preventing apps from crashing in production.

1. Day 31: Type Foundations (Primitives, Arrays, & Objects)

In JS, variables can hold anything. In TS, we lock them down.

Primitives:

let username: string = "Vitesh";

let age: number = 22;

let isHired: boolean = true;

Arrays: You must define what goes inside the list.

let scores: number[] = [85, 90, 95]; (Only numbers allowed!)

let skills: string[] = ["React", "Tailwind"];

Objects: You must define the shape of the object.

let user: { name: string, age: number } = { name: "John", age: 30 };

2. Day 32: Custom Structures (Interfaces & Type Aliases)

When objects get too big, we don't write the type inline. We create blueprints.

Type Aliases: Great for creating custom, reusable types.

type ID = string | number; (This means ID can be a string OR a number).

let myId: ID = 123;

Interfaces: The standard way to define the shape of complex objects in React.

interface Product {
  id: number;
  title: string;
  price: number;
  inStock: boolean;
}


3. Day 33: Component Type Safety (React Props)

In plain React, if a Parent passes the wrong props to a Child, the app might crash. TS prevents this.

// 1. Define exactly what props the component expects
interface ButtonProps {
  label: string;
  onClick: () => void; // This means it expects a function that returns nothing
}

// 2. Attach the interface to the component
function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
// Now, if you try to render <Button label={123} />, TS throws an error immediately!


4. Day 34: API Contract Typing & Eliminating any

When we use fetch() in plain JavaScript, the data that comes back is unknown. Beginners use the any keyword in TS to skip checking it (e.g., let data: any = await res.json()).
Startups hate the any keyword. It defeats the whole purpose of TypeScript.

Instead, we define a rigid "Contract" (Interface) for what the API should return.

// The Contract
interface MovieResponse {
  Title: string;
  Year: string;
  Poster: string;
}

// The Fetch Call
async function getMovies() {
  const res = await fetch('https://api.omdb.com/...');
  
  // We force the unknown data to follow our strict contract!
  const data: MovieResponse[] = await res.json(); 
  
  return data;
}
