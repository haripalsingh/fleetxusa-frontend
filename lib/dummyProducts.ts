// Dummy catalog used until the real product API is connected.
// Everything here is generated deterministically so server and client render the same HTML.

export type DummyCategory = {
  slug: string;
  name: string;
  image: string;
  types: string[];
  colors: string[];
};

export type DummyProduct = {
  id: string;
  categorySlug: string;
  categoryName: string;
  sku: string;
  name: string;
  brand: string;
  type: string;
  color: string;
  priceMin: number;
  priceMax: number;
  image: string;
};

export const DUMMY_CATEGORIES: DummyCategory[] = [
  {
    slug: 'cooling-systems',
    name: 'Cooling System',
    image: '/images/cooling-systems.jpg',
    types: ['Radiators', 'Fan Clutches', 'Water Pumps', 'Thermostats', 'Hoses & Clamps', 'Charge Air Coolers', 'Coolant Reservoirs', 'Air Conditioner'],
    colors: ['Black', 'Silver', 'Aluminum', 'Blue'],
  },
  {
    slug: 'steering-system',
    name: 'Steering System',
    image: '/images/categories/steering-system.jpg',
    types: ['Steering Wheels', 'Steering Columns', 'Tie Rods', 'Drag Links', 'Steering Gearboxes', 'Pitman Arms', 'Power Steering Pumps', 'Steering Knuckles'],
    colors: ['Black', 'Chrome', 'Wood Grain', 'Blue'],
  },
  {
    slug: 'body-and-cabin',
    name: 'Body and Cabin',
    image: '/images/categories/body-and-cabin.jpg',
    types: ['Mirrors', 'Grilles', 'Hoods', 'Fenders', 'Bumpers', 'Door Handles', 'Cab Panels', 'Seat Covers'],
    colors: ['Black', 'White', 'Chrome', 'Gray'],
  },
  {
    slug: 'air-spring-shocks',
    name: 'Air Spring & Shocks',
    image: '/images/categories/air-spring-shocks.jpg',
    types: ['Air Springs', 'Shock Absorbers', 'Leaf Springs', 'Bushings', 'Suspension Kits', 'Height Control Valves', 'Torque Rods', 'Spring Hangers'],
    colors: ['Black', 'Silver', 'Red'],
  },
  {
    slug: 'air-brake-wheel',
    name: 'Air Brake & Wheel',
    image: '/images/categories/air-brake-wheel.jpg',
    types: ['Brake Drums', 'Brake Pads', 'Brake Rotors', 'Brake Chambers', 'Slack Adjusters', 'Wheel Hubs', 'Air Dryers', 'Wheel Seals'],
    colors: ['Black', 'Silver', 'Green', 'Gray'],
  },
  {
    slug: 'chrome-stainless',
    name: 'Chrome & Stainless',
    image: '/images/categories/chrome-stainless.jpg',
    types: ['Lug Nut Covers', 'Bumpers', 'Exhaust Stacks', 'Grille Guards', 'Fender Guards', 'Light Bars', 'Trim & Accents', 'Air Cleaner Covers'],
    colors: ['Chrome', 'Stainless Steel', 'Polished', 'Black'],
  },
];

const BRANDS = ['FleetX', 'Aftermarket', 'Roadmaster', 'Highway Pro', 'Ironclad', 'Prime Heavy Duty'];
const GRADES = ['Heavy-Duty', 'Premium', 'OEM-Style', 'Fleet-Grade', 'Standard', 'Extended Life'];
const PRODUCTS_PER_TYPE = 6;

const singular = (label: string) =>
  label.includes('&')
    ? label
    : label.replace(/(\w+)$/, (w) =>
        w.replace(/ches$/, 'ch').replace(/xes$/, 'x').replace(/ies$/, 'y').replace(/s$/, '')
      );

export const findDummyCategory = (slug: string) =>
  DUMMY_CATEGORIES.find((c) => c.slug === slug);

export const getDummyProducts = (category: DummyCategory): DummyProduct[] => {
  const products: DummyProduct[] = [];
  let n = 0;

  category.types.forEach((type, ti) => {
    for (let i = 0; i < PRODUCTS_PER_TYPE; i++) {
      const seed = ti * 13 + i * 7 + category.slug.length;
      const grade = GRADES[seed % GRADES.length];
      const brand = BRANDS[(seed + i) % BRANDS.length];
      const color = category.colors[(seed + ti) % category.colors.length];
      const priceMin = Math.round((24 + ((seed * 53) % 380) + i * 11) * 100) / 100 - 0.05;
      const hasRange = (seed + i) % 4 === 0;
      const priceMax = hasRange ? Math.round((priceMin + 40 + ((seed * 29) % 220)) * 100) / 100 : priceMin;

      products.push({
        id: `${category.slug}-${n + 1}`,
        categorySlug: category.slug,
        categoryName: category.name,
        sku: String(134000 + DUMMY_CATEGORIES.indexOf(category) * 100 + n),
        name: `${grade} ${singular(type)} ${category.name.split(' ')[0].toUpperCase().slice(0, 2)}${1000 + n * 7}`,
        brand,
        type,
        color,
        priceMin,
        priceMax,
        image: category.image,
      });
      n++;
    }
  });

  return products;
};

const looseKey = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/s$/, '');

// Maps any category name/slug (e.g. "Cooling System" from the API) to a dummy category slug.
export const resolveCategorySlug = (nameOrSlug: string): string | undefined =>
  DUMMY_CATEGORIES.find(
    (c) => looseKey(c.name) === looseKey(nameOrSlug) || looseKey(c.slug) === looseKey(nameOrSlug)
  )?.slug;

export const getDummyProduct = (categorySlug: string, id: string) => {
  const category = findDummyCategory(categorySlug);
  if (!category) return undefined;
  const product = getDummyProducts(category).find((p) => p.id === id);
  return product ? { category, product } : undefined;
};

// Every product from every category, interleaved so "Best Match" mixes categories.
export const getAllDummyProducts = (): DummyProduct[] => {
  const lists = DUMMY_CATEGORIES.map(getDummyProducts);
  const longest = Math.max(...lists.map((l) => l.length));
  const all: DummyProduct[] = [];
  for (let i = 0; i < longest; i++) lists.forEach((l) => l[i] && all.push(l[i]));
  return all;
};
