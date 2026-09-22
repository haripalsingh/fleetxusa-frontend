// Category / product data layer (same backend the React site uses).

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://sandybrown-squirrel-472536.hostingersite.com/backend/api';

// e.g. https://host/backend/api -> https://host/backend
const BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export type Category = {
  id: number | string;
  name: string;
  image_url?: string | null;
};

export type Item = {
  id: number | string;
  name: string;
  image_url?: string | null;
};

const processImageUrl = (url?: string | null): string | null => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('/')) return url;
  if (url.startsWith('uploads/')) return `${BASE_URL}/${url}`;
  return url;
};

export const getCategories = async (): Promise<Category[]> => {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const list: Category[] = Array.isArray(json)
    ? json
    : Array.isArray(json?.data)
      ? json.data
      : [];
  return list.map((c) => ({ ...c, image_url: processImageUrl(c.image_url) }));
};

export const getCategoryItems = async (categoryId: number | string): Promise<Item[]> => {
  try {
    const res = await fetch(`${BASE_URL}/get-category-items.php?category_id=${categoryId}`);
    if (!res.ok) return [];
    const json = await res.json();
    if (json?.success && Array.isArray(json.data)) {
      return json.data.map((i: Item) => ({ ...i, image_url: processImageUrl(i.image_url) }));
    }
    return [];
  } catch {
    return [];
  }
};

// Newer local artwork for known categories (matched by name), same as the React site.
const IMAGE_OVERRIDES: Record<string, string> = {
  'cooling system': '/images/cooling-systems.jpg',
  'cooling systems': '/images/cooling-systems.jpg',
  'filtration system': '/images/filter-cat.jpg',
  'filtration systems': '/images/filter-cat.jpg',
  filter: '/images/filter-cat.jpg',
  'power train': '/images/power-train.jpg',
  powertrain: '/images/power-train.jpg',
};

export const getCategoryImage = (category: Category): string | null =>
  IMAGE_OVERRIDES[category.name.trim().toLowerCase()] || category.image_url || null;

// "Air Spring & Shocks" -> "air-spring-shocks"
export const slugify = (name: string): string =>
  name
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Loose key so "cooling-systems" (home page link) matches "Cooling System" (API name).
export const matchKey = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/s$/, '');
